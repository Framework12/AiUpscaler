'use client';

import {
  useCallback,
  type DragEvent,
  type ChangeEvent,
} from 'react';
import Link from 'next/link';

import { useImageUploader } from '@/hooks/useImageUploader';
import {
  UploadArea,
  ImageGrid,
  CreditDisplayBanner,
  GlobalActions,
  PremiumModal,
  UploadHeader,
} from './upload';

export default function UploadCard() {
  const {
    state,
    isDragging,
    setIsDragging,
    showPremiumModal,
    setShowPremiumModal,
    fileInputRef,
    maxUploadLimit,
    handleFilesSelect,
    handleUpscale,
    handleUpscaleAll,
    removeImage,
    handleRedoUpscale,
    handleReset,
  } = useImageUploader();

  const hasImages = state.images.length > 0;

  const onFilesSelected = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (!fileArray.length) return;
      handleFilesSelect(fileArray);
    },
    [handleFilesSelect]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer?.files?.length) {
        onFilesSelected(e.dataTransfer.files);
      }
    },
    [onFilesSelected, setIsDragging]
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;

      onFilesSelected(files);
      e.target.value = '';
    },
    [onFilesSelected]
  );

  const handleDragEnter = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    [setIsDragging]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const currentTarget = e.currentTarget;
      if (!currentTarget.contains(e.relatedTarget as Node | null)) {
        setIsDragging(false);
      }
    },
    [setIsDragging]
  );

  return (
    <section
      aria-labelledby="upload-section-heading"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-24 sm:px-6 lg:px-8"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="absolute -right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8">
        <div className="space-y-4">
          <CreditDisplayBanner />
          <UploadHeader />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          id="file-upload"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />

        {!hasImages ? (
          <UploadArea
            isDragging={isDragging}
            handleDragEnter={handleDragEnter}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            maxUploadLimit={maxUploadLimit}
          />
        ) : (
          <ImageGrid
            images={state.images}
            isDragging={isDragging}
            maxUploadLimit={maxUploadLimit}
            fileInputRef={fileInputRef}
            handleDragEnter={handleDragEnter}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            removeImage={removeImage}
            handleUpscale={handleUpscale}
            handleRedoUpscale={handleRedoUpscale}
            isProcessing={state.isProcessing}
          />
        )}

        {hasImages && (
          <GlobalActions
            error={state.error}
            images={state.images}
            isProcessing={state.isProcessing}
            handleUpscaleAll={handleUpscaleAll}
            handleReset={handleReset}
          />
        )}

        {showPremiumModal && (
          <PremiumModal onClose={() => setShowPremiumModal(false)}>
            <div className="flex flex-col gap-6">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-50">
                  Unlock Premium Features
                </h2>
                <p className="text-sm text-slate-400">
                  Go beyond the free tier and speed up your workflow with higher limits,
                  priority processing, and advanced controls.
                </p>

                <ul className="mt-2 space-y-2 text-sm text-slate-200">
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Priority processing for faster results
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Upload up to{' '}
                    <span className="font-semibold">10 images</span> per batch
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Access advanced enhancement settings
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/premium"
                  className="w-full rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 text-center text-sm font-bold text-white shadow-2xl shadow-yellow-500/40 transition duration-300 hover:scale-105 hover:shadow-yellow-500/60"
                >
                  Upgrade to Premium
                </Link>
                <button
                  type="button"
                  onClick={() => setShowPremiumModal(false)}
                  className="w-full rounded-xl bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors duration-200 hover:bg-slate-700"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </PremiumModal>
        )}
      </div>
    </section>
  );
}
