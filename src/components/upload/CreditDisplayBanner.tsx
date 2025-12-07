'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

export const CreditDisplayBanner: React.FC = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="mb-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-700/50 rounded-2xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{user.credits}</span>
            </div>
            <div>
              <p className="text-sm text-slate-300 font-semibold">Credits Available</p>
              <p className="text-xs text-slate-400">
                {user.isPremium ? 'Unlimited (Premium)' : `${user.credits} of 10 credits`}
              </p>
            </div>
          </div>
          {!user.isPremium && user.credits === 0 && (
            <Link href="/premium" className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-yellow-500/50 transition-all hover:scale-105">
              Upgrade to Premium
            </Link>
          )}
        </div>
        {!user.isPremium && user.credits > 0 && (
          <div className="text-xs text-slate-400">1 credit = 1 upscale</div>
        )}
      </div>
    </div>
  );
};
