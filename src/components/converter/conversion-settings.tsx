'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Play,
  Trash2,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Info,
  Square,
} from 'lucide-react';
import { ConversionOptions } from '@/lib/image-converter/types';

interface ConversionSettingsProps {
  options: ConversionOptions;
  onOptionsChange: (options: ConversionOptions) => void;
  onStartConversion: () => void;
  onCancelConversion: () => void;
  onClearAll: () => void;
  isConverting: boolean;
  hasQueuedItems: boolean;
  hasItems: boolean;
  pendingCount: number;
}

export function ConversionSettings({
  options,
  onOptionsChange,
  onStartConversion,
  onCancelConversion,
  onClearAll,
  isConverting,
  hasQueuedItems,
  hasItems,
  pendingCount,
}: ConversionSettingsProps) {
  const [showResize, setShowResize] = useState(false);

  const handleQualityChange = (val: number) => {
    onOptionsChange({
      ...options,
      quality: val,
    });
  };

  const handleLosslessToggle = (lossless: boolean) => {
    onOptionsChange({
      ...options,
      lossless,
    });
  };

  const handleResizeToggle = (enableResize: boolean) => {
    onOptionsChange({
      ...options,
      enableResize,
    });
  };

  const getQualityLabel = (q: number, lossless: boolean) => {
    if (lossless) return 'Lossless: Mathematical pixel-for-pixel accuracy';
    if (q >= 90) return 'High Fidelity: Near-lossless output';
    if (q >= 75) return 'Standard Web: Optimal balance (recommended)';
    if (q >= 50) return 'High Compression: Smaller payload';
    return 'Aggressive Compression';
  };

  return (
    <div className="rounded-[8px] border border-[#E2D8CA] bg-[#F5EFE4] p-4 text-[#25221E]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2D8CA]">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[99px] bg-[#E6D8C5] text-[#95653E]">
            <Sliders className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-[#25221E]">
              Conversion Settings
            </h3>
            <p className="text-[11px] text-[#766E63]">
              WebP encoding parameters and dimensional bounding boxes
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          {isConverting ? (
            <button
              onClick={onCancelConversion}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-[99px] border border-[#9E3B33] bg-[#F8EBEA] px-3.5 py-1.5 text-[12px] font-semibold text-[#9E3B33] hover:bg-[#9E3B33] hover:text-[#F8F3E9] transition-colors cursor-pointer"
            >
              <Square className="h-3 w-3 fill-current" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={onStartConversion}
              disabled={!hasQueuedItems || isConverting}
              type="button"
              className={`inline-flex items-center gap-1.5 rounded-[99px] px-4 py-1.5 text-[12px] font-semibold transition-colors ${
                hasQueuedItems && !isConverting
                  ? 'bg-[#95653E] text-[#F8F3E9] hover:bg-[#79502F] active:bg-[#624024] cursor-pointer'
                  : 'bg-[#E6D8C5] text-[#766E63] cursor-not-allowed'
              }`}
            >
              <Play className="h-3 w-3 fill-current" />
              <span>
                Convert {pendingCount > 0 ? `(${pendingCount} Images)` : 'All to WebP'}
              </span>
            </button>
          )}

          {hasItems && (
            <button
              onClick={onClearAll}
              disabled={isConverting}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-[99px] border border-[#E2D8CA] bg-[#F8F3E9] px-3.5 py-1.5 text-[12px] font-medium text-[#25221E] hover:bg-[#E6D8C5] active:bg-[#E2D8CA] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear Queue</span>
            </button>
          )}
        </div>
      </div>

      {/* Settings Grid */}
      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Quality Controls */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label htmlFor="quality-slider" className="text-[12px] font-bold text-[#25221E]">
                Quality:
              </label>
              <span className="rounded-[99px] border border-[#E2D8CA] bg-[#F8F3E9] px-2 py-0.5 text-[11px] font-mono font-bold text-[#95653E]">
                {options.lossless ? 'Lossless' : `${options.quality}%`}
              </span>
            </div>
            {/* Lossless Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer text-[12px] font-medium text-[#766E63]">
              <input
                type="checkbox"
                checked={options.lossless}
                onChange={(e) => handleLosslessToggle(e.target.checked)}
                className="h-3.5 w-3.5 rounded-sm accent-[#95653E] cursor-pointer"
              />
              <span>Lossless WebP</span>
            </label>
          </div>

          <input
            id="quality-slider"
            type="range"
            min={1}
            max={100}
            step={1}
            value={options.quality}
            disabled={options.lossless}
            onChange={(e) => handleQualityChange(Number(e.target.value))}
            className="w-full accent-[#95653E] disabled:opacity-40 cursor-pointer"
          />

          <p className="text-[11px] text-[#766E63] flex items-center gap-1">
            <Info className="h-3 w-3 text-[#95653E] shrink-0" />
            <span>{getQualityLabel(options.quality, options.lossless)}</span>
          </p>
        </div>

        {/* Dimension Constraints */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowResize(!showResize)}
              className="inline-flex items-center gap-1 text-[12px] font-bold text-[#25221E] hover:text-[#95653E] cursor-pointer"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Resize Controls</span>
              {showResize ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            <label className="flex items-center gap-1.5 cursor-pointer text-[12px] font-medium text-[#766E63]">
              <input
                type="checkbox"
                checked={options.enableResize}
                onChange={(e) => handleResizeToggle(e.target.checked)}
                className="h-3.5 w-3.5 rounded-sm accent-[#95653E] cursor-pointer"
              />
              <span>Constrain Dimensions</span>
            </label>
          </div>

          {showResize ? (
            <div className="grid grid-cols-2 gap-2.5 rounded-[6px] border border-[#E2D8CA] bg-[#F8F3E9] p-2.5">
              <div>
                <label className="block text-[11px] font-medium text-[#766E63]">
                  Max Width (px)
                </label>
                <input
                  type="number"
                  min={10}
                  max={10000}
                  value={options.maxWidth || 1920}
                  disabled={!options.enableResize}
                  onChange={(e) =>
                    onOptionsChange({
                      ...options,
                      maxWidth: Math.max(10, Number(e.target.value)),
                    })
                  }
                  className="mt-1 w-full rounded-[4px] border border-[#E2D8CA] bg-[#FFFFFF] px-2 py-1 text-[12px] text-[#25221E] disabled:opacity-40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#766E63]">
                  Max Height (px)
                </label>
                <input
                  type="number"
                  min={10}
                  max={10000}
                  value={options.maxHeight || 1080}
                  disabled={!options.enableResize}
                  onChange={(e) =>
                    onOptionsChange({
                      ...options,
                      maxHeight: Math.max(10, Number(e.target.value)),
                    })
                  }
                  className="mt-1 w-full rounded-[4px] border border-[#E2D8CA] bg-[#FFFFFF] px-2 py-1 text-[12px] text-[#25221E] disabled:opacity-40"
                />
              </div>

              <div className="col-span-2 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-[#766E63]">
                  <input
                    type="checkbox"
                    checked={options.preserveAspectRatio}
                    disabled={!options.enableResize}
                    onChange={(e) =>
                      onOptionsChange({
                        ...options,
                        preserveAspectRatio: e.target.checked,
                      })
                    }
                    className="h-3.5 w-3.5 rounded-sm accent-[#95653E] cursor-pointer"
                  />
                  <span>Preserve aspect ratio</span>
                </label>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-[#766E63]">
              {options.enableResize
                ? `Max bound: ${options.maxWidth}×${options.maxHeight}px`
                : 'Original image dimensions preserved (no downscaling)'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
