export type ConversionStatus = 'idle' | 'queued' | 'processing' | 'completed' | 'failed';

export type SupportedFormat =
  | 'png'
  | 'jpeg'
  | 'webp'
  | 'svg'
  | 'gif'
  | 'bmp'
  | 'tiff'
  | 'avif'
  | 'ico'
  | 'unknown';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ConversionOptions {
  quality: number; // 1 - 100 (default: 80)
  lossless: boolean;
  enableResize: boolean;
  maxWidth?: number;
  maxHeight?: number;
  preserveAspectRatio: boolean;
}

export interface ConversionItem {
  id: string;
  file: File;
  name: string;
  originalFormat: SupportedFormat;
  originalSize: number;
  originalDimensions?: ImageDimensions;
  thumbnailUrl?: string;

  status: ConversionStatus;
  progress: number; // 0 to 100
  stageText?: string;

  outputBlob?: Blob;
  outputSize?: number;
  outputDimensions?: ImageDimensions;
  outputFilename?: string;
  savingsPercent?: number; // positive = saved %, negative = increased %
  
  isAnimatedGif?: boolean;
  animatedNotice?: string;
  isSvgRasterized?: boolean;

  error?: string;
  startedAt?: number;
  completedAt?: number;
}

export interface ValidationResult {
  valid: boolean;
  format: SupportedFormat;
  mimeType: string;
  error?: string;
  isAnimated?: boolean;
}

export interface BatchSummary {
  totalFiles: number;
  queuedCount: number;
  processingCount: number;
  completedCount: number;
  failedCount: number;
  totalOriginalSize: number; // For completed files
  totalConvertedSize: number; // For completed files
  aggregateSavingsPercent: number;
  aggregateSavingsBytes: number;
  isConverting: boolean;
}

export interface FormatFeature {
  name: string;
  extension: string;
  mime: string;
  status: 'Full' | 'Optimized' | 'Rasterized' | 'Static Frame';
  notes: string;
}
