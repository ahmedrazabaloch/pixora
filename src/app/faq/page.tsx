'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { HatchedDivider } from '@/components/converter/hatched-divider';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'why-webp',
    question: 'Why convert images to WebP?',
    answer:
      'WebP is a modern web image format developed by Google that delivers superior lossy and lossless compression. On average, WebP images are 25%–35% smaller than comparable JPEGs and 26% smaller than PNGs while retaining visual quality. Furthermore, WebP natively supports 8-bit alpha channel transparency (unlike standard JPEG) and is supported by more than 97% of modern web browsers globally.',
  },
  {
    id: 'compression-impact',
    question: 'How does image compression affect file size and quality?',
    answer:
      'In lossy WebP encoding, the quality setting (1–100) controls the discrete cosine transform (DCT) and macroblock quantization. A quality setting of 80 offers an optimal balance where human visual acuity cannot detect compression artifacts, but file size is dramatically reduced. When lossless mode is enabled, WebP uses spatial prediction and entropy encoding to reproduce original pixels with 100% mathematical fidelity. Note: converting an already low-quality, heavily compressed JPEG into a 32-bit WebP container can sometimes slightly increase size; Pixora transparently flags this rather than reporting false savings.',
  },
  {
    id: 'server-uploads',
    question: 'Are files uploaded to a server?',
    answer:
      'No. 100% of the image decoding, canvas rendering, WebP binary encoding, and ZIP archive creation happens locally inside your browser memory. Your images, filenames, and metadata never leave your computer or touch an external server or cloud service.',
  },
  {
    id: 'duplicate-filenames',
    question: 'How are duplicate filenames handled?',
    answer:
      'If you upload multiple files with identical filenames (for example, "screenshot.png" selected from multiple directories), Pixora automatically applies deterministic suffixing (e.g., screenshot.webp, screenshot_1.webp, screenshot_2.webp). This guarantees that files never overwrite each other when downloaded individually or inside a ZIP archive.',
  },
  {
    id: 'svg-conversion',
    question: 'Can SVG files be converted?',
    answer:
      'Yes. Because SVGs are XML documents that could potentially contain malicious JavaScript or external network requests, Pixora first parses and sanitizes the SVG with DOMParser, stripping all `<script>`, `<foreignObject>`, inline `on*` event handlers, and remote URLs. The sanitized vector elements are then rasterized onto an HTML5 canvas at intrinsic or custom bounds and exported as a crisp WebP bitmap.',
  },
  {
    id: 'animated-gifs',
    question: 'Can animated GIFs retain their animation?',
    answer:
      'Pixora inspects GIF binary structures to determine whether a GIF contains multiple frame descriptors. If an animated GIF is detected, the first frame is converted to a static WebP image, and the file card is marked with an explicit note ("Animated GIF: static frame converted"). We never silently pretend an animated GIF was fully preserved.',
  },
  {
    id: 'failed-conversions',
    question: 'What happens when a conversion fails?',
    answer:
      'Pixora isolates errors completely. If an input file is corrupt, malformed, or has zero bytes, it fails with an explicit error description on its individual card without crashing or interrupting the rest of the queue. You can retry failed files with different settings or dismiss them without reprocessing already-completed files.',
  },
  {
    id: 'zip-downloading',
    question: 'How does bulk ZIP downloading work?',
    answer:
      'When you click "Download ZIP", Pixora uses JSZip to assemble all successfully converted WebP blobs directly in browser memory. A real-time progress bar monitors deflation compression, and the completed archive triggers an instant browser download without downloading hundreds of single files individually.',
  },
];

export function FaqPage() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(['why-webp', 'server-uploads']));

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col bg-[#F8F3E9] text-[#25221E] flex-1">
      {/* 1. Main FAQ Questions Section */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Page Header */}
          <div className="text-center pb-6 border-b border-[#E2D8CA]">
            <h1 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold tracking-tight text-[#25221E]">
              Technical FAQ & Answers
            </h1>
            <p className="mt-3 text-[13px] text-[#766E63] max-w-2xl mx-auto leading-relaxed">
              Comprehensive answers regarding WebP compression standards, browser-side security, and
              file handling.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {FAQS.map((faq) => {
              const isOpen = openIds.has(faq.id);
              return (
                <div
                  key={faq.id}
                  className="rounded-[8px] border border-[#E2D8CA] bg-[#F5EFE4] text-[#25221E] transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-center justify-between p-4 text-left text-xs font-semibold text-[#25221E] hover:text-[#95653E] cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-[14px] font-bold text-[#25221E]">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-[#766E63] shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[#766E63] shrink-0 ml-2" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-[12px] text-[#766E63] border-t border-[#E2D8CA] pt-3 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Protoface Diagonal Divider between FAQ and Final CTA */}
      <HatchedDivider />

      {/* 2. Final Call-to-Action / Reassurance Section */}
      <section className="py-12 sm:py-16 bg-[#F5EFE4]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[8px] border border-[#E2D8CA] bg-[#E6D8C5]/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[#25221E]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#95653E] shrink-0" />
              <span className="text-[12px] text-[#25221E] leading-relaxed">
                Need custom limits or offline utility use? Pixora is 100% client-side with no network dependencies.
              </span>
            </div>
            <Link
              href="/converter"
              className="inline-flex items-center gap-1.5 rounded-[99px] bg-[#95653E] px-5 py-2.5 text-[12px] font-semibold text-[#F8F3E9] transition-colors hover:bg-[#79502F] active:bg-[#624024] shrink-0"
            >
              <span>Open Converter</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FaqPage;
