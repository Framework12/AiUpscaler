'use client';

import React from 'react';

interface UploadAreaProps {
  isDragging: boolean;
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  maxUploadLimit: number;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ isDragging, handleDragEnter, handleDragOver, handleDragLeave, handleDrop, maxUploadLimit }) => (
  <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
    <div className="order-2 lg:order-1">
      <div
        className={`group relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 ${
          isDragging
            ? 'border-cyan-400 bg-gradient-to-br from-cyan-950/30 to-blue-950/30 shadow-2xl shadow-cyan-500/30 scale-[1.02]'
            : 'border-slate-700 hover:border-purple-500/60 bg-gradient-to-br from-slate-800/40 to-slate-900/40 hover:shadow-2xl hover:shadow-purple-500/20'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="relative mb-6">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 mb-4 transition-transform duration-300 ${isDragging ? 'scale-110 rotate-12' : 'group-hover:scale-105'}`}>
            <svg
              className={`w-10 h-10 transition-colors duration-300 ${isDragging ? 'text-cyan-400' : 'text-purple-400 group-hover:text-cyan-400'}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white relative z-10">
          {isDragging ? <span className="text-cyan-400">Drop your photos here</span> : <span>Drag & Drop Your Photos</span>}
        </h3>
        <p className="text-slate-400 mb-8 relative z-10">Select multiple photos or click to browse from your computer</p>
        <label htmlFor="file-upload" className="relative z-10 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold cursor-pointer hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 mb-6 group/btn">
          <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-y-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Choose Photos
        </label>
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /><span>JPG, PNG, WebP</span></div>
          <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /><span>Max 10MB</span></div>
          <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-purple-400" /><span>Up to {maxUploadLimit} images</span></div>
        </div>
      </div>
    </div>
    <div className="order-1 lg:order-2 flex items-center justify-center lg:justify-end">
      <div className="relative w-full max-w-xs">
        <div className="relative rounded-3xl overflow-hidden border-2 border-purple-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 shadow-2xl shadow-purple-900/30 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/70 hover:shadow-purple-500/40 hover:scale-105">
          <div className="relative aspect-[9/16] bg-slate-900">
            <video className="w-full h-full object-cover" autoPlay loop muted playsInline controls width="256" height="456">
              <source src="/assets/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  </div>
);
