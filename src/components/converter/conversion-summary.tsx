'use client';

import React from 'react';
import {
  TrendingDown,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  HardDrive,
  FileCheck,
} from 'lucide-react';
import { BatchSummary } from '@/lib/image-converter/types';
import { formatBytes } from '@/lib/image-converter/file-naming';

interface ConversionSummaryProps {
  summary: BatchSummary;
}

export function ConversionSummary({ summary }: ConversionSummaryProps) {
  if (summary.totalFiles === 0) return null;

  const percentComplete =
    summary.totalFiles > 0
      ? Math.round(((summary.completedCount + summary.failedCount) / summary.totalFiles) * 100)
      : 0;

  const isSavingsPositive = summary.aggregateSavingsBytes > 0;
  const isNeutral = summary.aggregateSavingsBytes === 0;

  return (
    <div className="space-y-3">
      {/* Progress & Summary Bar */}
      <div className="rounded-[8px] border border-[#E2D8CA] bg-[#F5EFE4] p-4 text-[#25221E]">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#25221E]">Batch Status:</span>
            <span className="font-mono text-[#766E63]">
              {summary.completedCount} / {summary.totalFiles} converted
            </span>
          </div>

          <div className="flex items-center gap-3 font-medium">
            {summary.processingCount > 0 && (
              <span className="flex items-center gap-1.5 text-[#95653E]">
                <span className="h-2 w-2 rounded-[99px] bg-[#95653E]" />
                Processing {summary.processingCount} in parallel
              </span>
            )}

            {summary.failedCount > 0 && (
              <span className="flex items-center gap-1 text-[#9E3B33]">
                <AlertTriangle className="h-3.5 w-3.5" />
                {summary.failedCount} Failed
              </span>
            )}

            <span className="font-mono text-[#25221E] font-bold">{percentComplete}%</span>
          </div>
        </div>

        {/* Progress Track */}
        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-[99px] bg-[#E2D8CA]">
          <div
            className="h-full bg-[#95653E] transition-all duration-200"
            style={{ width: `${percentComplete}%` }}
          />
        </div>

        {/* 4 Metric Cards */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {/* 1. Completed */}
          <div className="rounded-[6px] border border-[#E2D8CA] bg-[#FFFFFF] p-3 text-[#25221E]">
            <div className="flex items-center justify-between text-[#766E63]">
              <span className="text-[11px] font-medium">Completed</span>
              <CheckCircle className="h-3.5 w-3.5 text-[#2E6B4E]" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-[18px] font-bold font-mono text-[#25221E]">
                {summary.completedCount}
              </span>
              <span className="text-[11px] text-[#766E63]">
                / {summary.totalFiles}
              </span>
            </div>
          </div>

          {/* 2. Original Size */}
          <div className="rounded-[6px] border border-[#E2D8CA] bg-[#FFFFFF] p-3 text-[#25221E]">
            <div className="flex items-center justify-between text-[#766E63]">
              <span className="text-[11px] font-medium">Input Size</span>
              <HardDrive className="h-3.5 w-3.5 text-[#766E63]" />
            </div>
            <div className="mt-1">
              <span className="text-[18px] font-bold font-mono text-[#25221E]">
                {formatBytes(summary.totalOriginalSize)}
              </span>
            </div>
          </div>

          {/* 3. Converted Size */}
          <div className="rounded-[6px] border border-[#E2D8CA] bg-[#FFFFFF] p-3 text-[#25221E]">
            <div className="flex items-center justify-between text-[#766E63]">
              <span className="text-[11px] font-medium">WebP Output</span>
              <FileCheck className="h-3.5 w-3.5 text-[#95653E]" />
            </div>
            <div className="mt-1">
              <span className="text-[18px] font-bold font-mono text-[#95653E]">
                {formatBytes(summary.totalConvertedSize)}
              </span>
            </div>
          </div>

          {/* 4. Aggregate Savings */}
          <div className="rounded-[6px] border border-[#E2D8CA] bg-[#FFFFFF] p-3 text-[#25221E]">
            <div className="flex items-center justify-between text-[#766E63]">
              <span className="text-[11px] font-medium">Payload Delta</span>
              {isSavingsPositive ? (
                <TrendingDown className="h-3.5 w-3.5 text-[#2E6B4E]" />
              ) : isNeutral ? (
                <span className="text-[11px] text-[#766E63] font-mono">—</span>
              ) : (
                <TrendingUp className="h-3.5 w-3.5 text-[#9E3B33]" />
              )}
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              {summary.completedCount === 0 ? (
                <span className="text-[18px] font-bold font-mono text-[#766E63]">0%</span>
              ) : isSavingsPositive ? (
                <>
                  <span className="text-[18px] font-bold font-mono text-[#2E6B4E]">
                    -{summary.aggregateSavingsPercent}%
                  </span>
                  <span className="text-[10px] text-[#766E63] font-mono truncate">
                    ({formatBytes(summary.aggregateSavingsBytes)})
                  </span>
                </>
              ) : isNeutral ? (
                <span className="text-[18px] font-bold font-mono text-[#766E63]">0%</span>
              ) : (
                <>
                  <span className="text-[18px] font-bold font-mono text-[#9E3B33]">
                    +{Math.abs(summary.aggregateSavingsPercent)}%
                  </span>
                  <span className="text-[10px] text-[#9E3B33]">
                    (larger)
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
