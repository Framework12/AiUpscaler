'use client';

import React from 'react';
import { ImageItem as ImageItemType } from '@/hooks/useImageUploader';
import { ImageCard } from '.';

interface ImageGridProps {
  images: ImageItemType[];
  isDragging: boolean;
  maxUploadLimit: number;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  removeImage: (id: string) => void;
  handleUpscale: (id: string, scale: number) => void;
  handleRedoUpscale: (id: string) => void;
  isProcessing: boolean;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, isDragging, maxUploadLimit, fileInputRef, handleDragEnter, handleDragOver, handleDragLeave, handleDrop, removeImage, handleUpscale, handleRedoUpscale, isProcessing }) => (
  <div
    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 relative ${
      isDragging ? 'scale-[1.01]' : ''
    }`}
    onDragEnter={handleDragEnter}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
  >
    {images.map(image => (
      <ImageCard
        key={image.id}
        image={image}
        removeImage={removeImage}
        handleUpscale={handleUpscale}
        handleRedoUpscale={handleRedoUpscale}
        isProcessing={isProcessing}
      />
    ))}
    {images.length < maxUploadLimit && (
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center min-h-[300px] rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-cyan-400 bg-gradient-to-br from-cyan-950/30 to-blue-950/30 shadow-2xl shadow-cyan-500/30 scale-105'
            : 'border-slate-700 hover:border-purple-500/60 bg-gradient-to-br from-slate-800/40 to-slate-900/40 hover:bg-slate-800/60'
        }`}
      >
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600/20 to-cyan-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-purple-400 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Add More Photos</h3>
          <p className="text-sm text-slate-400 mb-4">{maxUploadLimit - images.length} slots remaining</p>
        </div>
      </div>
    )}
  </div>
);
