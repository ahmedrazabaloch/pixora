import { ConversionOptions, ImageDimensions, SupportedFormat } from './types';
import { sanitizeSvgXml } from './validation';
import { inspectGif } from './gif-detector';
import { verifyWebpBlob } from './output-verification';
import * as UTIF from 'utif';

export interface ConvertResult {
  blob: Blob;
  dimensions: ImageDimensions;
  originalDimensions?: ImageDimensions;
  isAnimatedGif?: boolean;
  animatedNotice?: string;
  isSvgRasterized?: boolean;
}

/**
 * Calculates target dimensions preserving aspect ratio if requested
 */
export function calculateTargetDimensions(
  originalWidth: number,
  originalHeight: number,
  options: ConversionOptions
): ImageDimensions {
  if (!options.enableResize) {
    return { width: originalWidth, height: originalHeight };
  }

  const maxWidth = options.maxWidth && options.maxWidth > 0 ? options.maxWidth : originalWidth;
  const maxHeight = options.maxHeight && options.maxHeight > 0 ? options.maxHeight : originalHeight;

  if (!options.preserveAspectRatio) {
    return {
      width: Math.min(originalWidth, maxWidth),
      height: Math.min(originalHeight, maxHeight),
    };
  }

  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = Math.round((width * maxHeight) / height);
    height = maxHeight;
  }

  return {
    width: Math.max(1, width),
    height: Math.max(1, height),
  };
}

/**
 * Decode and render TIFF file onto an HTMLCanvasElement
 */
async function decodeTiffToCanvas(
  file: File,
  targetCanvas: HTMLCanvasElement,
  options: ConversionOptions
): Promise<ImageDimensions> {
  const buffer = await file.arrayBuffer();
  const ifds = UTIF.decode(buffer);
  if (!ifds || ifds.length === 0) {
    throw new Error('TIFF image format could not be decoded: no image directories found');
  }

  const firstPage = ifds[0];
  UTIF.decodeImage(buffer, firstPage);

  const origWidth = firstPage.width;
  const origHeight = firstPage.height;

  if (!origWidth || !origHeight) {
    throw new Error('Invalid TIFF dimensions');
  }

  const rgba = UTIF.toRGBA8(firstPage);
  const targetDims = calculateTargetDimensions(origWidth, origHeight, options);

  // If resizing, draw on intermediate canvas then scale
  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = origWidth;
  sourceCanvas.height = origHeight;
  const sCtx = sourceCanvas.getContext('2d');
  if (!sCtx) throw new Error('Canvas 2D context unavailable');

  const imgData = sCtx.createImageData(origWidth, origHeight);
  imgData.data.set(rgba);
  sCtx.putImageData(imgData, 0, 0);

  targetCanvas.width = targetDims.width;
  targetCanvas.height = targetDims.height;
  const tCtx = targetCanvas.getContext('2d');
  if (!tCtx) throw new Error('Target canvas 2D context unavailable');

  tCtx.imageSmoothingEnabled = true;
  tCtx.imageSmoothingQuality = 'high';
  tCtx.drawImage(sourceCanvas, 0, 0, targetDims.width, targetDims.height);

  return { width: origWidth, height: origHeight };
}

/**
 * Decode and render SVG onto an HTMLCanvasElement safely
 */
