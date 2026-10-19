import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTargetDimensions } from '../src/lib/image-converter/browser-converter';
import { inspectGif } from '../src/lib/image-converter/gif-detector';

test('calculateTargetDimensions preserves dimensions when enableResize is false', () => {
  const result = calculateTargetDimensions(1920, 1080, {
    quality: 80,
    lossless: false,
    enableResize: false,
    maxWidth: 800,
    maxHeight: 600,
    preserveAspectRatio: true,
  });

  assert.equal(result.width, 1920);
  assert.equal(result.height, 1080);
});

test('calculateTargetDimensions resizes while preserving aspect ratio', () => {
  const result = calculateTargetDimensions(2000, 1000, {
    quality: 80,
    lossless: false,
    enableResize: true,
    maxWidth: 1000,
    maxHeight: 800,
    preserveAspectRatio: true,
  });

  // Aspect ratio is 2:1, so max width 1000 gives height 500
  assert.equal(result.width, 1000);
  assert.equal(result.height, 500);
});

test('calculateTargetDimensions constraints by height if taller', () => {
  const result = calculateTargetDimensions(1000, 2000, {
    quality: 80,
    lossless: false,
    enableResize: true,
    maxWidth: 800,
    maxHeight: 1000,
    preserveAspectRatio: true,
  });

  // Aspect ratio is 1:2, so max height 1000 gives width 500
  assert.equal(result.width, 500);
  assert.equal(result.height, 1000);
});

test('inspectGif detects static vs animated GIF correctly', async () => {
  // Static GIF: Single image descriptor 0x2C
  const staticGifBytes = new Uint8Array([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, // GIF89a
    0x0a, 0x00, 0x0a, 0x00, // 10x10
    0x80, 0x00, 0x00,
    0x2c, // Image descriptor 1
    0x00, 0x00, 0x00, 0x00,
    0x3b, // Trailer
  ]);

  const staticRes = await inspectGif(staticGifBytes);
  assert.equal(staticRes.isGif, true);
  assert.equal(staticRes.isAnimated, false);

  // Animated GIF: Two image descriptors (0x2C)
  const animatedGifBytes = new Uint8Array([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, // GIF89a
    0x0a, 0x00, 0x0a, 0x00,
    0x80, 0x00, 0x00,
    0x2c, // Frame 1
    0x00, 0x00, 0x00, 0x00,
    0x2c, // Frame 2
    0x00, 0x00, 0x00, 0x00,
    0x3b,
  ]);

  const animatedRes = await inspectGif(animatedGifBytes);
  assert.equal(animatedRes.isGif, true);
  assert.equal(animatedRes.isAnimated, true);
});
