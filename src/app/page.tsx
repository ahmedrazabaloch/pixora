'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Archive,
  Layers,
  Sparkles,
  TrendingDown,
  Upload,
  Sliders,
  FileCheck2,
} from 'lucide-react';
import { HatchedDivider } from '@/components/converter/hatched-divider';

export default function HomePage() {
  return (
    <div className="flex flex-col bg-[#F8F3E9] text-[#25221E]">
      {/* 1. Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/pixora-symbol.png"
              alt="Pixora Logo"
              width={72}
              height={94}
              priority
              className="h-16 w-auto transition-transform hover:scale-105"
            />
          </div>

          <h1 className="text-[32px] sm:text-[48px] md:text-[56px] font-bold tracking-tight text-[#25221E] leading-[1.1]">
            Convert Images to WebP. In Bulk.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-relaxed text-[#766E63]">
            Batch optimize your web assets with client-side WebP conversion. Cut image payload by up to
            80%, preserve alpha transparency, and download everything in a clean ZIP archive.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/converter"
              className="inline-flex items-center gap-2 rounded-[99px] bg-[#95653E] px-6 py-3 text-[13px] font-semibold text-[#F8F3E9] transition-colors hover:bg-[#79502F] active:bg-[#624024]"
            >
              <span>Start Converting</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/formats"
              className="inline-flex items-center gap-2 rounded-[99px] border border-[#E2D8CA] bg-[#F5EFE4] px-5 py-3 text-[13px] font-medium text-[#25221E] transition-colors hover:bg-[#E6D8C5]"
            >
              Supported Formats
            </Link>
          </div>
        </div>
      </section>

      {/* Protoface Diagonal Divider 1 */}
      <HatchedDivider />

      {/* 2. Compact Visual Compression Demonstration */}
      <section className="py-14 bg-[#F5EFE4]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#766E63]">
              Compression Performance Benchmark
            </span>
          </div>

          <div className="rounded-[8px] border border-[#E2D8CA] bg-[#F8F3E9] p-5 text-[#25221E]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Input Card */}
              <div className="rounded-[6px] border border-[#E2D8CA] bg-[#F5EFE4] p-4">
                <div className="flex items-center justify-between text-[11px] text-[#766E63]">
                  <span className="font-semibold text-[#25221E]">Original Asset</span>
                  <span className="rounded-[99px] border border-[#E2D8CA] bg-[#F8F3E9] px-2 py-0.5 font-mono text-[10px] text-[#766E63]">
                    PNG
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <p className="text-[12px] font-medium text-[#25221E] truncate">
                      hero-banner-4k.png
                    </p>
                    <p className="text-[11px] font-mono text-[#766E63]">1920 × 1080 px</p>
                  </div>
                  <span className="text-[18px] font-bold font-mono text-[#25221E]">
                    2.40 MB
                  </span>
                </div>
              </div>

              {/* Converted Output Card */}
              <div className="rounded-[6px] border border-[#95653E] bg-[#FFFFFF] p-4">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#95653E]">Pixora Output</span>
                  <span className="rounded-[99px] bg-[#95653E] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#F8F3E9]">
                    WEBP (q=80)
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <p className="text-[12px] font-medium text-[#25221E] truncate">
                      hero-banner-4k.webp
                    </p>
                    <p className="text-[11px] font-mono text-[#766E63]">1920 × 1080 px</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[18px] font-bold font-mono text-[#95653E]">
                      480 KB
                    </span>
                    <div className="inline-flex items-center gap-0.5 rounded-[99px] border border-[#CDE0D4] bg-[#E8F2EC] px-2 py-0.2 text-[10px] font-bold text-[#2E6B4E] ml-1.5">
                      <TrendingDown className="h-2.5 w-2.5" />
                      -80.0%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spec Footnote */}
            <div className="mt-4 pt-3 border-t border-[#E2D8CA] flex flex-wrap items-center justify-between text-[11px] text-[#766E63] gap-2">
              <span>Verified genuine RIFF/WEBP binary header</span>
              <span>Full alpha channel transparency preserved</span>
              <span>Zero server roundtrips (100% in-browser)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Four Key Benefits */}
      <section className="py-16 bg-[#F8F3E9]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-[24px] sm:text-[32px] font-bold tracking-tight text-[#25221E]">
              Engineered for Production Web Performance
            </h2>
            <p className="mt-1 text-[13px] text-[#766E63]">
              Strictly client-side, warm editorial design, and built for technical teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-[8px] border border-[#E2D8CA] bg-[#F5EFE4] p-5 text-[#25221E]">
              <div className="flex h-8 w-8 items-center justify-center rounded-[99px] bg-[#E6D8C5] text-[#95653E]">
                <Layers className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-[13px] font-bold text-[#25221E]">
                Bulk Parallel Queue
              </h3>
              <p className="mt-1.5 text-[12px] text-[#766E63] leading-relaxed">
                Process up to 100 images with bounded concurrency. The browser UI stays responsive
                with zero memory leaks.
              </p>
            </div>

            <div className="rounded-[8px] border border-[#E2D8CA] bg-[#F5EFE4] p-5 text-[#25221E]">
              <div className="flex h-8 w-8 items-center justify-center rounded-[99px] bg-[#E6D8C5] text-[#95653E]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-[13px] font-bold text-[#25221E]">
                100% Client Privacy
              </h3>
              <p className="mt-1.5 text-[12px] text-[#766E63] leading-relaxed">
                Images are converted directly in local browser memory. Confidential prototypes never
                touch external servers.
              </p>
            </div>

            <div className="rounded-[8px] border border-[#E2D8CA] bg-[#F5EFE4] p-5 text-[#25221E]">
              <div className="flex h-8 w-8 items-center justify-center rounded-[99px] bg-[#E6D8C5] text-[#95653E]">
                <Archive className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-[13px] font-bold text-[#25221E]">
                Batch ZIP Archive
              </h3>
              <p className="mt-1.5 text-[12px] text-[#766E63] leading-relaxed">
                Download individual files or compile all converted images into a single ZIP archive
                with collision-safe filenames.
              </p>
            </div>

            <div className="rounded-[8px] border border-[#E2D8CA] bg-[#F5EFE4] p-5 text-[#25221E]">
              <div className="flex h-8 w-8 items-center justify-center rounded-[99px] bg-[#E6D8C5] text-[#95653E]">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-[13px] font-bold text-[#25221E]">
                Verified WebP Binary
              </h3>
              <p className="mt-1.5 text-[12px] text-[#766E63] leading-relaxed">
                Never renamed PNG files. Every output is inspected for valid RIFF/WEBP magic signatures
                before marking complete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Protoface Diagonal Divider 2 */}
      <HatchedDivider />

      {/* 4. Brief How It Works Overview (3 steps) */}
      <section className="py-16 bg-[#F5EFE4]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-[20px] sm:text-[26px] font-bold tracking-tight text-[#25221E]">
              How It Works
            </h2>
            <p className="mt-1 text-[13px] text-[#766E63]">
              Three straightforward steps to optimize your image assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-[8px] border border-[#E2D8CA] bg-[#F8F3E9] p-5 text-[#25221E]">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-[99px] bg-[#95653E] font-mono text-[11px] font-bold text-[#F8F3E9]">
                  1
                </span>
                <Upload className="h-4 w-4 text-[#766E63]" />
                <h3 className="text-[13px] font-bold text-[#25221E]">
                  Select Images
                </h3>
              </div>
              <p className="mt-2 text-[12px] text-[#766E63] leading-relaxed">
                Drop PNG, JPG, WebP, SVG, GIF, BMP, TIFF, AVIF, or ICO files into the queue.
              </p>
            </div>

            <div className="rounded-[8px] border border-[#E2D8CA] bg-[#F8F3E9] p-5 text-[#25221E]">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-[99px] bg-[#95653E] font-mono text-[11px] font-bold text-[#F8F3E9]">
                  2
                </span>
                <Sliders className="h-4 w-4 text-[#766E63]" />
                <h3 className="text-[13px] font-bold text-[#25221E]">
                  Set Quality & Bounds
                </h3>
              </div>
              <p className="mt-2 text-[12px] text-[#766E63] leading-relaxed">
                Adjust compression quality (default 80%) or enable lossless mode and dimension constraints.
              </p>
            </div>

            <div className="rounded-[8px] border border-[#E2D8CA] bg-[#F8F3E9] p-5 text-[#25221E]">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-[99px] bg-[#95653E] font-mono text-[11px] font-bold text-[#F8F3E9]">
                  3
                </span>
                <FileCheck2 className="h-4 w-4 text-[#766E63]" />
                <h3 className="text-[13px] font-bold text-[#25221E]">
                  Download WebP / ZIP
                </h3>
              </div>
              <p className="mt-2 text-[12px] text-[#766E63] leading-relaxed">
                Review size savings per image. Download single WebP files or package the whole batch as a ZIP.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/how-it-works"
              className="text-[12px] font-semibold text-[#95653E] underline underline-offset-4 hover:text-[#79502F]"
            >
              Read complete workflow documentation →
            </Link>
          </div>
        </div>
      </section>

      {/* Protoface Diagonal Divider 3 */}
      <HatchedDivider />

      {/* 5. Final Call to Action */}
      <section className="py-16 bg-[#F8F3E9]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-[8px] border border-[#E2D8CA] bg-[#E6D8C5] p-8 sm:p-10 text-[#25221E]">
            <h2 className="text-[24px] sm:text-[30px] font-bold tracking-tight text-[#25221E]">
              Ready to Optimize Your Assets?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-[13px] text-[#766E63]">
              Start converting immediately without creating an account or uploading files to an external server.
            </p>
            <div className="mt-6">
              <Link
                href="/converter"
                className="inline-flex items-center gap-2 rounded-[99px] bg-[#95653E] px-6 py-3 text-[13px] font-semibold text-[#F8F3E9] transition-colors hover:bg-[#79502F] active:bg-[#624024]"
              >
                <span>Open Converter Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
