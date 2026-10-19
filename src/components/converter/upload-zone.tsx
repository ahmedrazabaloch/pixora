'use client';

import React, { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, AlertCircle, FileX, Plus } from 'lucide-react';
import { RejectedFile } from '@/hooks/use-image-converter';
import { formatBytes } from '@/lib/image-converter/file-naming';

interface UploadZoneProps {
  onFilesSelected: (files: FileList | File[]) => void;
  rejectedFiles: RejectedFile[];
  onClearRejected: () => void;
  totalSelectedCount: number;
}

const SUPPORTED_FORMATS = [
  'PNG',
  'JPG / JPEG',
  'WebP',
  'SVG',
  'GIF',
  'BMP',
  'TIFF',
  'AVIF',
  'ICO',
];

export function UploadZone({
  onFilesSelected,
  rejectedFiles,
  onClearRejected,
  totalSelectedCount,
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      e.target.value = '';
    }
  };

  const triggerPicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="converter" className="w-full space-y-3">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.png,.jpg,.jpeg,.webp,.svg,.gif,.bmp,.tiff,.tif,.avif,.ico"
        onChange={handleFileChange}
        className="hidden"
        id="bulk-image-input"
      />

      {/* Protoface Clean Drag-and-Drop Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerPicker}
        className={`group relative flex flex-col items-center justify-center rounded-[8px] border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
          isDragOver
            ? 'border-[#95653E] bg-[#E6D8C5]/40'
            : 'border-[#E2D8CA] bg-[#F5EFE4] hover:border-[#95653E]'
        }`}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-[99px] bg-[#E6D8C5] text-[#95653E]">
          <Upload className="h-5 w-5" />
        </div>

        <h3 className="mt-3 text-[13px] font-bold text-[#25221E]">
          Drop images here, or{' '}
          <span className="text-[#95653E] underline underline-offset-2">
            browse local files
          </span>
        </h3>

        <p className="mt-1 text-[11px] text-[#766E63]">
          Bulk selection supported. Max 50MB per image. Up to 100 images per batch.
        </p>

        {/* Supported format badges */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 max-w-lg">
          {SUPPORTED_FORMATS.map((fmt) => (
            <span
              key={fmt}
              className="rounded-[99px] border border-[#E2D8CA] bg-[#F8F3E9] px-2.5 py-0.5 text-[11px] font-mono text-[#766E63]"
            >
              {fmt}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerPicker();
            }}
            className="inline-flex items-center gap-1.5 rounded-[99px] bg-[#95653E] px-4 py-2 text-[12px] font-semibold text-[#F8F3E9] transition-colors hover:bg-[#79502F] active:bg-[#624024] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{totalSelectedCount > 0 ? 'Add More Images' : 'Select Images'}</span>
          </button>
        </div>
      </div>

      {/* Rejected Files Alert */}
      {rejectedFiles.length > 0 && (
        <div className="rounded-[8px] border border-[#ECCFCB] bg-[#F8EBEA] p-4 text-[#25221E]">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-[#9E3B33] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[12px] font-bold text-[#9E3B33]">
                  {rejectedFiles.length} file{rejectedFiles.length > 1 ? 's' : ''} skipped:
                </h4>
                <div className="mt-1.5 space-y-1 text-[11px] text-[#766E63]">
                  {rejectedFiles.map((rej) => (
                    <div key={rej.id} className="flex items-center gap-1.5">
                      <FileX className="h-3 w-3 shrink-0 text-[#9E3B33]" />
                      <span className="font-medium truncate max-w-xs text-[#25221E]">{rej.name}</span>
                      <span className="text-[#9E3B33]">({formatBytes(rej.size)}):</span>
                      <span>{rej.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={onClearRejected}
              type="button"
              className="text-[11px] font-semibold text-[#95653E] underline hover:text-[#79502F] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
