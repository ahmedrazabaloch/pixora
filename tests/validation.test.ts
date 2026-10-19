import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectFormatFromBytes,
  validateInputFile,
  sanitizeSvgXml,
  MAX_FILE_SIZE_BYTES,
} from '../src/lib/image-converter/validation';

// Helper to create mock File in Node environment
function createMockFile(bytes: number[], name: string, type: string = ''): File {
  const u8 = new Uint8Array(bytes);
  return new File([u8], name, { type });
}

test('detectFormatFromBytes identifies PNG signature', async () => {
  const pngBytes = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d];
  const file = createMockFile(pngBytes, 'image.png', 'image/png');
  const res = await detectFormatFromBytes(file);
  assert.equal(res.format, 'png');
  assert.equal(res.mime, 'image/png');
});

test('detectFormatFromBytes identifies JPEG signature', async () => {
  const jpegBytes = [0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46];
  const file = createMockFile(jpegBytes, 'photo.jpg', 'image/jpeg');
  const res = await detectFormatFromBytes(file);
  assert.equal(res.format, 'jpeg');
  assert.equal(res.mime, 'image/jpeg');
});

test('detectFormatFromBytes identifies WebP signature', async () => {
  // RIFF (bytes 0-3), length, WEBP (bytes 8-11)
  const webpBytes = [
    0x52, 0x49, 0x46, 0x46, 0x20, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38,
  ];
  const file = createMockFile(webpBytes, 'asset.webp', 'image/webp');
  const res = await detectFormatFromBytes(file);
  assert.equal(res.format, 'webp');
  assert.equal(res.mime, 'image/webp');
});

test('detectFormatFromBytes identifies BMP signature', async () => {
  const bmpBytes = [0x42, 0x4d, 0x36, 0x00, 0x00, 0x00];
  const file = createMockFile(bmpBytes, 'graphic.bmp', 'image/bmp');
  const res = await detectFormatFromBytes(file);
  assert.equal(res.format, 'bmp');
  assert.equal(res.mime, 'image/bmp');
});

test('detectFormatFromBytes identifies TIFF signatures (little and big endian)', async () => {
  const tiffLE = [0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00];
  const fileLE = createMockFile(tiffLE, 'scan_le.tiff', 'image/tiff');
  const resLE = await detectFormatFromBytes(fileLE);
  assert.equal(resLE.format, 'tiff');

  const tiffBE = [0x4d, 0x4d, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x08];
  const fileBE = createMockFile(tiffBE, 'scan_be.tif', 'image/tiff');
  const resBE = await detectFormatFromBytes(fileBE);
  assert.equal(resBE.format, 'tiff');
});

test('validateInputFile rejects 0-byte file', async () => {
  const emptyFile = createMockFile([], 'empty.png', 'image/png');
  const res = await validateInputFile(emptyFile);
  assert.equal(res.valid, false);
  assert.ok(res.error?.includes('Empty file'));
});

test('validateInputFile rejects file exceeding max size limit', async () => {
  const hugeFile = {
    name: 'huge.png',
    size: MAX_FILE_SIZE_BYTES + 1024,
    type: 'image/png',
    slice: () => new Blob(),
  } as unknown as File;

  const res = await validateInputFile(hugeFile);
  assert.equal(res.valid, false);
  assert.ok(res.error?.includes('exceeds limit'));
});

test('validateInputFile rejects unsupported format gracefully', async () => {
  const exeBytes = [0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00];
  const file = createMockFile(exeBytes, 'program.exe', 'application/x-msdownload');
  const res = await validateInputFile(file);
  assert.equal(res.valid, false);
  assert.ok(res.error?.includes('Unsupported image format'));
});

test('sanitizeSvgXml strips scripts and inline event handlers', () => {
  const dangerousSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <script>alert("xss")</script>
      <circle cx="50" cy="50" r="40" fill="red" onclick="alert('hack')" />
      <foreignObject width="100" height="100">
        <div>embedded content</div>
      </foreignObject>
    </svg>
  `;

  const clean = sanitizeSvgXml(dangerousSvg);
  assert.ok(!clean.includes('<script'));
  assert.ok(!clean.includes('alert('));
  assert.ok(!clean.includes('onclick'));
  assert.ok(!clean.includes('<foreignObject'));
});
