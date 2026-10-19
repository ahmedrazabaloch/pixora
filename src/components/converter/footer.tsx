'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-[#E2D8CA] bg-[#F8F3E9] py-8 text-[12px] text-[#766E63]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="Pixora Home">
            <Image
              src="/pixora-symbol.png"
              alt="Pixora Symbol"
              width={22}
              height={28}
              className="h-5 w-auto transition-transform group-hover:scale-105"
            />
            <span className="text-[14px] font-bold tracking-tight text-[#25221E]">
              Pixora<span className="text-[#95653E]">.</span>
            </span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[12px]">
            <Link href="/" className="text-[#95653E] underline underline-offset-4 hover:text-[#79502F]">
              Home
            </Link>
            <Link href="/converter" className="text-[#95653E] underline underline-offset-4 hover:text-[#79502F]">
              Converter
            </Link>
            <Link href="/how-it-works" className="text-[#95653E] underline underline-offset-4 hover:text-[#79502F]">
              How It Works
            </Link>
            <Link href="/formats" className="text-[#95653E] underline underline-offset-4 hover:text-[#79502F]">
              Formats
            </Link>
            <Link href="/faq" className="text-[#95653E] underline underline-offset-4 hover:text-[#79502F]">
              FAQ
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#E2D8CA] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#766E63] gap-2">
          <p>
            © 2026 Pixora. Designed and developed by{' '}
            <a
              href="https://www.linkedin.com/in/ahmedrazabaloch/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25221E] font-medium underline underline-offset-2 hover:text-[#95653E] transition-colors"
            >
              Ahmed Raza
            </a>
            .
          </p>
          <p className="font-mono">Clean · Fast · 100% Client-Side</p>
        </div>
      </div>
    </footer>
  );
}
