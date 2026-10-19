'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Converter', href: '/converter' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Supported Formats', href: '/formats' },
  { name: 'FAQ', href: '/faq' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2D8CA] bg-[#F8F3E9]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="Pixora Home">
          <Image
            src="/pixora-symbol.png"
            alt="Pixora Symbol"
            width={28}
            height={36}
            priority
            className="h-7 w-auto transition-transform group-hover:scale-105"
          />
          <span className="text-[17px] font-bold tracking-tight text-[#25221E]">
            Pixora<span className="text-[#95653E] ml-0.5">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 text-[12px] md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-[99px] px-3 py-1 transition-colors ${
                  isActive
                    ? 'bg-[#95653E] text-[#F8F3E9] font-semibold'
                    : 'text-[#766E63] hover:text-[#25221E] hover:bg-[#E6D8C5]/50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {pathname !== '/converter' && (
            <Link
              href="/converter"
              className="inline-flex items-center gap-1.5 rounded-[99px] bg-[#95653E] px-4 py-1.5 text-[12px] font-semibold text-[#F8F3E9] transition-colors hover:bg-[#79502F] active:bg-[#624024]"
            >
              <span>Launch Converter</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-[99px] text-[#25221E] hover:bg-[#E6D8C5] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2D8CA] bg-[#F8F3E9] px-4 py-3">
          <nav className="flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-[99px] px-3 py-2 text-[12px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[#95653E] text-[#F8F3E9] font-semibold'
                      : 'text-[#766E63] hover:text-[#25221E] hover:bg-[#E6D8C5]/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
