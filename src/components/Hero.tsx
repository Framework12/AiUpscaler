'use client';

import {
  useState,
  useRef,
  useEffect,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
      
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-slate-900/70 px-3 py-1 text-xs font-medium text-purple-200 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              New: V2 Super-Resolution model
            </div>

            <h1 className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-5xl md:text-6xl">
              Upscale Your Image
            </h1>

            <p className="text-base text-slate-300 sm:text-lg md:text-xl">
              Transform low-resolution photos into crisp, high-quality visuals in seconds.
              No Photoshop skills needed just upload, drag, and download.
            </p>

            <div className="flex flex-wrap items-center gap-4">
            <Link 
              href="/upscale"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:shadow-purple-500/60"
            >
              Get Started Free
            </Link>

              <Link
                href="#examples"
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/80"
              >
                View Results
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                No sign-up required
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Up to 4× resolution
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                Preserves natural details
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-purple-800/40 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-cyan-900/30 p-4 shadow-2xl shadow-purple-900/20 sm:p-6">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-cyan-600/10" />
              <div className="relative z-10 h-full w-full">
              <BeforeAfterPreview />
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-slate-500">
              Drag the handle to compare original vs upscaled image
            </p>
          </div>
        </div>

        <div id="examples" className="mt-20">
          <h3 className="mb-3 text-center text-2xl font-bold text-white">
            Results You Can Expect
          </h3>
          <p className="mb-8 text-center text-sm text-slate-400">
            See how AI upscaling improves different types of images.
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Portrait Detail', tag: 'Faces', image: '/assets/potrait.png' },
              { label: 'Product Shot', tag: 'E-commerce', image: '/assets/product.webp' },
              { label: 'Landscape', tag: 'Nature', image: '/assets/landscape.png' },
              { label: 'Artwork', tag: 'Design', image: '/assets/artwork.png' },
            ].map((item, index) => (
              <button
                key={item.label}
                type="button"
                className="group relative flex aspect-square w-full flex-col overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 text-left shadow-sm transition hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                {/* Image */}
                <div className="relative flex flex-1 items-center justify-center overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
         
                <div className="relative z-10 flex items-center justify-between border-t border-slate-700/70 bg-slate-900/90 px-3 py-2 text-[11px] text-slate-300 backdrop-blur-sm">
                  <span className="truncate font-medium">{item.label}</span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                    {item.tag}
                  </span>
                </div>
                <span className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-20 group-hover:bg-gradient-to-br group-hover:from-cyan-500/40 group-hover:to-purple-500/40" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BeforeAfterPreview() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const newPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(newPosition);
  };

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isDragging) return;
    updatePosition(e.clientX);
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(() => {
        updatePosition(e.clientX);
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(() => {
        updatePosition(e.touches[0]?.clientX ?? 0);
      });
    };

    const stopDragging = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchend', stopDragging);

      return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchend', stopDragging);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="group relative aspect-square w-full select-none overflow-hidden rounded-2xl bg-slate-900 shadow-2xl"
      onClick={handleClick}
      style={{ userSelect: 'none' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/assets/after.jpg"
          alt="After upscaling - enhanced high resolution"
          className="h-full w-full object-cover"
          draggable={false}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          width: `${sliderPosition}%`,
          transitionProperty: 'width',
          transitionDuration: isDragging ? '0ms' : '120ms',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Image
          src="/assets/before.jpg"
          alt="Before upscaling - original low resolution"
          className="h-full w-full object-cover"
          draggable={false}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>

      <div
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(sliderPosition)}
        aria-label="Drag to compare original and upscaled image"
        className="absolute top-0 bottom-0 z-10 w-1 cursor-col-resize outline-none"
        style={{
          left: `${sliderPosition}%`,
          transform: 'translateX(-50%)',
          background:
            'linear-gradient(to bottom, rgba(147, 51, 234, 0), rgba(147, 51, 234, 1), rgba(147, 51, 234, 0))',
          boxShadow: isDragging
            ? '0 0 40px rgba(147, 51, 234, 1), 0 0 80px rgba(59, 130, 246, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.4)'
            : '0 0 20px rgba(147, 51, 234, 0.7), 0 0 40px rgba(59, 130, 246, 0.4)',
          transitionDuration: isDragging ? '0ms' : '150ms',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onKeyDown={handleKeyDown}
      >
        <div
          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white/50 shadow-2xl backdrop-blur-sm sm:h-16 sm:w-16"
          style={{
            transform: `translate(-50%, -50%) scale(${isDragging ? 1.15 : 1})`,
            background: isDragging
              ? 'linear-gradient(135deg, rgba(147, 51, 234, 1), rgba(59, 130, 246, 1))'
              : 'linear-gradient(135deg, rgba(147, 51, 234, 0.95), rgba(59, 130, 246, 0.95))',
            boxShadow: isDragging
              ? '0 0 40px rgba(147, 51, 234, 1), 0 0 60px rgba(59, 130, 246, 0.8), inset 0 2px 15px rgba(255, 255, 255, 0.5)'
              : '0 0 25px rgba(147, 51, 234, 0.8), 0 0 40px rgba(59, 130, 246, 0.5), inset 0 1px 8px rgba(255, 255, 255, 0.3)',
            transitionDuration: isDragging ? '0ms' : '200ms',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionProperty: 'transform, box-shadow, background',
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 text-white drop-shadow-lg sm:h-5 sm:w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <div className="h-4 w-0.5 rounded-full bg-white/80" />
            <svg
              className="h-4 w-4 text-white drop-shadow-lg sm:h-5 sm:w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div
          className="pointer-events-none absolute -left-4 -right-4 inset-y-0 transition-all"
          style={{
            background: isDragging
              ? 'radial-gradient(ellipse 20px 100% at center, rgba(147, 51, 234, 0.6), transparent)'
              : 'radial-gradient(ellipse 20px 100% at center, rgba(147, 51, 234, 0.3), transparent)',
            transitionDuration: isDragging ? '0ms' : '200ms',
          }}
        />
      </div>

      <div
        className="absolute bottom-4 left-4 rounded-xl border border-cyan-500/50 bg-gradient-to-r from-slate-950/90 to-slate-900/80 px-3 py-2 text-xs shadow-xl transition-all duration-300 sm:px-4 sm:py-2.5"
        style={{ opacity: Math.min(1, (100 - sliderPosition) / 25) }}
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold tracking-wide text-white">
            Upscaled
          </span>
        </div>
        <p className="mt-1 text-[11px] font-medium text-cyan-300/80">
          High resolution
        </p>
      </div>

      <div
        className="absolute bottom-4 right-4 rounded-xl border border-purple-500/50 bg-gradient-to-r from-slate-900/80 to-slate-950/90 px-3 py-2 text-xs shadow-xl transition-all duration-300 sm:px-4 sm:py-2.5"
        style={{ opacity: Math.min(1, sliderPosition / 25) }}
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs font-bold tracking-wide text-white">
            Original
          </span>
        </div>
        <p className="mt-1 text-[11px] font-medium text-purple-300/80">
          Low resolution
        </p>
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-purple-400/60 bg-slate-950/90 px-4 py-2 text-xs shadow-2xl transition-all duration-300 sm:px-5 sm:py-3"
        style={{
          opacity: isDragging ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${isDragging ? 1 : 0.85})`,
        }}
      >
        <p className="font-bold text-purple-300">
          {Math.round(sliderPosition)}% Original view
        </p>
      </div>

      <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-purple-500/40 bg-gradient-to-r from-purple-900/80 to-blue-900/80 px-4 py-2 text-[11px] font-semibold text-white shadow-lg">
        <p className="flex items-center gap-2">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
          Drag or use arrow keys to compare
        </p>
      </div>
    </div>
  );
}
