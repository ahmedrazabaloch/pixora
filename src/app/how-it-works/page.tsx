'use client';

import React from 'react';
import Link from 'next/link';
import {
  Upload,
  Sliders,
  Play,
  Archive,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { HatchedDivider } from '@/components/converter/hatched-divider';

const DETAILED_STEPS = [
  {
    step: '01',
    title: 'Upload Multiple Images',
    icon: Upload,
    description:
      'Select files via the file picker or drag and drop images directly into the browser window. Pixora accepts up to 100 images per batch, with files up to 50MB each.',
    details: [
      'Multi-file and folder drag-and-drop supported.',
      'Binary magic byte inspection detects true file type (ignoring spoofed extensions).',
      'Corrupt, zero-byte, or oversized files are flagged and isolated without crashing the batch.',
    ],
  },
  {
    step: '02',
    title: 'Configure Quality & Dimensions',
    icon: Sliders,
    description:
      'Adjust the encoding quality to balance file size against visual fidelity, or enable lossless compression for diagrams and icons.',
    details: [
      'Quality slider from 1% to 100% (default: 80% for optimal web delivery).',
      'Lossless toggle for pixel-perfect preservation of UI graphics.',
      'Optional maximum width and height bounds with automatic aspect ratio preservation.',
    ],
  },
  {
    step: '03',
    title: 'Convert Images & Inspect Results',
    icon: Play,
    description:
      'Pixora converts files using bounded parallel execution, keeping the interface responsive even when processing large photo batches.',
    details: [
      'Bounded concurrency (3 parallel workers) prevents CPU and memory spikes.',
      'TIFF files are decoded via client-side UTIF into RGBA pixel arrays.',
      'SVGs are sanitized against scripts and rasterized onto canvas.',
      'Accurate size savings calculation: if an already-compressed file increases in size, it is clearly reported as larger.',
    ],
  },
  {
    step: '04',
    title: 'Download Single WebP or Batch ZIP',
    icon: Archive,
    description:
      'Inspect verified output metrics and download your optimized files individually or packed together in a single ZIP archive.',
    details: [
      'Download individual WebP files immediately upon completion.',
      'Generate a consolidated ZIP archive containing all successfully converted files.',
      'Automatic duplicate filename resolution prevents overwriting identical file names.',
      'Temporary in-memory object URLs are automatically revoked to prevent browser memory leaks.',
    ],
  },
];

export function HowItWorksPage() {
  return (
    <div className="flex flex-col bg-[#F8F3E9] text-[#25221E] flex-1">
      {/* 1. Step-by-Step Workflow Section */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Page Title */}
          <div className="text-center pb-6 border-b border-[#E2D8CA]">
            <h1 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold tracking-tight text-[#25221E]">
              How Pixora Works
            </h1>
            <p className="mt-3 text-[13px] text-[#766E63] max-w-2xl mx-auto leading-relaxed">
              A step-by-step technical guide to in-browser batch WebP conversion, privacy architecture,
              and compression controls.
            </p>
          </div>

          {/* 4 Steps */}
          <div className="space-y-4">
            {DETAILED_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="rounded-[8px] border border-[#E2D8CA] bg-[#F5EFE4] p-6 text-[#25221E]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[99px] bg-[#95653E] text-[#F8F3E9] font-mono text-[12px] font-bold">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-[#766E63]" />
                        <h2 className="text-[15px] font-bold text-[#25221E]">
                          {item.title}
                        </h2>
                      </div>
                      <p className="mt-2 text-[12px] leading-relaxed text-[#766E63]">
                        {item.description}
                      </p>

                      <ul className="mt-3 space-y-1.5 border-t border-[#E2D8CA] pt-3">
                        {item.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[12px] text-[#25221E]">
                            <CheckCircle className="h-3.5 w-3.5 text-[#2E6B4E] shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Protoface Diagonal Divider */}
      <HatchedDivider />

      {/* 2. Browser-Side Processing & Privacy Deep Dive + CTA */}
      <section className="py-12 sm:py-16 bg-[#F5EFE4]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="rounded-[8px] border border-[#E2D8CA] bg-[#E6D8C5]/50 p-6 text-[#25221E]">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[99px] bg-[#95653E] text-[#F8F3E9]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-[15px] font-bold text-[#25221E]">
                  100% In-Browser Privacy Architecture
                </h2>
                <p className="mt-2 text-[12px] text-[#766E63] leading-relaxed">
                  Traditional image optimization utilities upload user files to remote cloud servers
                  for processing. Pixora operates on a fundamentally different model:
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
                  <div className="rounded-[6px] border border-[#E2D8CA] bg-[#FFFFFF] p-4">
                    <h4 className="font-bold text-[#25221E] text-[13px]">No Server Uploads</h4>
                    <p className="mt-1 text-[11px] text-[#766E63] leading-relaxed">
                      All decoding and encoding happens directly inside your web browser using HTML5 Canvas
                      and typed array memory. No image data or metadata is ever transmitted over the network.
                    </p>
                  </div>
                  <div className="rounded-[6px] border border-[#E2D8CA] bg-[#FFFFFF] p-4">
                    <h4 className="font-bold text-[#25221E] text-[13px]">Zero Server Latency</h4>
                    <p className="mt-1 text-[11px] text-[#766E63] leading-relaxed">
                      By bypassing HTTP upload and download cycles, conversion starts instantly. Large batches
                      process as fast as your local processor allows.
                    </p>
                  </div>
                </div>
              </div>
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

export default HowItWorksPage;
