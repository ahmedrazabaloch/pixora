/**
 * GIF structure inspection to determine whether a GIF is animated
 */

export interface GifInspectionResult {
  isGif: boolean;
  isAnimated: boolean;
  frameCount: number;
}

export async function inspectGif(
  blobOrBuffer: Blob | ArrayBuffer | Uint8Array
): Promise<GifInspectionResult> {
  let uint8: Uint8Array;
  if (blobOrBuffer instanceof Blob) {
    const buffer = await blobOrBuffer.arrayBuffer();
    uint8 = new Uint8Array(buffer);
  } else if (blobOrBuffer instanceof Uint8Array) {
    uint8 = blobOrBuffer;
  } else {
    uint8 = new Uint8Array(blobOrBuffer);
  }

  if (uint8.length < 6) {
    return { isGif: false, isAnimated: false, frameCount: 0 };
  }

  // Header check: GIF87a or GIF89a
  const header = String.fromCharCode(...uint8.slice(0, 6));
  if (header !== 'GIF87a' && header !== 'GIF89a') {
    return { isGif: false, isAnimated: false, frameCount: 0 };
  }

  let frameCount = 0;
  // An animated GIF contains multiple Image Descriptors (0x2C) or Graphic Control Extensions (0x21 0xF9).
  // We scan the bytes safely.
  for (let i = 6; i < uint8.length - 1; i++) {
    // Check for Image Descriptor 0x2C
    if (uint8[i] === 0x2c) {
      frameCount++;
      if (frameCount > 1) {
        // We know it is animated as soon as frameCount > 1
        break;
      }
    }
  }

  return {
    isGif: true,
    isAnimated: frameCount > 1,
    frameCount: Math.max(frameCount, 1),
  };
}
