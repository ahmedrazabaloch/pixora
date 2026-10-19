import JSZip from 'jszip';
import { ConversionItem } from './types';
import { generateUniqueWebpFilenames } from './file-naming';

export interface ZipProgressCallback {
  (percent: number, currentFile?: string): void;
}

/**
 * Creates a ZIP archive containing all successfully converted WebP files
 */
export async function createWebpZipArchive(
  items: ConversionItem[],
  onProgress?: ZipProgressCallback
): Promise<Blob> {
  const completedItems = items.filter((item) => item.status === 'completed' && item.outputBlob);

  if (completedItems.length === 0) {
    throw new Error('No successfully converted WebP files to archive.');
  }

  const zip = new JSZip();

  // Generate unique predictable filenames for all completed items
  const originalNames = completedItems.map((item) => item.name);
  const uniqueFilenames = generateUniqueWebpFilenames(originalNames);

  completedItems.forEach((item, index) => {
    const filename = uniqueFilenames[index] || item.outputFilename || `image_${index + 1}.webp`;
    if (item.outputBlob) {
      zip.file(filename, item.outputBlob);
    }
  });

  // Generate the zip blob with progress reporting
  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent), metadata.currentFile || undefined);
      }
    }
  );

  return zipBlob;
}
