'use client';

import React from 'react';
import { ArrowDown, Check, Shield, Zap, Archive } from 'lucide-react';

interface HeroSectionProps {
  onUploadClick: () => void;
}

export function HeroSection({ onUploadClick }: HeroSectionProps) {
  return (
    <section className="border-b border-[#E2D8CA] bg-[#F8F3E9] py-12 text-[#25221E]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Simple mono tag */}
        <div className="inline-flex items-center gap-1.5 rounded-[99px] border border-[#E2D8CA] bg-[#F5EFE4] px-3 py-1 text-xs font-medium text-[#766E63] mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#95653E]" />
          <span>In-Browser Image Optimization Utility</span>
        </div>

        {/* Heading in solid charcoal text - strictly no text gradient */}
        <h1 className="text-3xl font-bold tracking-tight text-[#25221E] sm:text-4xl md:text-5xl">
          Convert Images to WebP in Bulk
        </h1>

        {/* Supporting text */}
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#766E63] sm:text-base">
          Convert multiple images to WebP, compare file sizes, and download everything in one ZIP.
          Fast, simple, and privacy-focused.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={onUploadClick}
            type="button"
            className="inline-flex items-center gap-2 rounded-[99px] bg-[#95653E] px-5 py-2.5 text-sm font-semibold text-[#F8F3E9] transition-colors hover:bg-[#79502F] cursor-pointer"
          >
            <span>Upload Images</span>
            <ArrowDown className="h-4 w-4" />
          </button>
          <a
            href="/how-it-works"
            className="inline-flex items-center gap-2 rounded-[99px] border border-[#E2D8CA] bg-[#F5EFE4] px-4 py-2.5 text-sm font-medium text-[#25221E] transition-colors hover:bg-[#E6D8C5] cursor-pointer"
          >
            Documentation
          </a>
        </div>

        {/* Simple feature specs */}
        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4 text-xs font-medium text-[#766E63]">
          <div className="flex items-center justify-center gap-2 rounded-[6px] border border-[#E2D8CA] bg-[#F5EFE4] py-2 px-3">
            <Shield className="h-3.5 w-3.5 text-[#95653E] shrink-0" />
            <span>Zero Server Uploads</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-[6px] border border-[#E2D8CA] bg-[#F5EFE4] py-2 px-3">
            <Check className="h-3.5 w-3.5 text-[#2E6B4E] shrink-0" />
            <span>9 Format Decoders</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-[6px] border border-[#E2D8CA] bg-[#F5EFE4] py-2 px-3">
            <Zap className="h-3.5 w-3.5 text-[#95653E] shrink-0" />
            <span>Real Savings Ratio</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-[6px] border border-[#E2D8CA] bg-[#F5EFE4] py-2 px-3">
            <Archive className="h-3.5 w-3.5 text-[#95653E] shrink-0" />
            <span>Batch ZIP Export</span>
          </div>
        </div>
      </div>
    </section>
  );
}