async function decodeSvgToCanvas(
  file: File,
  targetCanvas: HTMLCanvasElement,
  options: ConversionOptions
): Promise<ImageDimensions> {
  const rawText = await file.text();
  const sanitizedText = sanitizeSvgXml(rawText);

  // Determine intrinsic dimensions from SVG tag if present
  let svgWidth = 800;
  let svgHeight = 600;

  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitizedText, 'image/svg+xml');
  const svgEl = doc.querySelector('svg');

  if (svgEl) {
    const widthAttr = svgEl.getAttribute('width');
    const heightAttr = svgEl.getAttribute('height');
    const viewBox = svgEl.getAttribute('viewBox');

    if (viewBox) {
      const parts = viewBox.trim().split(/[\s,]+/).map(Number);
      if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
        svgWidth = parts[2];
        svgHeight = parts[3];
      }
    } else if (widthAttr && heightAttr) {
      const parsedW = parseFloat(widthAttr);
      const parsedH = parseFloat(heightAttr);
      if (!isNaN(parsedW) && parsedW > 0) svgWidth = parsedW;
      if (!isNaN(parsedH) && parsedH > 0) svgHeight = parsedH;
    }
  }

  const svgBlob = new Blob([sanitizedText], { type: 'image/svg+xml;charset=utf-8' });
  const blobUrl = URL.createObjectURL(svgBlob);

  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to rasterize sanitized SVG'));
      img.src = blobUrl;
    });

    const origWidth = img.naturalWidth || svgWidth;
    const origHeight = img.naturalHeight || svgHeight;
    const targetDims = calculateTargetDimensions(origWidth, origHeight, options);

    targetCanvas.width = targetDims.width;
    targetCanvas.height = targetDims.height;
    const ctx = targetCanvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');

    ctx.clearRect(0, 0, targetDims.width, targetDims.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, targetDims.width, targetDims.height);

    return { width: origWidth, height: origHeight };
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

/**
 * Standard raster decoder via browser Image / ImageBitmap
 */
async function decodeStandardImageToCanvas(
  file: File,
  targetCanvas: HTMLCanvasElement,
  options: ConversionOptions
): Promise<ImageDimensions> {
  const blobUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Browser was unable to decode image file "${file.name}"`));
      img.src = blobUrl;
    });

    const origWidth = img.naturalWidth;
    const origHeight = img.naturalHeight;

    if (!origWidth || !origHeight) {
      throw new Error('Image decoded with invalid 0x0 dimensions');
    }

    const targetDims = calculateTargetDimensions(origWidth, origHeight, options);

    targetCanvas.width = targetDims.width;
    targetCanvas.height = targetDims.height;
    const ctx = targetCanvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');

    ctx.clearRect(0, 0, targetDims.width, targetDims.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, targetDims.width, targetDims.height);

    return { width: origWidth, height: origHeight };
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

/**
 * Main WebP conversion function
 */
export async function convertImageToWebp(
  file: File,
  format: SupportedFormat,
  options: ConversionOptions
): Promise<ConvertResult> {
  const canvas = document.createElement('canvas');

  let isAnimatedGif = false;
  let animatedNotice: string | undefined;
  let isSvgRasterized = false;
  let originalDimensions: ImageDimensions;

  // Format-specific decoding
  if (format === 'tiff') {
    originalDimensions = await decodeTiffToCanvas(file, canvas, options);
  } else if (format === 'svg') {
    originalDimensions = await decodeSvgToCanvas(file, canvas, options);
    isSvgRasterized = true;
  } else {
    if (format === 'gif') {
      const gifInfo = await inspectGif(file);
      if (gifInfo.isAnimated) {
        isAnimatedGif = true;
        animatedNotice = 'Animated GIF detected: static frame converted (WebP animation is not preserved via canvas)';
      }
    }
    originalDimensions = await decodeStandardImageToCanvas(file, canvas, options);
  }

  // Calculate quality parameter
  // WebP quality parameter ranges from 0.0 to 1.0
  const quality = options.lossless ? 1.0 : Math.max(0.01, Math.min(1.0, options.quality / 100));

  // Export to real WebP Blob
  const webpBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas WebP export returned null. Browser may lack WebP canvas encoding support.'));
          return;
        }
        resolve(blob);
      },
      'image/webp',
      quality
    );
  });

  // Verify that output is a genuine WebP file
  const verification = await verifyWebpBlob(webpBlob);
  if (!verification.isValid) {
    throw new Error(`Output verification failed: ${verification.error || 'Invalid WebP binary'}`);
  }

  return {
    blob: webpBlob,
    dimensions: { width: canvas.width, height: canvas.height },
    originalDimensions,
    isAnimatedGif,
    animatedNotice,
    isSvgRasterized,
  };
}
