import { SupportedFormat, ValidationResult } from './types';
import { inspectGif } from './gif-detector';

// Maximum allowed file size: 50MB per image
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
export const MAX_FILE_COUNT = 100;

/**
 * Detect format from file header magic bytes
 */
export async function detectFormatFromBytes(file: File): Promise<{
  format: SupportedFormat;
  mime: string;
}> {
  if (file.size < 4) {
    return { format: 'unknown', mime: file.type || 'application/octet-stream' };
  }

  try {
    const slice = file.slice(0, 32);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    ) {
      return { format: 'png', mime: 'image/png' };
    }

    // JPEG: FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return { format: 'jpeg', mime: 'image/jpeg' };
    }

    // GIF: GIF87a or GIF89a
    if (
      bytes[0] === 0x47 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x38 &&
      (bytes[4] === 0x37 || bytes[4] === 0x39) &&
      bytes[5] === 0x61
    ) {
      return { format: 'gif', mime: 'image/gif' };
    }

    // WebP: RIFF (bytes 0-3) and WEBP (bytes 8-11)
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    ) {
      return { format: 'webp', mime: 'image/webp' };
    }

    // BMP: "BM" (0x42, 0x4D)
    if (bytes[0] === 0x42 && bytes[1] === 0x4d) {
      return { format: 'bmp', mime: 'image/bmp' };
    }

    // TIFF: Little Endian (II* \0) or Big Endian (MM\0 *)
    if (
      (bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2a && bytes[3] === 0x00) ||
      (bytes[0] === 0x4d && bytes[1] === 0x4d && bytes[2] === 0x00 && bytes[3] === 0x2a)
    ) {
      return { format: 'tiff', mime: 'image/tiff' };
    }

    // ICO: 00 00 01 00
    if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00) {
      return { format: 'ico', mime: 'image/x-icon' };
    }

    // AVIF: Check for ftypavif or ftypavis in first 16 bytes
    // Typically byte 4-7 = "ftyp", byte 8-11 = "avif" or "avis"
    const headerStr = Array.from(bytes)
      .map((b) => String.fromCharCode(b))
      .join('');
    if (headerStr.includes('ftypavif') || headerStr.includes('ftypavis')) {
      return { format: 'avif', mime: 'image/avif' };
    }

    // SVG: Check first 256 bytes for <svg tag or <?xml
    const sample = await file.slice(0, 1024).text();
    if (sample.includes('<svg') || (sample.includes('<?xml') && sample.includes('svg'))) {
      return { format: 'svg', mime: 'image/svg+xml' };
    }
  } catch {
    // Fall back to filename extension
  }

  // Fallback to filename extension if magic byte sniffing did not match
  const ext = file.name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png':
      return { format: 'png', mime: 'image/png' };
    case 'jpg':
    case 'jpeg':
      return { format: 'jpeg', mime: 'image/jpeg' };
    case 'webp':
      return { format: 'webp', mime: 'image/webp' };
    case 'gif':
      return { format: 'gif', mime: 'image/gif' };
    case 'bmp':
      return { format: 'bmp', mime: 'image/bmp' };
    case 'tiff':
    case 'tif':
      return { format: 'tiff', mime: 'image/tiff' };
    case 'svg':
      return { format: 'svg', mime: 'image/svg+xml' };
    case 'avif':
      return { format: 'avif', mime: 'image/avif' };
    case 'ico':
      return { format: 'ico', mime: 'image/x-icon' };
    default:
      return { format: 'unknown', mime: file.type || 'application/octet-stream' };
  }
}

/**
 * Validate input file for conversion suitability
 */
export async function validateInputFile(file: File): Promise<ValidationResult> {
  // 1. Zero-byte check
  if (!file || file.size === 0) {
    return {
      valid: false,
      format: 'unknown',
      mimeType: file?.type || '',
      error: 'Empty file (0 bytes)',
    };
  }

  // 2. Size limit check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      format: 'unknown',
      mimeType: file.type || '',
      error: `File size exceeds limit (${Math.round(MAX_FILE_SIZE_BYTES / (1024 * 1024))}MB max)`,
    };
  }

  // 3. Format detection
  const { format, mime } = await detectFormatFromBytes(file);

  if (format === 'unknown') {
    return {
      valid: false,
      format: 'unknown',
      mimeType: mime,
      error: `Unsupported image format (${file.name.split('.').pop() || 'unknown'})`,
    };
  }

  // 4. Special check for GIF
  let isAnimated = false;
  if (format === 'gif') {
    try {
      const gifInfo = await inspectGif(file);
      isAnimated = gifInfo.isAnimated;
    } catch {
      // Ignore inspection failure
    }
  }

  return {
    valid: true,
    format,
    mimeType: mime,
    isAnimated,
  };
}

/**
 * Sanitize SVG XML text to prevent script execution, foreign objects, or external resources
 */
export function sanitizeSvgXml(rawSvg: string): string {
  // If running in browser, parse through DOMParser and strip dangerous tags and attributes
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawSvg, 'image/svg+xml');

    // Check for parse error
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Malformed SVG file');
    }

    const svgElement = doc.querySelector('svg');
    if (!svgElement) {
      throw new Error('No <svg> root element found');
    }

    // Dangerous tags to completely remove
    const forbiddenTags = [
      'script',
      'foreignObject',
      'iframe',
      'object',
      'embed',
      'applet',
      'audio',
      'video',
      'meta',
      'link',
    ];

    for (const tag of forbiddenTags) {
      const elements = doc.querySelectorAll(tag);
      elements.forEach((el) => el.remove());
    }

    // Traverse all elements and remove inline event handlers (on*) and unsafe links
    const allElements = doc.querySelectorAll('*');
    allElements.forEach((el) => {
      const attrs = Array.from(el.attributes);
      for (const attr of attrs) {
        const name = attr.name.toLowerCase();
        const val = attr.value.trim().toLowerCase();

        // Remove on* event handlers (onload, onclick, onerror, etc.)
        if (name.startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }

        // Remove unsafe hrefs / xlink:hrefs that contain javascript: or data: or external URLs
        if (name === 'href' || name === 'xlink:href' || name.endsWith(':href')) {
          if (
            val.startsWith('javascript:') ||
            val.startsWith('vbscript:') ||
            val.startsWith('data:text/html') ||
            val.startsWith('http://') ||
            val.startsWith('https://')
          ) {
            el.removeAttribute(attr.name);
          }
        }
      }
    });

    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
  }

  // Regex fallback if in worker/node environment
  return rawSvg
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<foreignObject\b[^<]*(?:(?!<\/foreignObject>)<[^<]*)*<\/foreignObject>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '');
}
