'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useUser();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/95 shadow-lg shadow-purple-900/20 border-b border-purple-900/30'
          : 'bg-slate-950/80 border-b border-slate-900/50'
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-slate-950 font-bold text-lg">AI</span>
            </div>
            <span className="font-bold text-white text-lg sm:text-xl">ImageUpscaler</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              href="#how-it-works"
              className="text-slate-400 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              How it Works
            </Link>
            <Link
              href="#use-cases"
              className="text-slate-400 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              Use Cases
            </Link>
            <Link
              href="/premium"
              className="text-slate-400 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              Premium
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {user ? (
              <div className="relative">
                <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                  <span className="text-white font-semibold">{user.firstName}</span>
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Dashboard</Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 lg:px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition duration-200 inline-block"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden bg-slate-900/50 backdrop-blur-sm border-t border-slate-800 animate-in fade-in slide-in-from-top-2">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="#how-it-works"
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition duration-200"
                onClick={handleLinkClick}
              >
                How it Works
              </Link>
              <Link
                href="#use-cases"
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition duration-200"
                onClick={handleLinkClick}
              >
                Use Cases
              </Link>
              <div className="px-3 py-2">
                <Link
                  href="/auth/signin"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition duration-200 block text-center"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

