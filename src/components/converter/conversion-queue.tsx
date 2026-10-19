'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Archive,
  Loader2,
} from 'lucide-react';
import { ConversionItem } from '@/lib/image-converter/types';
import { ConversionFileCard } from './conversion-file-card';

interface ConversionQueueProps {
  items: ConversionItem[];
  zipProgress: number | null;
  onDownloadSingle: (id: string) => void;
  onDownloadAllAsZip: () => void;
  onRetry: (id: string) => void;
  onRemove: (id: string) => void;
}

type FilterTab = 'all' | 'completed' | 'queued' | 'failed';

export function ConversionQueue({
  items,
  zipProgress,
  onDownloadSingle,
  onDownloadAllAsZip,
  onRetry,
  onRemove,
}: ConversionQueueProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const completedCount = useMemo(
    () => items.filter((it) => it.status === 'completed').length,
    [items]
  );
  const queuedCount = useMemo(
    () => items.filter((it) => it.status === 'queued' || it.status === 'idle').length,
    [items]
  );
  const failedCount = useMemo(
    () => items.filter((it) => it.status === 'failed').length,
    [items]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Tab filter
      if (activeTab === 'completed' && item.status !== 'completed') return false;
      if (activeTab === 'queued' && item.status !== 'queued' && item.status !== 'idle' && item.status !== 'processing')
        return false;
      if (activeTab === 'failed' && item.status !== 'failed') return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.originalFormat.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [items, activeTab, searchQuery]);

  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Controls Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-[8px] border border-[#E2D8CA] bg-[#F5EFE4] p-3 text-[#25221E]">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('all')}
            type="button"
            className={`rounded-[99px] px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#95653E] text-[#F8F3E9] font-semibold'
                : 'text-[#766E63] hover:bg-[#E6D8C5] hover:text-[#25221E]'
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            type="button"
            className={`rounded-[99px] px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-[#2E6B4E] text-[#FFFFFF] font-semibold'
                : 'text-[#766E63] hover:bg-[#E6D8C5] hover:text-[#25221E]'
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            onClick={() => setActiveTab('queued')}
            type="button"
            className={`rounded-[99px] px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'queued'
                ? 'bg-[#95653E] text-[#F8F3E9] font-semibold'
                : 'text-[#766E63] hover:bg-[#E6D8C5] hover:text-[#25221E]'
            }`}
          >
            Pending ({queuedCount})
          </button>
          {failedCount > 0 && (
            <button
              onClick={() => setActiveTab('failed')}
              type="button"
              className={`rounded-[99px] px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'failed'
                  ? 'bg-[#9E3B33] text-[#FFFFFF] font-semibold'
                  : 'border border-[#ECCFCB] text-[#9E3B33] hover:bg-[#F8EBEA]'
              }`}
            >
              Failed ({failedCount})
            </button>
          )}
        </div>

        {/* Right side: Search & ZIP Download */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative flex-1 sm:w-48 sm:flex-initial">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#766E63]" />
            <input
              type="text"
              placeholder="Filter names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-[99px] border border-[#E2D8CA] bg-[#FFFFFF] py-1.5 pl-8 pr-3 text-xs text-[#25221E] placeholder:text-[#766E63] focus:border-[#95653E] focus:outline-hidden"
            />
          </div>

          {/* Download All as ZIP button */}
          <button
            onClick={onDownloadAllAsZip}
            disabled={completedCount === 0 || zipProgress !== null}
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-[99px] px-4 py-1.5 text-xs font-semibold transition-colors ${
              completedCount > 0 && zipProgress === null
                ? 'bg-[#95653E] text-[#F8F3E9] hover:bg-[#79502F] active:bg-[#624024] cursor-pointer'
                : 'bg-[#E6D8C5] text-[#766E63] cursor-not-allowed'
            }`}
          >
            {zipProgress !== null ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Packing ZIP ({zipProgress}%)...</span>
              </>
            ) : (
              <>
                <Archive className="h-3.5 w-3.5" />
                <span>Download ZIP</span>
                {completedCount > 0 && (
                  <span className="rounded-[99px] bg-[#FFFFFF]/25 px-1.5 py-0.2 font-mono text-[10px]">
                    {completedCount}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ZIP packaging progress bar */}
      {zipProgress !== null && (
        <div className="rounded-[8px] border border-[#95653E] bg-[#F5EFE4] p-3 text-[#25221E]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#95653E]">
            <span className="flex items-center gap-1.5">
              <Archive className="h-3.5 w-3.5 text-[#95653E]" />
              Compressing WebP archive...
            </span>
            <span className="font-mono">{zipProgress}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-[99px] bg-[#E2D8CA]">
            <div
              className="h-full bg-[#95653E] transition-all duration-150"
              style={{ width: `${zipProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Card Grid */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <ConversionFileCard
            key={item.id}
            item={item}
            onDownload={onDownloadSingle}
            onRetry={onRetry}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* Empty Filter State */}
      {filteredItems.length === 0 && (
        <div className="rounded-[8px] border border-[#E2D8CA] bg-[#FFFFFF] p-6 text-center">
          <p className="text-xs text-[#766E63]">
            No images match your filter query.
          </p>
        </div>
      )}
    </div>
  );
}
