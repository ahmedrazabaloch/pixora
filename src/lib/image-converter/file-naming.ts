/**
 * File naming and formatting utilities for bulk WebP conversion
 */

export function sanitizeFilename(filename: string): string {
  // Strip control characters, trailing spaces, and unsafe filesystem chars
  return filename.replace(/[\x00-\x1f\x7f<>:"/\\|?*]/g, '_').trim();
}

export function replaceExtensionWithWebp(originalFilename: string): string {
  const sanitized = sanitizeFilename(originalFilename);
  const lastDotIndex = sanitized.lastIndexOf('.');
  if (lastDotIndex <= 0) {
    return `${sanitized}.webp`;
  }
  return `${sanitized.substring(0, lastDotIndex)}.webp`;
}

/**
 * Given an array of original filenames, produces unique output filenames ending in .webp
 */
export function generateUniqueWebpFilenames(originalFilenames: string[]): string[] {
  const nameCounts = new Map<string, number>();
  const results: string[] = [];

  for (const original of originalFilenames) {
    const baseWebp = replaceExtensionWithWebp(original);
    const dotIndex = baseWebp.lastIndexOf('.');
    const baseName = dotIndex !== -1 ? baseWebp.substring(0, dotIndex) : baseWebp;
    const extension = '.webp';

    const count = nameCounts.get(baseWebp) || 0;
    if (count === 0) {
      nameCounts.set(baseWebp, 1);
      results.push(baseWebp);
    } else {
      nameCounts.set(baseWebp, count + 1);
      results.push(`${baseName}_${count}${extension}`);
    }
  }

  return results;
}

/**
 * Format bytes into human readable format (B, KB, MB, GB)
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  if (!bytes || isNaN(bytes) || bytes < 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const index = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, index)).toFixed(dm))} ${sizes[index]}`;
}

/**
 * Calculate size savings percentage.
 * Formula: ((Original Size - Output Size) / Original Size) * 100
 * Returns positive number for savings (reduction), negative for increase.
 */
export function calculateSavingsPercent(originalSize: number, outputSize: number): number {
  if (!originalSize || originalSize <= 0) return 0;
  const savings = ((originalSize - outputSize) / originalSize) * 100;
  return Math.round(savings * 10) / 10;
}
