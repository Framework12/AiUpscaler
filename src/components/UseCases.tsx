'use client';

import type { FC } from 'react';

type UseCase = {
  title: string;
  description: string;
  icon: string;
  color: string; 
};

const USE_CASES: ReadonlyArray<UseCase> = [
  {
    title: 'Photography',
    description:
      'Enhance old photos, remove noise, and enlarge images for printing without visible quality loss.',
    icon: '📷',
    color: 'from-red-400 to-pink-500',
  },
  {
    title: 'Gaming',
    description:
      'Upscale game screenshots and key art to create stunning, high-resolution assets and thumbnails.',
    icon: '🎮',
    color: 'from-green-400 to-blue-500',
  },
  {
    title: 'E-commerce',
    description:
      'Sharpen product photos, highlight details, and increase conversion rates with crisp visuals.',
    icon: '🛍️',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    title: 'Design',
    description:
      'Upscale design assets, illustrations, and UI elements to generate multiple resolution exports automatically.',
    icon: '🎨',
    color: 'from-purple-400 to-pink-500',
  },
  {
    title: 'Video',
    description:
      'Prepare still frames and concept shots for video production, or generate clean 4K assets from HD sources.',
    icon: '🎬',
    color: 'from-blue-400 to-purple-500',
  },
  {
    title: 'Archive',
    description:
      'Restore and improve old scans, documents, and archived photographs for long-term preservation.',
    icon: '📚',
    color: 'from-amber-400 to-orange-500',
  },
];

const UseCases: FC = () => {
  return (
    <section
      id="use-cases"
      aria-labelledby="use-cases-heading"
      className="bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 text-center">
          <h2
            id="use-cases-heading"
            className="text-4xl font-bold text-white sm:text-5xl"
          >
            Perfect For Every Use Case
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-slate-400 sm:text-lg">
            Whether you&apos;re a photographer, designer, streamer, or business
            owner, our AI upscaler helps you create sharp, professional visuals
            in seconds.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((useCase) => (
            <article
              key={useCase.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-7 text-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-500/20"
            >
              <div
                className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${useCase.color} opacity-0 transition-opacity duration-300 group-hover:opacity-20`}
              />

              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/80 text-2xl shadow-md ring-1 ring-slate-700 group-hover:ring-cyan-400/70">
                <span aria-hidden="true">{useCase.icon}</span>
              </div>

              <h3 className="text-xl font-semibold text-white sm:text-2xl">
                {useCase.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                {useCase.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-400">
                <span className="rounded-full bg-slate-900/80 px-2.5 py-1 ring-1 ring-slate-700/80">
                  AI upscaling
                </span>
                <span className="rounded-full bg-slate-900/70 px-2.5 py-1 ring-1 ring-slate-800/70">
                  High resolution
                </span>
              </div>

              <button
                type="button"
                className="mt-6 inline-flex items-center text-sm font-semibold text-cyan-400 opacity-0 outline-none transition-opacity group-hover:opacity-100"
                aria-label={`Learn more about ${useCase.title} use case`}
              >
                <span>Learn more</span>
                <svg
                  className="ml-1.5 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
