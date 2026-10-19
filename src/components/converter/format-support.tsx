'use client';

import React from 'react';
import { Check, AlertTriangle, FileCode, Layers } from 'lucide-react';
import { FormatFeature } from '@/lib/image-converter/types';

const FORMATS: FormatFeature[] = [
  {
    name: 'PNG (Portable Network Graphics)',
    extension: '.png',
    mime: 'image/png',
    status: 'Full',
    notes: 'Preserves full alpha transparency. High file size reduction for screenshots and interface assets.',
  },
  {
    name: 'JPEG / JPG',
    extension: '.jpg, .jpeg',
    mime: 'image/jpeg',
    status: 'Full',
    notes: 'Lossy photographic compression. Averages 25%–35% size reduction vs standard JPEG at equivalent visual fidelity.',
  },
  {
    name: 'WebP (Recompression)',
    extension: '.webp',
    mime: 'image/webp',
    status: 'Optimized',
    notes: 'Re-encode or downscale existing WebP files to adjust compression level or constrain dimensions.',
  },
  {
    name: 'SVG (Scalable Vector Graphics)',
    extension: '.svg',
    mime: 'image/svg+xml',
    status: 'Rasterized',
    notes: 'Sanitized to eliminate script execution and external network calls; rasterized to high-density WebP bitmap.',
  },
  {
    name: 'GIF (Graphics Interchange Format)',
    extension: '.gif',
    mime: 'image/gif',
    status: 'Static Frame',
    notes: 'Static GIFs convert with transparency. For animated GIFs, the first frame is converted to static WebP with explicit notification.',
  },
  {
    name: 'BMP (Bitmap Image)',
    extension: '.bmp',
    mime: 'image/bmp',
    status: 'Full',
    notes: 'Uncompressed raster bitmap. Converts directly to WebP, achieving 80%–95% file size savings.',
  },
  {
    name: 'TIFF / TIF',
    extension: '.tiff, .tif',
    mime: 'image/tiff',
    status: 'Full',
    notes: 'Decoded in-browser via UTIF into raw RGBA pixel arrays, outputting clean WebP containers.',
  },
  {
    name: 'AVIF',
    extension: '.avif',
    mime: 'image/avif',
    status: 'Full',
    notes: 'Decoded via native browser engine. Useful for converting to WebP for wider compatibility with older browsers.',
  },
  {
    name: 'ICO (Windows Icon)',
    extension: '.ico',
    mime: 'image/x-icon',
    status: 'Full',
    notes: 'Decodes favicon and icon binary structures, converting them to WebP.',
  },
];

export function FormatSupport() {
  return (
    <section id="formats" className="py-10 border-t border-[#E2D8CA] bg-[#F8F3E9] text-[#25221E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-[99px] border border-[#E2D8CA] bg-[#F5EFE4] px-3 py-1 text-xs font-medium text-[#766E63] mb-2">
            <Layers className="h-3 w-3 text-[#95653E]" />
            <span>Format Specification</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#25221E] sm:text-2xl">
            Supported Formats & Decoders
          </h2>
          <p className="mt-1 text-xs text-[#766E63] max-w-xl mx-auto">
            All conversions generate verified WebP files with valid binary RIFF/WEBP headers.
          </p>
        </div>

        {/* Clean Table */}
        <div className="mt-6 overflow-hidden rounded-[8px] border border-[#E2D8CA] bg-[#FFFFFF]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2D8CA] bg-[#F5EFE4] font-bold text-[#25221E]">
                  <th className="py-2.5 px-4">Format</th>
                  <th className="py-2.5 px-3">Extension</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-4">Decoding & Behavior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CA]">
                {FORMATS.map((fmt) => (
                  <tr
                    key={fmt.name}
                    className="hover:bg-[#F8F3E9] transition-colors"
                  >
                    <td className="py-2.5 px-4 font-semibold text-[#25221E]">
                      {fmt.name}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#766E63]">
                      {fmt.extension}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {fmt.status === 'Full' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2E6B4E]">
                          <Check className="h-3 w-3" />
                          Full
                        </span>
                      )}
                      {fmt.status === 'Optimized' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#25221E]">
                          <Check className="h-3 w-3" />
                          Recompress
                        </span>
                      )}
                      {fmt.status === 'Rasterized' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#766E63]">
                          <FileCode className="h-3 w-3" />
                          Rasterized
                        </span>
                      )}
                      {fmt.status === 'Static Frame' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#95653E]">
                          <AlertTriangle className="h-3 w-3" />
                          Static Frame
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-[#766E63]">
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
  );
}
