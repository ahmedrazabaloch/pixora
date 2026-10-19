'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Why convert images to WebP?',
    answer:
      'WebP is a modern web image format developed by Google offering superior lossy and lossless compression. WebP images are typically 25%–35% smaller than comparable JPEGs and 26% smaller than PNGs while preserving alpha channel transparency. It is supported by 97%+ of all browsers worldwide.',
  },
  {
    question: 'Why did my converted file increase in size?',
    answer:
      'If an input image is already heavily compressed (such as an ultra-compressed JPEG or an 8-bit palette PNG), re-encoding it into a 32-bit ARGB WebP container at default quality (80%) can sometimes produce a slightly larger output. Pixora calculates the exact size delta and indicates this as a percentage increase rather than reporting false savings.',
  },
  {
    question: 'Are my images uploaded to any cloud server?',
    answer:
      'No. All decoding, canvas processing, WebP encoding, and ZIP archive creation occur entirely within your local browser. No image binary or filename data is sent over the network.',
  },
  {
    question: 'How are duplicate filenames resolved?',
    answer:
      'When multiple files share the same filename, Pixora automatically assigns unique deterministic identifiers (e.g., photo.webp, photo_1.webp, photo_2.webp) so that no images are overwritten in the ZIP archive.',
  },
  {
    question: 'How are SVG files converted?',
    answer:
      'SVG files are sanitized to remove any executable scripts or foreign resources, and then rasterized at intrinsic or custom bounds into a WebP bitmap. WebP is a raster format, meaning the resulting file will no longer be an infinitely scalable vector.',
  },
  {
    question: 'Can I convert animated GIFs?',
    answer:
      'Pixora detects animated GIFs and extracts the first frame to produce a static WebP image. The interface explicitly tags this with an informative badge so you are aware that animation is not preserved.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-10 border-t border-[#E2D8CA] bg-[#F8F3E9] text-[#25221E]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-xl font-bold tracking-tight text-[#25221E] sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-1 text-xs text-[#766E63]">
            Technical details on WebP compression, transparency, and browser-side processing.
          </p>
        </div>

        <div className="mt-6 space-y-2">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-[8px] border border-[#E2D8CA] bg-[#F5EFE4] transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-3.5 text-left text-xs font-semibold text-[#25221E] hover:text-[#95653E] cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="h-3.5 w-3.5 text-[#766E63] shrink-0" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-[#766E63] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-[#766E63] border-t border-[#E2D8CA] pt-2.5 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
