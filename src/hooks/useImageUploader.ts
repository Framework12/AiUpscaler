'use client';

import { useState, useRef, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { upscaleImage } from '@/lib/services/upscaleService';
import { supabase } from '@/lib/supabaseClient';

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
  const { user } = useUser();
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

  const handleFilesSelect = useCallback((files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      setState(prev => ({ ...prev, error: 'Please select valid image files' }));
      return;
    }

    const currentCount = state.images.length;
    const remainingSlots = maxUploadLimit - currentCount;
    if (imageFiles.length > remainingSlots) {
      setState(prev => ({ ...prev, error: `You can only upload ${remainingSlots} more images.` }));
      return;
    }

    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage: ImageItem = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: reader.result as string,
          upscaledUrl: null,
          isLoading: false,
          error: null,
        };
        setState(prev => ({ ...prev, images: [...prev.images, newImage], error: null }));
      };
      reader.readAsDataURL(file);
    });
  }, [state.images.length, maxUploadLimit]);

  const handleUpscale = useCallback(async (imageId: string, scale: number = 2) => {
    const image = state.images.find(img => img.id === imageId);
    if (!image) return;

    
    if (user && !user.isPremium) {
      // Check if a non-premium user has enough credits for a single upscale
      if ((user.credits || 0) < 1) {
        setShowPremiumModal(true);
        return;
      }
    } else {
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
        if (user && !user.isPremium) {
          const newCredits = Math.max(0, (user.credits || 0) - 1);
          await supabase.from('profiles').update({ credits: newCredits }).eq('id', user.id);
        } else if (!user) {
          setAnonymousUpscaleCount(prev => prev + 1);
        }
        setState(prev => ({
          ...prev,
          images: prev.images.map(img =>
            img.id === imageId ? { ...img, upscaledUrl: result.url || null, isLoading: false, scale } : img
          ),
        }));
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
  }, [state.images, user]);

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
