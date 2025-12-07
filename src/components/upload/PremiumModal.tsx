'use client';

import React from 'react';
import Link from 'next/link';

interface PremiumModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-purple-700/50 shadow-2xl max-w-md w-full p-8">
      <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {children}
    </div>
  </div>
);
