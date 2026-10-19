import test from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import { createWebpZipArchive } from '../src/lib/image-converter/zip-generator';
import { ConversionItem } from '../src/lib/image-converter/types';

function createDummyWebpBlob(content: string): Blob {
  const header = [
    0x52, 0x49, 0x46, 0x46, // RIFF
    0x20, 0x00, 0x00, 0x00,
    0x57, 0x45, 0x42, 0x50, // WEBP
  ];
  const encoder = new TextEncoder();
  const extra = encoder.encode(content);
  return new Blob([new Uint8Array(header), extra], { type: 'image/webp' });
}

test('createWebpZipArchive packages completed items and ignores pending/failed', async () => {
  const items: ConversionItem[] = [
    {
      id: '1',
      file: new File([], 'photo1.jpg'),
      name: 'photo1.jpg',
      originalFormat: 'jpeg',
      originalSize: 1000,
      status: 'completed',
      progress: 100,
      outputBlob: createDummyWebpBlob('image 1 data'),
      outputFilename: 'photo1.webp',
    },
    {
      id: '2',
      file: new File([], 'photo1.jpg'), // Duplicate filename
      name: 'photo1.jpg',
      originalFormat: 'jpeg',
      originalSize: 1200,
      status: 'completed',
      progress: 100,
      outputBlob: createDummyWebpBlob('image 2 data'),
      outputFilename: 'photo1_1.webp',
    },
    {
      id: '3',
      file: new File([], 'failed.png'),
      name: 'failed.png',
      originalFormat: 'png',
      originalSize: 500,
      status: 'failed',
      progress: 0,
      error: 'Corrupt file',
    },
    {
      id: '4',
      file: new File([], 'pending.png'),
      name: 'pending.png',
      originalFormat: 'png',
      originalSize: 800,
      status: 'queued',
      progress: 0,
    },
  ];

  let progressCalled = false;
  const zipBlob = await createWebpZipArchive(items, (pct) => {
    if (pct >= 0) progressCalled = true;
  });

  assert.ok(zipBlob.size > 0);
  assert.equal(progressCalled, true);

  // Read back the zip file using JSZip
  const zipBuffer = await zipBlob.arrayBuffer();
  const loadedZip = await JSZip.loadAsync(zipBuffer);

  const fileNames = Object.keys(loadedZip.files);
  // Should only have photo1.webp and photo1_1.webp (not failed.png or pending.png)
  assert.equal(fileNames.length, 2);
  assert.ok(fileNames.includes('photo1.webp'));
  assert.ok(fileNames.includes('photo1_1.webp'));
});

test('createWebpZipArchive throws error on empty or zero-completed batch', async () => {
  const items: ConversionItem[] = [
    {
      id: '1',
      file: new File([], 'pending.jpg'),
      name: 'pending.jpg',
      originalFormat: 'jpeg',
      originalSize: 1000,
      status: 'queued',
      progress: 0,
    },
  ];

  await assert.rejects(
    async () => {
      await createWebpZipArchive(items);
    },
    { message: /No successfully converted WebP files to archive/ }
  );
});
