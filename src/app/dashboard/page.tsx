'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useState,
  useEffect,
  memo,
  type FC,
  useCallback,
  useMemo,
} from 'react';
import { useUser } from '@/context/UserContext';

const TAB_BUTTONS = ['Overview'] as const;
type TabType = (typeof TAB_BUTTONS)[number];

const CARD_BASE =
  'bg-slate-800/50 backdrop-blur rounded-xl p-6 shadow-lg border border-slate-700';
const SECTION_CARD_BASE =
  'bg-slate-800/50 backdrop-blur rounded-2xl p-8 shadow-lg border border-slate-700';

type StatCardProps = {
  label: string;
  value: string | number;
  subtext?: string;
  isGradient?: boolean;
};

const StatCard: FC<StatCardProps> = memo(
  ({ label, value, subtext, isGradient = false }) => (
    <article className={CARD_BASE + ' transition hover:border-purple-500/50'}>
      <p className="mb-2 text-sm text-slate-400">{label}</p>
      <p
        className={`text-4xl font-bold ${
          isGradient
            ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'
            : 'text-cyan-400'
        }`}
      >
        {value}
      </p>
      {subtext && <p className="mt-2 text-xs text-slate-500">{subtext}</p>}
    </article>
  )
);
StatCard.displayName = 'StatCard';

type MetricItemProps = {
  label: string;
  value: string;
  color: string; 
};

const MetricItem: FC<MetricItemProps> = memo(({ label, value, color }) => (
  <article className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
    <p className="mb-2 text-sm text-slate-400">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </article>
));
MetricItem.displayName = 'MetricItem';

type TabButtonProps = {
  label: TabType;
  isActive: boolean;
  onClick: () => void;
};

const TabButton: FC<TabButtonProps> = memo(({ label, isActive, onClick }) => (
  <button
    type="button"
    role="tab"
    aria-selected={isActive}
    className={`px-4 py-3 font-semibold transition ${
      isActive
        ? 'border-b-2 border-cyan-400 text-cyan-400'
        : 'text-slate-400 hover:text-white'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
));
TabButton.displayName = 'TabButton';

const FREE_CREDITS = 10;
const FREE_STORAGE_GB = 1;

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, logout } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('Overview');
  const isAuthed = !!user;

  useEffect(() => {
    // Wait for loading to complete before redirecting
    if (!loading && !user) {
      console.log('Dashboard: No user found, redirecting to signin');
      router.replace('/auth/signin');
    }
  }, [user, loading, router]);

  const handleSignOut = useCallback(() => {
    logout();
    router.replace('/auth/signin');
  }, [logout, router]);

  const { imagesUpscaled, creditsRemaining, creditsSubtext } = useMemo(() => {
    if (!user) {
      return {
        imagesUpscaled: '—',
        creditsRemaining: '—',
        creditsSubtext: 'of 10 credits',
      };
    }

    if (user.isPremium) {
      return {
        imagesUpscaled: user.totalUpscales ?? '—',
        creditsRemaining: '∞',
        creditsSubtext: 'Unlimited for premium users',
      };
    }

    const usedCredits = Math.max(
      0,
      FREE_CREDITS - (user.credits ?? 0)
    );
    const remaining = Math.max(0, user.credits ?? 0);

    return {
      imagesUpscaled: usedCredits,
      creditsRemaining: remaining,
      creditsSubtext: `of ${FREE_CREDITS} credits`,
    };
  }, [user]);

  // Show loading state while checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-slate-400 sm:text-base">
              {user
                ? `Welcome back, ${user.firstName ?? 'there'}! Manage your upscaling projects.`
                : 'Manage your upscaling projects.'}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-lg border border-red-600/50 bg-red-600/20 px-6 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-600/30"
            type="button"
            aria-label="Sign out"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!isAuthed ? (
          <section
            aria-label="Loading dashboard"
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-slate-400"
          >
            Loading your dashboard…
          </section>
        ) : (
          <>
            <section
              aria-label="Account statistics"
              className="mb-8 grid gap-6 md:grid-cols-4"
            >
              <StatCard
                label="Images Upscaled"
                value={imagesUpscaled}
                subtext={user?.totalUpscales ? 'All-time upscales' : undefined}
                isGradient
              />
              <StatCard
                label="Credits Remaining"
                value={creditsRemaining}
                subtext={creditsSubtext}
              />
              <StatCard
                label="Storage Used"
                value="0 GB"
                subtext={`of ${FREE_STORAGE_GB} GB available`}
              />
              <article className="rounded-xl border border-purple-700/50 bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-6 shadow-lg backdrop-blur">
                <p className="mb-2 text-sm text-slate-300">Account Status</p>
                <p className="mb-2 text-2xl font-bold text-cyan-400">
                  {user?.isPremium ? 'Premium Plan' : 'Free Plan'}
                </p>
                <Link
                  href="/billing"
                  className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
                >
                  Manage subscription →
                </Link>
              </article>
            </section>

            <nav
              className="mb-8 flex gap-4 border-b border-slate-800"
              role="tablist"
              aria-label="Dashboard views"
            >
              {TAB_BUTTONS.map((tab) => (
                <TabButton
                  key={tab}
                  label={tab}
                  isActive={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                />
              ))}
            </nav>

            {activeTab === 'Overview' && (
              <section className="grid gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  <section
                    aria-label="Performance metrics"
                    className={SECTION_CARD_BASE}
                  >
                    <h2 className="mb-6 text-2xl font-bold text-white">
                      Performance Metrics
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                      <MetricItem
                        label="Average Processing Time"
                        value="—"
                        color="text-blue-400"
                      />
                      <MetricItem
                        label="Quality Score"
                        value="—"
                        color="text-emerald-400"
                      />
                      <MetricItem
                        label="Successful Upscales"
                        value={String(user?.totalUpscales ?? '—')}
                        color="text-cyan-400"
                      />
                      <MetricItem
                        label="Monthly Usage"
                        value="—"
                        color="text-purple-400"
                      />
                    </div>
                  </section>

                  <section
                    aria-label="Recent upscaled images"
                    className={SECTION_CARD_BASE}
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">
                        Recent Upscales
                      </h2>
                      <Link
                        href="/history"
                        className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
                      >
                        View all →
                      </Link>
                    </div>
                    <div className="flex items-center justify-center py-12 text-center">
                      <div>
                        <svg
                          className="mx-auto mb-4 h-16 w-16 text-slate-600 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-slate-400">No upscales yet</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Your recent upscales will appear here once you start
                          processing images.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                <aside
                  aria-label="Dashboard tips and shortcuts"
                  className="space-y-4"
                >
                  <div className={SECTION_CARD_BASE}>
                    <h3 className="text-lg font-semibold text-white">
                      Quick Tips
                    </h3>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-400">
                      <li>Try upscaling a portrait and a product image.</li>
                      <li>Use history to re-download previous results.</li>
                      <li>Upgrade to premium for higher limits.</li>
                    </ul>
                  </div>
                </aside>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
