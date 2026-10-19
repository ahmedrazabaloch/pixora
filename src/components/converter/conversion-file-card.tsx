'use client';

import React from 'react';
import {
  Download,
  RotateCw,
  X,
  FileImage,
  Check,
  AlertCircle,
  Loader2,
  TrendingDown,
  TrendingUp,
  Maximize,
} from 'lucide-react';
import { ConversionItem } from '@/lib/image-converter/types';
import { formatBytes } from '@/lib/image-converter/file-naming';

interface ConversionFileCardProps {
  item: ConversionItem;
  onDownload: (id: string) => void;
  onRetry: (id: string) => void;
  onRemove: (id: string) => void;
}

export function ConversionFileCard({
  item,
  onDownload,
  onRetry,
  onRemove,
}: ConversionFileCardProps) {
  const isCompleted = item.status === 'completed';
  const isProcessing = item.status === 'processing';
  const isFailed = item.status === 'failed';

  const savings = item.savingsPercent ?? 0;
  const isReduced = savings > 0;
  const isEnlarged = savings < 0;

  return (
    <div className="flex flex-col justify-between rounded-[8px] border border-[#E2D8CA] bg-[#FFFFFF] p-3 text-[#25221E]">
      {/* Top row: Thumbnail & Basic Info */}
      <div className="flex items-start gap-3">
        {/* Thumbnail Box */}
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[4px] border border-[#E2D8CA] bg-[#F5EFE4]">
          {item.thumbnailUrl && item.originalFormat !== 'tiff' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.thumbnailUrl}
              alt={item.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <FileImage className="h-6 w-6 text-[#766E63]" />
          )}

          {/* Status overlay */}
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#25221E]/60">
              <Loader2 className="h-4 w-4 animate-spin text-[#F8F3E9]" />
            </div>
          )}
          {isCompleted && (
            <div className="absolute right-1 bottom-1 flex h-4 w-4 items-center justify-center rounded-[99px] bg-[#2E6B4E] text-[#FFFFFF]">
              <Check className="h-2.5 w-2.5" />
            </div>
          )}
          {isFailed && (
            <div className="absolute right-1 bottom-1 flex h-4 w-4 items-center justify-center rounded-[99px] bg-[#9E3B33] text-[#FFFFFF]">
              <AlertCircle className="h-2.5 w-2.5" />
            </div>
          )}
        </div>

        {/* File Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1.5">
            <h4
              title={item.name}
              className="truncate text-xs font-semibold text-[#25221E]"
            >
              {item.name}
            </h4>
            <button
              onClick={() => onRemove(item.id)}
              disabled={isProcessing}
              title="Remove"
              type="button"
              className="shrink-0 text-[#766E63] hover:text-[#95653E] disabled:opacity-40 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Format badge & dimensions */}
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="rounded-[99px] border border-[#E2D8CA] bg-[#F8F3E9] px-2 py-0.5 text-[10px] font-mono uppercase text-[#766E63]">
              {item.originalFormat}
            </span>

            {item.outputDimensions && (
              <span className="flex items-center gap-0.5 text-[11px] font-mono text-[#766E63]">
                <Maximize className="h-2.5 w-2.5" />
                {item.outputDimensions.width}×{item.outputDimensions.height}
              </span>
            )}
          </div>

          {/* Notices */}
          {item.animatedNotice && (
            <p className="mt-1 text-[10px] text-[#95653E]">
              Note: {item.animatedNotice}
            </p>
          )}

          {item.isSvgRasterized && (
            <p className="mt-1 text-[10px] text-[#766E63]">
              SVG rasterized to WebP bitmap
            </p>
          )}

          {/* Error Message */}
          {isFailed && item.error && (
            <p className="mt-1 text-[11px] text-[#9E3B33] break-words">
              {item.error}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Row: Size & Actions */}
      <div className="mt-2.5 pt-2 border-t border-[#E2D8CA] flex items-center justify-between gap-2">
        <div className="text-xs">
          {isCompleted && item.outputSize ? (
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-[#766E63] line-through text-[11px]">
                {formatBytes(item.originalSize)}
              </span>
              <span className="font-semibold text-[#25221E]">
                {formatBytes(item.outputSize)}
              </span>

              {isReduced ? (
                <span className="inline-flex items-center gap-0.5 rounded-[99px] border border-[#CDE0D4] bg-[#E8F2EC] px-2 py-0.5 text-[10px] font-bold text-[#2E6B4E]">
                  <TrendingDown className="h-2.5 w-2.5" />
                  -{savings}%
                </span>
              ) : isEnlarged ? (
                <span className="inline-flex items-center gap-0.5 rounded-[99px] border border-[#ECCFCB] bg-[#F8EBEA] px-2 py-0.5 text-[10px] font-bold text-[#9E3B33]">
                  <TrendingUp className="h-2.5 w-2.5" />
                  +{Math.abs(savings)}%
                </span>
              ) : (
                <span className="rounded-[99px] border border-[#E2D8CA] bg-[#F8F3E9] px-2 py-0.5 text-[10px] text-[#766E63]">
                  0%
                </span>
              )}
            </div>
          ) : isProcessing ? (
            <span className="flex items-center gap-1 text-xs text-[#95653E]">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Encoding...</span>
            </span>
          ) : isFailed ? (
            <span className="text-xs font-semibold text-[#9E3B33]">
              Error
            </span>
          ) : (
            <span className="text-xs font-mono text-[#766E63]">
              {formatBytes(item.originalSize)}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div>
          {isCompleted && item.outputBlob && (
            <button
              onClick={() => onDownload(item.id)}
              type="button"
              className="inline-flex items-center gap-1 rounded-[99px] bg-[#95653E] px-3 py-1 text-xs font-semibold text-[#F8F3E9] transition-colors hover:bg-[#79502F] active:bg-[#624024] cursor-pointer"
            >
              <Download className="h-3 w-3" />
              <span>WebP</span>
            </button>
          )}

          {isFailed && (
            <button
              onClick={() => onRetry(item.id)}
              type="button"
              className="inline-flex items-center gap-1 rounded-[99px] border border-[#95653E] bg-transparent px-3 py-1 text-xs font-semibold text-[#95653E] hover:bg-[#95653E] hover:text-[#F8F3E9] active:bg-[#79502F] transition-colors cursor-pointer"
            >
              <RotateCw className="h-3 w-3" />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
