'use client';

import React from 'react';
import { ImageItem } from '@/hooks/useImageUploader';
import BeforeAfterSlider from '../BeforeAfterSlider';

interface ImageCardProps {
  image: ImageItem;
  removeImage: (id: string) => void;
  handleUpscale: (id: string, scale: number) => void;
  handleRedoUpscale: (id: string) => void;
  isProcessing: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, removeImage, handleUpscale, handleRedoUpscale, isProcessing }) => (
  <div className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-4 border border-slate-700/50 shadow-xl backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
    <button
      onClick={() => removeImage(image.id)}
      className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <div className="relative rounded-xl overflow-hidden bg-slate-900/50 border border-slate-700/50 mb-4">
      <img src={image.preview} alt="Preview" className="w-full h-48 object-cover" />
      {image.isLoading && (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
        </div>
      )}
    </div>
    {image.upscaledUrl ? (
      <div className="space-y-3">
        <div className="bg-slate-900/70 rounded-t-lg p-3 border-b border-emerald-500/30">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-emerald-400">Upscaled {image.scale || 2}x</p>
            <p className="text-xs text-slate-400">New Dimensions: 2048x2048</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-3">
          <BeforeAfterSlider beforeImage={image.preview} afterImage={image.upscaledUrl} />
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <a href={image.upscaledUrl} download={`upscaled-${image.id}.webp`} className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-3 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 text-center flex items-center justify-center gap-2 hover:scale-105 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </a>
          <button onClick={() => handleRedoUpscale(image.id)} className="bg-slate-700/50 text-slate-300 px-3 py-2.5 rounded-lg font-semibold hover:bg-slate-700 transition border border-slate-600 text-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 20v-5h-5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9a9 9 0 0114.13-5.12" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 15a9 9 0 01-14.13 5.12" />
            </svg>
            Re-Upscale
          </button>
        </div>
      </div>
    ) : image.error ? (
      <div className="bg-red-950/50 border border-red-800/50 text-red-300 px-3 py-2 rounded-lg text-xs">{image.error}</div>
    ) : (
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => handleUpscale(image.id, 2)} disabled={image.isLoading || isProcessing} className="bg-gradient-to-br from-purple-600 to-blue-600 text-white px-3 py-2.5 rounded-lg font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm hover:scale-105">2x</button>
        <button onClick={() => handleUpscale(image.id, 4)} disabled={image.isLoading || isProcessing} className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white px-3 py-2.5 rounded-lg font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm hover:scale-105 border border-cyan-400/30">4x</button>
      </div>
    )}
  </div>
);
