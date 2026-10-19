'use client';

import React from 'react';
import { Upload, Sliders, Archive } from 'lucide-react';

const STEPS = [
  {
    step: '1',
    title: 'Select or Drop Images',
    description:
      'Upload images in bulk (up to 100 files, 50MB each). Supported formats include PNG, JPG, WebP, SVG, GIF, BMP, TIFF, AVIF, and ICO.',
    icon: Upload,
  },
  {
    step: '2',
    title: 'Configure WebP Options',
    description:
      'Set target quality (1–100%) or enable lossless mode. Optionally apply maximum width and height bounds with aspect ratio preservation.',
    icon: Sliders,
  },
  {
    step: '3',
    title: 'Convert & Download ZIP',
    description:
      'View individual savings percentages. Download specific converted WebP files or export the whole batch in a single ZIP archive.',
    icon: Archive,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-10 border-t border-[#E2D8CA] bg-[#F8F3E9] text-[#25221E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-xl font-bold tracking-tight text-[#25221E] sm:text-2xl">
            How It Works
          </h2>
          <p className="mt-1 text-xs text-[#766E63] max-w-md mx-auto">
            High-speed client-side processing directly in your browser.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="flex flex-col justify-between rounded-[8px] border border-[#E2D8CA] bg-[#F5EFE4] p-5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-6 w-6 items-center justify-center rounded-[99px] bg-[#95653E] font-mono text-xs font-bold text-[#F8F3E9]">
                      {step.step}
                    </span>
                    <Icon className="h-4 w-4 text-[#766E63]" />
                  </div>

                  <h3 className="mt-3 text-sm font-semibold text-[#25221E]">
                    {step.title}
                  </h3>

                  <p className="mt-1.5 text-xs text-[#766E63] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
