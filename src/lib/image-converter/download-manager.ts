/**
 * Download management utilities for single WebP files and bulk ZIP archives
 */

export function downloadBlob(blob: Blob, filename: string): void {
  if (typeof window === 'undefined') return;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();

  // Cleanup after click
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 1000);
}

export function downloadSingleWebpFile(blob: Blob, filename: string): void {
  const safeFilename = filename.endsWith('.webp') ? filename : `${filename}.webp`;
  downloadBlob(blob, safeFilename);
}

export function downloadZipArchive(zipBlob: Blob, archiveName = 'converted-webp-images.zip'): void {
  downloadBlob(zipBlob, archiveName);
}
