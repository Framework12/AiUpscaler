'use client';

import React from 'react';

interface GlobalActionsProps {
  error: string | null;
  images: { upscaledUrl: string | null; isLoading: boolean }[];
  isProcessing: boolean;
  handleUpscaleAll: (scale: number) => void;
  handleReset: () => void;
}

export const GlobalActions: React.FC<GlobalActionsProps> = ({ error, images, isProcessing, handleUpscaleAll, handleReset }) => (
  <div className="space-y-4">
    {error && (
      <div className="bg-gradient-to-r from-red-950/80 to-red-900/80 border-2 border-red-800/50 text-red-300 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm flex items-center gap-3">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium">{error}</p>
      </div>
    )}
    <div className="flex flex-col sm:flex-row gap-4">
      {images.some(img => !img.upscaledUrl && !img.isLoading) && (
        <>
          <button onClick={() => handleUpscaleAll(2)} disabled={isProcessing} className="flex-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upscale All (2x)
          </button>
          <button onClick={() => handleUpscaleAll(4)} disabled={isProcessing} className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 flex items-center justify-center gap-2 border border-cyan-400/30">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upscale All (4x)
          </button>
        </>
      )}
      <button onClick={handleReset} disabled={isProcessing} className="flex-1 bg-gradient-to-r from-slate-700/80 to-slate-800/80 text-slate-200 px-6 py-4 rounded-xl font-semibold hover:bg-slate-700 transition-all duration-300 border border-slate-600/50 hover:border-slate-500 flex items-center justify-center gap-2 hover:scale-105 disabled:opacity-50">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Clear All
      </button>
    </div>
  </div>
);
