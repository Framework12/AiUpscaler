'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabaseClient';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

interface ImageHistory {
  id: string;
  created_at: string;
  original_url: string;
  upscaled_url: string;
  scale: number;
}

export default function HistoryPage() {
  const router = useRouter();
  const { user } = useUser();
  const [history, setHistory] = useState<ImageHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (!loading && !user) {
      router.push('/auth/signin');
      return;
    }

    const fetchHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('images')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching history:', error);
          setError('Failed to load history');
        } else {
          setHistory(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, router, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your history...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Upscale History</h1>
              <p className="text-slate-400">View all your upscaled images</p>
            </div>
            <Link
              href="/dashboard"
              className="text-cyan-400 hover:text-cyan-300 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error ? (
          <div className="bg-red-950/50 border border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-24 w-24 text-slate-600 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">No upscaled images yet</h2>
            <p className="text-slate-400 mb-6">Start upscaling images to see them here</p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
            >
              Start Upscaling
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 text-slate-400">
              <p>{history.length} image{history.length !== 1 ? 's' : ''} upscaled</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 shadow-lg border border-slate-700 hover:border-purple-500/50 transition"
                >
                  <BeforeAfterSlider beforeImage={item.original_url} afterImage={item.upscaled_url} />
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Upscaled {item.scale}x
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <a
                      href={item.upscaled_url}
                      download
                      className="text-cyan-400 hover:text-cyan-300 transition"
                      title="Download"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
