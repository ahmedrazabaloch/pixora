'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  ConversionItem,
  ConversionOptions,
  BatchSummary,
} from '@/lib/image-converter/types';
import { validateInputFile } from '@/lib/image-converter/validation';
import { convertImageToWebp } from '@/lib/image-converter/browser-converter';
import {
  calculateSavingsPercent,
  generateUniqueWebpFilenames,
  replaceExtensionWithWebp,
} from '@/lib/image-converter/file-naming';
import { createWebpZipArchive } from '@/lib/image-converter/zip-generator';
import {
  downloadSingleWebpFile,
  downloadZipArchive,
} from '@/lib/image-converter/download-manager';

const DEFAULT_OPTIONS: ConversionOptions = {
  quality: 80,
  lossless: false,
  enableResize: false,
  maxWidth: 1920,
  maxHeight: 1080,
  preserveAspectRatio: true,
};

const MAX_CONCURRENT = 3;

export interface RejectedFile {
  id: string;
  name: string;
  size: number;
  reason: string;
}

export function useImageConverter() {
  const [items, setItems] = useState<ConversionItem[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<RejectedFile[]>([]);
  const [options, setOptions] = useState<ConversionOptions>(DEFAULT_OPTIONS);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [zipProgress, setZipProgress] = useState<number | null>(null);

  // Cancellation ref to gracefully abort queue
  const isCancelledRef = useRef<boolean>(false);
  const itemsRef = useRef<ConversionItem[]>([]);

  // Keep itemsRef synchronized safely in useEffect
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => {
        if (item.thumbnailUrl) {
          URL.revokeObjectURL(item.thumbnailUrl);
        }
      });
    };
  }, []);

  /**
   * Add new files to the queue with validation
   */
  const addFiles = useCallback(async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    if (fileArray.length === 0) return;

    const validatedItems: ConversionItem[] = [];
    const newRejected: RejectedFile[] = [];

    // Collect all existing names to ensure unique output names
    const existingNames = itemsRef.current.map((item) => item.name);
    const combinedNames = [...existingNames, ...fileArray.map((f) => f.name)];
    const uniqueOutputs = generateUniqueWebpFilenames(combinedNames);
    const newOutputs = uniqueOutputs.slice(existingNames.length);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const validation = await validateInputFile(file);

      if (!validation.valid) {
        newRejected.push({
          id: `rej_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          reason: validation.error || 'Unsupported or invalid image file',
        });
        continue;
      }

      // Create preview thumbnail URL safely
      let thumbnailUrl: string | undefined;
      try {
        thumbnailUrl = URL.createObjectURL(file);
      } catch {
        // Thumbnail preview optional
      }

      const id = `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${i}`;

      validatedItems.push({
        id,
        file,
        name: file.name,
        originalFormat: validation.format,
        originalSize: file.size,
        thumbnailUrl,
        status: 'queued',
        progress: 0,
        stageText: 'Ready to convert',
        outputFilename: newOutputs[i] || replaceExtensionWithWebp(file.name),
        isAnimatedGif: validation.isAnimated,
        animatedNotice: validation.isAnimated
          ? 'Animated GIF: First frame will be converted to static WebP'
          : undefined,
      });
    }

    if (newRejected.length > 0) {
      setRejectedFiles((prev) => [...prev, ...newRejected]);
    }

    if (validatedItems.length > 0) {
      setItems((prev) => [...prev, ...validatedItems]);
    }
  }, []);

  /**
   * Remove an item from the queue
   */
  const removeFile = useCallback((id: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.thumbnailUrl) {
        URL.revokeObjectURL(target.thumbnailUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  /**
   * Clear rejected files list
   */
  const clearRejectedFiles = useCallback(() => {
    setRejectedFiles([]);
  }, []);

  /**
   * Clear all files from queue
   */
  const clearAll = useCallback(() => {
    itemsRef.current.forEach((item) => {
      if (item.thumbnailUrl) {
        URL.revokeObjectURL(item.thumbnailUrl);
      }
    });
    setItems([]);
    setRejectedFiles([]);
    setIsConverting(false);
    isCancelledRef.current = true;
  }, []);

  /**
   * Convert a single item
   */
  const processItem = useCallback(
    async (item: ConversionItem, currentOptions: ConversionOptions): Promise<void> => {
      // Mark as processing
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? { ...it, status: 'processing', stageText: 'Encoding to WebP...', startedAt: Date.now() }
            : it
        )
      );

      try {
        const result = await convertImageToWebp(item.file, item.originalFormat, currentOptions);
        const savingsPercent = calculateSavingsPercent(item.originalSize, result.blob.size);

        setItems((prev) =>
          prev.map((it) => {
            if (it.id !== item.id) return it;
            return {
              ...it,
              status: 'completed',
              progress: 100,
              stageText: 'Converted',
              outputBlob: result.blob,
              outputSize: result.blob.size,
              outputDimensions: result.dimensions,
              originalDimensions: result.originalDimensions,
              savingsPercent,
              isAnimatedGif: result.isAnimatedGif || it.isAnimatedGif,
              animatedNotice: result.animatedNotice || it.animatedNotice,
              isSvgRasterized: result.isSvgRasterized,
              completedAt: Date.now(),
              error: undefined,
            };
          })
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Conversion failed';
        setItems((prev) =>
          prev.map((it) => {
            if (it.id !== item.id) return it;
            return {
              ...it,
              status: 'failed',
              stageText: 'Failed',
              error: errorMessage,
              completedAt: Date.now(),
            };
          })
        );
      }
    },
    []
  );

  /**
   * Start conversion of all queued or failed files with bounded concurrency
   */
  const startConversion = useCallback(async () => {
    if (isConverting) return;

    isCancelledRef.current = false;
    setIsConverting(true);

    const pendingItems = itemsRef.current.filter(
      (item) => item.status === 'queued' || item.status === 'failed' || item.status === 'idle'
    );

    if (pendingItems.length === 0) {
      setIsConverting(false);
      return;
    }

    const currentOptions = { ...options };
    const queue = [...pendingItems];

    const runWorker = async () => {
      while (queue.length > 0 && !isCancelledRef.current) {
        const nextItem = queue.shift();
        if (!nextItem) break;
        await processItem(nextItem, currentOptions);
      }
    };

    // Run workers with bounded concurrency
    const workerPromises: Promise<void>[] = [];
    const concurrency = Math.min(MAX_CONCURRENT, pendingItems.length);

    for (let i = 0; i < concurrency; i++) {
      workerPromises.push(runWorker());
    }

    await Promise.all(workerPromises);
    setIsConverting(false);
  }, [isConverting, options, processItem]);

  /**
   * Cancel ongoing conversion
   */
  const cancelConversion = useCallback(() => {
    isCancelledRef.current = true;
    setIsConverting(false);
    setItems((prev) =>
      prev.map((item) =>
        item.status === 'processing' || item.status === 'queued'
          ? { ...item, status: 'idle', stageText: 'Cancelled' }
          : item
      )
    );
  }, []);

  /**
   * Retry a specific failed item
   */
  const retryFile = useCallback(
    async (id: string) => {
      const target = itemsRef.current.find((item) => item.id === id);
      if (!target) return;

      await processItem(target, options);
    },
    [options, processItem]
  );

  /**
   * Download a single completed WebP file
   */
  const downloadFile = useCallback((id: string) => {
    const item = itemsRef.current.find((it) => it.id === id);
    if (!item || !item.outputBlob) return;

    downloadSingleWebpFile(item.outputBlob, item.outputFilename || `${item.name}.webp`);
  }, []);

  /**
   * Download all completed files in a single ZIP archive
   */
  const downloadAllAsZip = useCallback(async () => {
    const completedItems = itemsRef.current.filter(
      (it) => it.status === 'completed' && it.outputBlob
    );

    if (completedItems.length === 0) return;

    try {
      setZipProgress(0);
      const zipBlob = await createWebpZipArchive(completedItems, (percent) => {
        setZipProgress(percent);
      });

      downloadZipArchive(zipBlob, `webp-optimized-images-${Date.now()}.zip`);
    } catch (err) {
      console.error('ZIP generation error:', err);
      alert('Failed to generate ZIP archive: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setZipProgress(null);
    }
  }, []);

  /**
   * Batch summary metrics
   */
  const summary: BatchSummary = useMemo(() => {
    const totalFiles = items.length;
    let queuedCount = 0;
    let processingCount = 0;
    let completedCount = 0;
    let failedCount = 0;
    let totalOriginalSize = 0;
    let totalConvertedSize = 0;

    for (const item of items) {
      if (item.status === 'queued' || item.status === 'idle') queuedCount++;
      else if (item.status === 'processing') processingCount++;
      else if (item.status === 'completed') {
        completedCount++;
        totalOriginalSize += item.originalSize;
        totalConvertedSize += item.outputSize || 0;
      } else if (item.status === 'failed') failedCount++;
    }

    const aggregateSavingsBytes = totalOriginalSize - totalConvertedSize;
    const aggregateSavingsPercent =
      totalOriginalSize > 0
        ? Math.round(((totalOriginalSize - totalConvertedSize) / totalOriginalSize) * 1000) / 10
        : 0;

    return {
      totalFiles,
      queuedCount,
      processingCount,
      completedCount,
      failedCount,
      totalOriginalSize,
      totalConvertedSize,
      aggregateSavingsPercent,
      aggregateSavingsBytes,
      isConverting,
    };
  }, [items, isConverting]);

  return {
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
  };
}
