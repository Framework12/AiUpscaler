'use client';

import { useEffect, useState } from 'react';
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
  const { user } = useUser();
  const [history, setHistory] = useState<ImageHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('images')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching history:', error);
        } else {
          setHistory(data);
        }
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8">Upscale History</h1>
        {history.length === 0 ? (
          <p className="text-slate-400">You have no upscaled images yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {history.map((item) => (
              <div key={item.id} className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 shadow-lg border border-slate-700">
                <BeforeAfterSlider beforeImage={item.original_url} afterImage={item.upscaled_url} />
                <div className="mt-4">
                  <p className="text-sm text-slate-400">Upscaled {item.scale}x on {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
