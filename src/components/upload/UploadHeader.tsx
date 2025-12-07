'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

export const UploadHeader: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="mb-16 text-center">
      <h2 className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-4xl font-extrabold mb-4 text-transparent sm:text-5xl">
        Upload Your Images
      </h2>
      <p className="text-lg text-slate-400 max-w-2xl mx-auto">
        Transform your images with Ai Upscaler
      </p>
      {!user && (
        <p className="text-sm text-slate-500 mt-2">
          Upload up to 5 images. <Link href="/auth/signin" className="text-cyan-400 hover:text-cyan-300 font-semibold">Sign in</Link> for up to 10 images and 10 free credits!
        </p>
      )}
    </div>
  );
};
