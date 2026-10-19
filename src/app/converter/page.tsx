'use client';

import React from 'react';
import { UploadZone } from '@/components/converter/upload-zone';
import { ConversionSettings } from '@/components/converter/conversion-settings';
import { ConversionSummary } from '@/components/converter/conversion-summary';
import { ConversionQueue } from '@/components/converter/conversion-queue';
import { useImageConverter } from '@/hooks/use-image-converter';

export default function ConverterPage() {
  const {
    items,
    rejectedFiles,
    options,
    setOptions,
    isConverting,
    zipProgress,
    summary,
    addFiles,
    removeFile,
    clearRejectedFiles,
    clearAll,
    startConversion,
    cancelConversion,
    retryFile,
    downloadFile,
    downloadAllAsZip,
  } = useImageConverter();

  const hasItems = items.length > 0;
  const pendingCount = items.filter(
    (it) => it.status === 'queued' || it.status === 'idle' || it.status === 'failed'
  ).length;

  return (
    <div className="py-8 bg-[#F8F3E9] text-[#25221E] flex-1">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Workspace Subheader */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#E2D8CA]">
          <div>
            <h1 className="text-[20px] sm:text-[24px] font-bold tracking-tight text-[#25221E]">
              WebP Conversion Workspace
            </h1>
            <p className="mt-0.5 text-[12px] text-[#766E63]">
              Batch convert PNG, JPG, WebP, SVG, GIF, BMP, TIFF, AVIF, and ICO files to WebP.
            </p>
          </div>

          {hasItems && (
            <div className="flex items-center gap-3 text-[12px]">
              <span className="font-mono text-[#766E63]">
                {items.length} file{items.length > 1 ? 's' : ''} in queue
              </span>
            </div>
          )}
        </div>

        {/* Drag & Drop Upload Zone */}
        <UploadZone
          onFilesSelected={addFiles}
          rejectedFiles={rejectedFiles}
          onClearRejected={clearRejectedFiles}
          totalSelectedCount={items.length}
        />

        {/* Workspace Controls & Results Dashboard */}
        {hasItems && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Conversion Settings & Actions */}
            <ConversionSettings
              options={options}
              onOptionsChange={setOptions}
              onStartConversion={startConversion}
              onCancelConversion={cancelConversion}
              onClearAll={clearAll}
              isConverting={isConverting}
              hasQueuedItems={pendingCount > 0}
              hasItems={hasItems}
              pendingCount={pendingCount}
            />

            {/* Batch Progress & Size Summary */}
            <ConversionSummary summary={summary} />

            {/* Queue / Results Cards Grid with Search & ZIP Export */}
            <ConversionQueue
              items={items}
              zipProgress={zipProgress}
              onDownloadSingle={downloadFile}
              onDownloadAllAsZip={downloadAllAsZip}
              onRetry={retryFile}
              onRemove={removeFile}
            />
          </div>
        )}
      </div>
    </div>
  );
}
