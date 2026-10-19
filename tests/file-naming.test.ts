import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeFilename,
  replaceExtensionWithWebp,
  generateUniqueWebpFilenames,
  formatBytes,
  calculateSavingsPercent,
} from '../src/lib/image-converter/file-naming';

test('sanitizeFilename removes control characters and invalid chars', () => {
  const result = sanitizeFilename('photo*test?:name.png');
  assert.equal(result, 'photo_test__name.png');
});

test('replaceExtensionWithWebp replaces extension with .webp', () => {
  assert.equal(replaceExtensionWithWebp('banner.jpeg'), 'banner.webp');
  assert.equal(replaceExtensionWithWebp('icon.svg'), 'icon.webp');
  assert.equal(replaceExtensionWithWebp('graphic.png'), 'graphic.webp');
  assert.equal(replaceExtensionWithWebp('no-ext'), 'no-ext.webp');
});

test('generateUniqueWebpFilenames handles duplicates cleanly', () => {
  const input = ['hero.png', 'hero.jpg', 'about.png', 'hero.png'];
  const output = generateUniqueWebpFilenames(input);

  assert.deepEqual(output, [
    'hero.webp',
    'hero_1.webp',
    'about.webp',
    'hero_2.webp',
  ]);
});

test('formatBytes formats bytes into human-readable strings', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1024 * 1024 * 2.5), '2.5 MB');
});

test('calculateSavingsPercent computes savings and size increases', () => {
  // 50% savings
  assert.equal(calculateSavingsPercent(1000, 500), 50);

  // 75% savings
  assert.equal(calculateSavingsPercent(1000, 250), 75);

  // Size increase (negative savings)
  assert.equal(calculateSavingsPercent(1000, 1200), -20);

  // Zero size
  assert.equal(calculateSavingsPercent(0, 500), 0);
});
