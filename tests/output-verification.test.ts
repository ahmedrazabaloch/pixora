import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyWebpBlob } from '../src/lib/image-converter/output-verification';

test('verifyWebpBlob accepts genuine WebP binary header', async () => {
  // Construct a minimal valid RIFF/WEBP 12-byte header
  const buffer = new Uint8Array([
    0x52, 0x49, 0x46, 0x46, // 'RIFF'
    0x24, 0x00, 0x00, 0x00, // file size - 8
    0x57, 0x45, 0x42, 0x50, // 'WEBP'
    0x56, 0x50, 0x38, 0x20, // 'VP8 ' chunk
  ]);

  const blob = new Blob([buffer], { type: 'image/webp' });
  const result = await verifyWebpBlob(blob);

  assert.equal(result.isValid, true);
  assert.equal(result.hasValidSignature, true);
  assert.equal(result.mimeType, 'image/webp');
  assert.equal(result.size, 16);
});

test('verifyWebpBlob rejects corrupt/non-WebP file masquerading as WebP', async () => {
  // A fake WebP that has JPEG or arbitrary bytes
  const fakeBytes = new Uint8Array([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
  ]);

  const fakeBlob = new Blob([fakeBytes], { type: 'image/webp' });
  const result = await verifyWebpBlob(fakeBlob);

  assert.equal(result.isValid, false);
  assert.equal(result.hasValidSignature, false);
  assert.ok(result.error?.includes('signature'));
});

test('verifyWebpBlob rejects files smaller than 12 bytes', async () => {
  const shortBuffer = new Uint8Array([0x52, 0x49, 0x46, 0x46]);
  const shortBlob = new Blob([shortBuffer], { type: 'image/webp' });

  const result = await verifyWebpBlob(shortBlob);
  assert.equal(result.isValid, false);
  assert.ok(result.error?.includes('too small'));
});

test('verifyWebpBlob handles null/undefined input gracefully', async () => {
  // @ts-expect-error testing invalid input
  const result = await verifyWebpBlob(null);
  assert.equal(result.isValid, false);
  assert.ok(result.error?.includes('Empty'));
});
