'use client';

import { useState, useRef, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { upscaleImage } from '@/lib/services/upscaleService';

export interface ImageItem {
  id: string;
  file: File;
  preview: string;
  upscaledUrl: string | null;
  scale?: number;
  isLoading: boolean;
  error: string | null;
}

export interface UploadState {
  images: ImageItem[];
  isProcessing: boolean;
  error: string | null;
}

export const useImageUploader = () => {
  const { user, refreshUser } = useUser();
  const [state, setState] = useState<UploadState>({
    images: [],
    isProcessing: false,
    error: null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [anonymousUpscaleCount, setAnonymousUpscaleCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxUploadLimit = user ? 10 : 5;
  const MAX_FILE_SIZE_MB = 10; // Increased from 2MB to 10MB
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleFilesSelect = useCallback((files: File[]) => {
    console.log('handleFilesSelect called with files:', files.length);
    
    const imageFiles = files.filter(file => {
      console.log('Checking file:', file.name, file.type, file.size);
      
      if (!file.type.startsWith('image/')) {
        console.log('File rejected: not an image');
        return false;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        console.log('File rejected: too large');
        setState(prev => ({ ...prev, error: `Image "${file.name}" is too large. Please upload files smaller than ${MAX_FILE_SIZE_MB}MB.` }));
        return false;
      }
      console.log('File accepted:', file.name);
      return true;
    });

    console.log('Image files after filtering:', imageFiles.length);

    if (imageFiles.length === 0) {
      console.log('No valid image files');
      return;
    }

    const currentCount = state.images.length;
    const remainingSlots = maxUploadLimit - currentCount;
    console.log('Current images:', currentCount, 'Remaining slots:', remainingSlots);
    
    if (imageFiles.length > remainingSlots) {
      setState(prev => ({ ...prev, error: `You can only upload ${remainingSlots} more images.` }));
      return;
    }

    console.log('Processing', imageFiles.length, 'files...');
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('File read complete:', file.name);
        const newImage: ImageItem = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: reader.result as string,
          upscaledUrl: null,
          isLoading: false,
          error: null,
        };
        setState(prev => {
          console.log('Adding image to state, current count:', prev.images.length);
          return { ...prev, images: [...prev.images, newImage], error: null };
        });
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
      };
      console.log('Starting to read file:', file.name);
      reader.readAsDataURL(file);
    });
  }, [state.images.length, maxUploadLimit, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB]);

  const handleUpscale = useCallback(async (imageId: string, scale: number = 2) => {
    const image = state.images.find(img => img.id === imageId);
    if (!image) return;

    // Check credits before upscaling
    if (user && !user.isPremium) {
      if ((user.credits || 0) < 1) {
        setShowPremiumModal(true);
        return;
      }
    } else if (!user) {
      if (anonymousUpscaleCount >= 5) {
        setState(prev => ({ ...prev, error: 'You have used your 5 free upscales. Please sign in to continue.' }));
        return;
      }
    }

    setState(prev => ({
      ...prev,
      images: prev.images.map(img => img.id === imageId ? { ...img, isLoading: true, error: null } : img),
      isProcessing: true,
    }));

    try {
      const result = await upscaleImage(image.preview, scale, user?.id);
      
      if (result.success && result.url) {
        // Update image state
        setState(prev => ({
          ...prev,
          images: prev.images.map(img =>
            img.id === imageId ? { ...img, upscaledUrl: result.url || null, isLoading: false, scale } : img
          ),
        }));

        // Refresh user data from database to get updated credits
        if (user) {
          console.log('Refreshing user data to get updated credits...');
          await refreshUser();
          console.log('User data refreshed');
        }

        // Track anonymous upscales
        if (!user) {
          setAnonymousUpscaleCount(prev => prev + 1);
        }
      } else {
        setState(prev => ({
          ...prev,
          images: prev.images.map(img =>
            img.id === imageId ? { ...img, error: result.error || 'Failed to upscale', isLoading: false } : img
          ),
        }));
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        images: prev.images.map(img =>
          img.id === imageId ? { ...img, error: `Error: ${errorMsg}`, isLoading: false } : img
        ),
      }));
    } finally {
      setState(prev => ({
        ...prev,
        isProcessing: prev.images.some(img => img.isLoading && img.id !== imageId),
      }));
    }
  }, [state.images, user, anonymousUpscaleCount, refreshUser]);

  const handleUpscaleAll = useCallback(async (scale: number = 2) => {
    const imagesToUpscale = state.images.filter(img => !img.upscaledUrl && !img.isLoading);
    if (user && !user.isPremium) {
      // Check if a non-premium user has enough credits for a batch upscale
      if ((user.credits || 0) < imagesToUpscale.length) {
        setShowPremiumModal(true);
        return;
      }
    }
    for (const image of imagesToUpscale) {
      await handleUpscale(image.id, scale);
    }
  }, [state.images, user, handleUpscale]);

  const removeImage = useCallback((id: string) => {
    setState(prev => ({ ...prev, images: prev.images.filter(img => img.id !== id) }));
  }, []);

  const handleRedoUpscale = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      images: prev.images.map(img =>
        img.id === id ? { ...img, upscaledUrl: null, error: null, scale: undefined } : img
      ),
    }));
  }, []);

  const handleReset = useCallback(() => {
    setState({ images: [], isProcessing: false, error: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  return {
    state,
    user,
    isDragging,
    setIsDragging,
    showPremiumModal,
    setShowPremiumModal,
    fileInputRef,
    maxUploadLimit,
    handleFilesSelect,
    handleUpscale,
    handleUpscaleAll,
    removeImage,
    handleRedoUpscale,
    handleReset,
  };
};
