import type { FC } from 'react';

type Step = {
  number: string;
  title: string;
  description: string;
  icon: string;
};

const STEPS: ReadonlyArray<Step> = [
  {
    number: '01',
    title: 'Upload Your Image',
    description:
      'Select one or multiple images from your computer. Drag and drop or use the file picker.',
    icon: '📤',
  },
  {
    number: '02',
    title: 'Choose Enhancement',
    description:
      'Select the upscaling level and optional enhancements like denoising, sharpening, or face refinement.',
    icon: '⚙️',
  },
  {
    number: '03',
    title: 'AI Processing',
    description:
      'Our AI models analyze every pixel using advanced neural networks to restore detail and boost clarity.',
    icon: '🤖',
  },
  {
    number: '04',
    title: 'Download Result',
    description:
      'Download your upscaled image in high resolution. Export in JPG, PNG, or WebP with a single click.',
    icon: '📥',
  },
];

const FEATURES = [
  {
    title: 'Up to 8× Upscaling',
    description: 'Increase resolution from 256×256 to 2048×2048 without losing sharpness.',
  },
  {
    title: 'Batch Processing',
    description: 'Process up to 100 images in one go to save time on large projects.',
  },
];

const ADVANTAGES = [
  {
    title: 'No Installation Required',
    description: 'Works entirely in your browser—no downloads, no plugins.',
  },
  {
    title: 'Professional Quality',
    description: 'Results suitable for print, campaigns, and commercial use.',
  },
];

const HowItWorks: FC = () => {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 text-center">
          <h2
            id="how-it-works-heading"
            className="text-4xl font-bold text-white sm:text-5xl"
          >
            How It Works
          </h2>
          <p className="mt-4 text-sm text-slate-400 sm:text-base">
            Go from blurry to brilliant in just four simple steps.
          </p>
        </header>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-4">
          {STEPS.map((step, idx) => (
            <article key={step.number} className="relative h-full">
              <div className="flex h-full flex-col rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-500/20">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-2xl shadow-md ring-1 ring-slate-700">
                    <span aria-hidden="true">{step.icon}</span>
                  </div>
                  <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-300 ring-1 ring-cyan-500/60">
                    Step {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white sm:text-xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {step.description}
                </p>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="pointer-events-none absolute inset-y-0 right-[-18px] hidden md:flex items-center">
                  <svg
                    className="h-7 w-7 text-cyan-400/50"
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
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="mt-20 grid gap-12 md:grid-cols-2">
          <section aria-label="Key features of the upscaler">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              Key Features
            </h3>
            <ul className="mt-6 space-y-4">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/10 text-sm font-bold text-cyan-400 ring-1 ring-cyan-500/40">
                    •
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white sm:text-[15px]">
                      {feature.title}
                    </p>
                    <p className="text-xs text-slate-400 sm:text-sm">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-label="Advantages of using this tool">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              Advantages
            </h3>
            <ul className="mt-6 space-y-4">
              {ADVANTAGES.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-400 ring-1 ring-emerald-500/40">
                    ✓
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white sm:text-[15px]">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-400 sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
