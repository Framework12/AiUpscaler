'use client';

import { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Original',
  afterLabel = 'Upscaled',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const newPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(newPosition);
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
        updatePosition(e.touches[0].clientX);
      });
    };

    const handleMouseUp = () => setIsDragging(false);
    const handleTouchEnd = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(newPosition);
  };

  return (
    <div className="w-full space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl bg-slate-800 cursor-col-resize select-none group"
        onClick={handleClick}
        style={{ paddingBottom: '66.67%' }} 
      >
        <img
          src={afterImage}
          alt="Upscaled"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        <div
          className="absolute inset-0 overflow-hidden transition-all"
          style={{ 
            width: `${sliderPosition}%`,
            transitionDuration: isDragging ? '0ms' : '50ms',
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <img
            src={beforeImage}
            alt="Original - Low Resolution"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              imageRendering: 'pixelated',
              filter: 'blur(0.5px)',
              transform: 'scale(0.5)',
              transformOrigin: 'top left'
            }}
            draggable={false}
          />
        </div>

        <div
          className="absolute top-0 bottom-0 w-1 transition-all"
          style={{ 
            left: `${sliderPosition}%`, 
            transform: 'translateX(-50%)',
            background: 'linear-gradient(to bottom, rgba(34, 211, 238, 0), rgba(34, 211, 238, 1), rgba(34, 211, 238, 0))',
            boxShadow: isDragging 
              ? '0 0 30px rgba(34, 211, 238, 1), 0 0 60px rgba(34, 211, 238, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3)'
              : '0 0 15px rgba(34, 211, 238, 0.6)',
            transitionDuration: isDragging ? '0ms' : '50ms',
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div 
            className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full shadow-2xl border-4 border-white/40 transition-all flex items-center justify-center backdrop-blur-sm"
            style={{ 
              transform: `translate(-50%, -50%) scale(${isDragging ? 1.25 : 1})`,
              background: isDragging
                ? 'linear-gradient(135deg, rgba(34, 211, 238, 1), rgba(59, 130, 246, 1))'
                : 'linear-gradient(135deg, rgba(34, 211, 238, 0.95), rgba(59, 130, 246, 0.95))',
              boxShadow: isDragging
                ? '0 0 30px rgba(34, 211, 238, 0.9), 0 0 50px rgba(59, 130, 246, 0.6), inset 0 2px 10px rgba(255, 255, 255, 0.4)'
                : '0 0 20px rgba(34, 211, 238, 0.6), inset 0 1px 5px rgba(255, 255, 255, 0.2)',
              transitionDuration: isDragging ? '0ms' : '150ms',
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionProperty: 'transform, box-shadow, background'
            }}
          >
            <div className="flex gap-3 items-center justify-center opacity-100 transition-opacity">
              <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div 
            className="absolute inset-y-0 -left-3 -right-3 pointer-events-none transition-all"
            style={{
              background: isDragging
                ? 'radial-gradient(ellipse 15px 100% at center, rgba(34, 211, 238, 0.5), transparent)'
                : 'radial-gradient(ellipse 15px 100% at center, rgba(34, 211, 238, 0.2), transparent)',
              transitionDuration: isDragging ? '0ms' : '150ms'
            }}
          >
          </div>
        </div>

              </div>

          </div>
  );
}
