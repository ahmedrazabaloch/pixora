/**
 * WebP binary file verification
 * WebP files start with "RIFF" (bytes 0-3), file size (bytes 4-7), and "WEBP" (bytes 8-11).
 */

export interface WebpVerificationResult {
  isValid: boolean;
  mimeType: string;
  size: number;
  hasValidSignature: boolean;
  error?: string;
}

export async function verifyWebpBlob(blob: Blob): Promise<WebpVerificationResult> {
  if (!blob) {
    return {
      isValid: false,
      mimeType: '',
      size: 0,
      hasValidSignature: false,
      error: 'Empty or undefined blob provided',
    };
  }

  if (blob.size < 12) {
    return {
      isValid: false,
      mimeType: blob.type,
      size: blob.size,
      hasValidSignature: false,
      error: `File size too small (${blob.size} bytes) to be a valid WebP container`,
    };
  }

  try {
    const headerSlice = blob.slice(0, 12);
    const buffer = await headerSlice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Byte 0-3: RIFF (82, 73, 70, 70)
    const isRiff =
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46;

    // Byte 8-11: WEBP (87, 69, 66, 80)
    const isWebp =
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50;

    const hasValidSignature = isRiff && isWebp;

    if (!hasValidSignature) {
      return {
        isValid: false,
        mimeType: blob.type,
        size: blob.size,
        hasValidSignature: false,
        error: 'Missing valid RIFF/WEBP binary header signature',
      };
    }

    return {
      isValid: true,
      mimeType: blob.type || 'image/webp',
      size: blob.size,
      hasValidSignature: true,
    };
  } catch (err) {
    return {
      isValid: false,
      mimeType: blob.type,
      size: blob.size,
      hasValidSignature: false,
      error: `Failed to read file signature: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
