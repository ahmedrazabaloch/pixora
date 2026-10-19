'use client';

import React from 'react';
import Link from 'next/link';
import {
  Check,
  AlertTriangle,
  FileCode,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { FormatFeature } from '@/lib/image-converter/types';
import { HatchedDivider } from '@/components/converter/hatched-divider';

const DETAILED_FORMATS: (FormatFeature & {
  transparency: string;
  decoder: string;
})[] = [
  {
    name: 'PNG (Portable Network Graphics)',
    extension: '.png',
    mime: 'image/png',
    status: 'Full',
    transparency: 'Full Alpha Channel',
    decoder: 'Native Canvas / createImageBitmap',
    notes:
      'Converts 24-bit and 32-bit PNGs with full alpha channel preservation. Ideal for UI components, transparent logos, and screenshots, offering typical 60%–85% file size reductions.',
  },
  {
    name: 'JPEG / JPG',
    extension: '.jpg, .jpeg',
    mime: 'image/jpeg',
    status: 'Full',
    transparency: 'Not Supported (Opaque)',
    decoder: 'Native Canvas / createImageBitmap',
    notes:
      'Lossy photographic compression. Typically reduces file size by 25%–35% compared to original JPEG at matching visual quality levels.',
  },
  {
    name: 'WebP (Recompression / Resize)',
    extension: '.webp',
    mime: 'image/webp',
    status: 'Optimized',
    transparency: 'Full Alpha Channel',
    decoder: 'Native Canvas / createImageBitmap',
    notes:
      'Allows re-encoding or downscaling existing WebP images to reduce quality or constrain maximum dimensions for responsive breakpoints.',
  },
  {
    name: 'SVG (Scalable Vector Graphics)',
    extension: '.svg',
    mime: 'image/svg+xml',
    status: 'Rasterized',
    transparency: 'Preserved (Alpha Background)',
    decoder: 'Sanitized DOMParser + HTML5 Canvas',
    notes:
      'Sanitized to remove executable scripts, foreign objects, and remote network calls. Rasterized into high-resolution WebP bitmap at intrinsic or custom bounds.',
  },
  {
    name: 'GIF (Graphics Interchange Format)',
    extension: '.gif',
    mime: 'image/gif',
    status: 'Static Frame',
    transparency: 'Preserved (1-bit index)',
    decoder: 'Binary Header Inspector + Canvas',
    notes:
      'Static GIFs convert with transparency. For animated GIFs, the first frame is converted to static WebP with an explicit UI notice indicating animation is not preserved.',
  },
  {
    name: 'BMP (Windows Bitmap)',
    extension: '.bmp',
    mime: 'image/bmp',
    status: 'Full',
    transparency: 'Not Supported (Opaque)',
    decoder: 'Native Canvas / createImageBitmap',
    notes:
      'Uncompressed raster graphics. Converts directly into WebP, yielding dramatic 80%–95% file size savings.',
  },
  {
    name: 'TIFF / TIF (Tagged Image File Format)',
    extension: '.tiff, .tif',
    mime: 'image/tiff',
    status: 'Full',
    transparency: 'Preserved (where present)',
    decoder: 'UTIF Parser (Client-Side JS)',
    notes:
      'Decoded in-browser via pure JavaScript UTIF parser into raw RGBA pixel data, allowing high-resolution archival TIFFs to be converted directly into WebP.',
  },
  {
    name: 'AVIF (AV1 Image File Format)',
    extension: '.avif',
    mime: 'image/avif',
    status: 'Full',
    transparency: 'Full Alpha Channel',
    decoder: 'Native Browser Engine',
    notes:
      'Decoded natively in modern browsers. Useful for re-encoding AVIF assets to WebP for broader compatibility with older browsers.',
  },
  {
    name: 'ICO (Windows Icon Format)',
    extension: '.ico',
    mime: 'image/x-icon',
    status: 'Full',
    transparency: 'Full Alpha Channel',
    decoder: 'Native Canvas / createImageBitmap',
    notes:
      'Extracts icon bitmap frames and converts them into lightweight modern WebP assets.',
  },
];

export function FormatsPage() {
  return (
    <div className="flex flex-col bg-[#F8F3E9] text-[#25221E] flex-1">
      {/* 1. Specification Table Section */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Page Header */}
          <div className="text-center pb-6 border-b border-[#E2D8CA]">
            <h1 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold tracking-tight text-[#25221E]">
              Supported Formats & Conversion Behavior
            </h1>
            <p className="mt-3 text-[13px] text-[#766E63] max-w-2xl mx-auto leading-relaxed">
              Pixora supports 9 input image formats. Regardless of input format, every successful
              conversion outputs a genuine, binary-verified WebP file (<code className="font-mono text-[#95653E]">.webp</code>).
            </p>
          </div>

          {/* Specification Table */}
          <div className="overflow-hidden rounded-[8px] border border-[#E2D8CA] bg-[#FFFFFF] text-[#25221E]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E2D8CA] bg-[#F5EFE4] font-bold text-[#25221E]">
                    <th className="py-3 px-4">Format</th>
                    <th className="py-3 px-3">Extensions</th>
                    <th className="py-3 px-3">Support Level</th>
                    <th className="py-3 px-3">Transparency</th>
                    <th className="py-3 px-3">Decoder Engine</th>
                    <th className="py-3 px-4">Behavior & Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D8CA]">
                  {DETAILED_FORMATS.map((fmt) => (
                    <tr
                      key={fmt.name}
                      className="hover:bg-[#F8F3E9] transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-[#25221E]">
                        {fmt.name}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#766E63]">
                        {fmt.extension}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {fmt.status === 'Full' && (
                          <span className="inline-flex items-center gap-1 font-bold text-[#2E6B4E]">
                            <Check className="h-3 w-3" />
                            Full Support
                          </span>
                        )}
                        {fmt.status === 'Optimized' && (
                          <span className="inline-flex items-center gap-1 font-medium text-[#25221E]">
                            <Check className="h-3 w-3" />
                            Recompress
                          </span>
                        )}
                        {fmt.status === 'Rasterized' && (
                          <span className="inline-flex items-center gap-1 font-medium text-[#766E63]">
                            <FileCode className="h-3 w-3" />
                            Rasterized
                          </span>
                        )}
                        {fmt.status === 'Static Frame' && (
                          <span className="inline-flex items-center gap-1 font-bold text-[#95653E]">
                            <AlertTriangle className="h-3 w-3" />
                            Static Frame
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-[#766E63] whitespace-nowrap">
                        {fmt.transparency}
                      </td>
                      <td className="py-3 px-3 text-[#766E63] font-mono text-[11px] whitespace-nowrap">
                        {fmt.decoder}
                      </td>
                      <td className="py-3 px-4 text-[#25221E] leading-relaxed max-w-xs text-[12px]">
                        {fmt.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Protoface Diagonal Divider */}
      <HatchedDivider />

      {/* 2. Technical Deep Dives & CTA */}
      <section className="py-12 sm:py-16 bg-[#F5EFE4]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SVG Rasterization */}
            <div className="rounded-[8px] border border-[#E2D8CA] bg-[#F8F3E9] p-5 text-[#25221E]">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-[#95653E]" />
                <h3 className="text-[13px] font-bold text-[#25221E]">
                  SVG Security & Rasterization
                </h3>
              </div>
              <p className="mt-2 text-[12px] text-[#766E63] leading-relaxed">
                SVGs are XML documents capable of executing arbitrary JavaScript and loading external
                resources. Pixora sanitizes every SVG via DOMParser, removing all script tags,
                foreign objects, and remote URLs before rendering. The sanitized vector is rasterized
                to fixed WebP pixels.
              </p>
            </div>

            {/* GIF Animation */}
            <div className="rounded-[8px] border border-[#E2D8CA] bg-[#F8F3E9] p-5 text-[#25221E]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[#95653E]" />
                <h3 className="text-[13px] font-bold text-[#25221E]">
                  GIF Animation Handling
                </h3>
              </div>
              <p className="mt-2 text-[12px] text-[#766E63] leading-relaxed">
                Pixora inspects GIF binary structures to identify whether a file has multiple frame
                descriptors. If animated, the first frame is converted to static WebP and flagged with
                a notice. We never silently pretend an animated GIF was converted with animation
                intact.
              </p>
            </div>

            {/* Output Verification */}
            <div className="rounded-[8px] border border-[#E2D8CA] bg-[#F8F3E9] p-5 text-[#25221E]">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#95653E]" />
                <h3 className="text-[13px] font-bold text-[#25221E]">
                  Output Binary Verification
                </h3>
              </div>
              <p className="mt-2 text-[12px] text-[#766E63] leading-relaxed">
                A common flaw in rudimentary converter tools is renaming file extensions without
                converting the binary container. Pixora inspects the first 12 bytes of every produced
                blob, asserting the presence of `RIFF` and `WEBP` magic bytes before marking any
                file complete.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-2">
            <Link
              href="/converter"
              className="inline-flex items-center gap-2 rounded-[99px] bg-[#95653E] px-6 py-3 text-[13px] font-semibold text-[#F8F3E9] transition-colors hover:bg-[#79502F] active:bg-[#624024]"
            >
              <span>Open Converter Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FormatsPage;
