# WebPKit — Bulk Image to WebP Converter

A high-performance, private, client-side web application built with **Next.js (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS** that converts multiple image files from 9 supported input formats into genuine **WebP** files in bulk.

---

## Key Features

- **100% Client-Side Privacy**: All decoding, Canvas rasterization, WebP compression, and ZIP generation run locally in the browser. Zero images or metadata ever touch a server.
- **Bulk Multi-File Processing**: Drag & drop or pick multiple files with add-more support, per-file progress tracking, and batch concurrency control.
- **Genuine WebP Verification**: Every output file is inspected for authentic `RIFF....WEBP` magic header bytes before completion.
- **Accurate Size Savings**: Computes real percentage reduction:
  $$\text{Savings } \% = \frac{\text{Original Size} - \text{Output Size}}{\text{Original Size}} \times 100$$
  If an already compressed image increases in size, it is transparently reported as `+X% (larger)` rather than falsely claimed as a saving.
- **Batch ZIP Archive**: Download all successfully converted WebP files in a single ZIP archive powered by JSZip with live compression progress.
- **Collision-Proof Filenames**: Handles duplicate filenames automatically (`photo.webp`, `photo_1.webp`, `photo_2.webp`).
- **Flexible Optimization Controls**:
  - WebP quality slider (1% to 100%, default 80%)
  - Lossless WebP toggle
  - Optional dimension bounding box (Max Width / Max Height) with aspect ratio preservation
- **Error Isolation**: Corrupt or malformed files fail gracefully without interrupting the rest of the queue, with retry capabilities.

---

## Supported Input Formats

| Format | Extensions | Engine / Decoder | Alpha Transparency | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **PNG** | `.png` | Native Canvas / Bitmap | Preserved | Significant size reduction for screenshots & UI assets |
| **JPEG** | `.jpg`, `.jpeg` | Native Canvas / Bitmap | N/A | 25%–35% smaller than original JPEG at matching visual quality |
| **WebP** | `.webp` | Native Canvas / Bitmap | Preserved | Recompress or resize existing WebP files |
| **SVG** | `.svg` | DOMParser + Canvas | Preserved | Sanitized to prevent XSS/external calls; rasterized to WebP bitmap |
| **GIF** | `.gif` | Header Inspector + Canvas | Preserved | Static GIFs convert cleanly. Animated GIFs convert static frame with clear badge |
| **BMP** | `.bmp` | Native Canvas / Bitmap | N/A | Massive 80%–95% savings over uncompressed bitmaps |
| **TIFF / TIF** | `.tiff`, `.tif` | UTIF Parser | Preserved | Pure JS/Wasm decoding of uncompressed & LZW TIFF images |
| **AVIF** | `.avif` | Native Canvas / Bitmap | Preserved | Re-encode AVIF to WebP for broader browser compatibility |
| **ICO** | `.ico` | Native Canvas / Bitmap | Preserved | Icon and favicon conversion to modern WebP |

---

## Architecture & Multi-Page Structure

```
converter/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # App layout with Header, Footer, Geist fonts, metadata
│   │   ├── page.tsx                  # Home page (/): benchmark preview, benefits, 3-step overview
│   │   ├── converter/
│   │   │   └── page.tsx              # Converter page (/converter): full workspace, settings, queue, ZIP
│   │   ├── how-it-works/
│   │   │   └── page.tsx              # How It Works (/how-it-works): 4-step workflow, privacy deep dive
│   │   ├── formats/
│   │   │   └── page.tsx              # Supported Formats (/formats): matrix, SVG/GIF/TIFF specs
│   │   ├── faq/
│   │   │   └── page.tsx              # FAQ (/faq): accessible technical accordion
│   │   └── globals.css               # Clean styling & Geist typography tokens
│   ├── components/
│   │   └── converter/
│   │       ├── header.tsx            # Navigation header with active route tracking
│   │       ├── footer.tsx            # Clean footer with real page links
│   │       ├── upload-zone.tsx       # Drag & drop upload area with rejection alerts
│   │       ├── conversion-settings.tsx # Quality, lossless, resize, and batch actions
│   │       ├── conversion-summary.tsx# Batch metrics, savings %, and progress bar
│   │       ├── conversion-queue.tsx  # Filter tabs, search, cards, and ZIP export
│   │       └── conversion-file-card.tsx # Thumbnail, size comparison, download, retry
│   │       ├── faq-section.tsx       # Technical FAQ accordion
│   │       └── footer.tsx            # Footer & privacy reassurance
│   ├── hooks/
│   │   └── use-image-converter.ts    # React state hook for queue, concurrency, and options
│   └── lib/
│       └── image-converter/
│           ├── types.ts              # Data models and interfaces
│           ├── validation.ts         # Magic byte sniffing & SVG sanitization
│           ├── gif-detector.ts       # GIF binary inspection for animation
│           ├── browser-converter.ts  # Multi-format conversion & Canvas pipeline
│           ├── output-verification.ts# RIFF/WEBP binary signature verification
│           ├── file-naming.ts        # Duplicate resolver & formatters
│           ├── zip-generator.ts      # JSZip batch packing
│           └── download-manager.ts   # Object URL management & downloads
└── tests/
    ├── validation.test.ts            # Magic byte detection, limits, SVG sanitization
    ├── conversion.test.ts            # Sizing calculations & GIF animation detector
    ├── file-naming.test.ts           # Duplicate naming, byte formatting, savings %
    ├── output-verification.test.ts   # WebP header signature validation
    └── zip-generator.test.ts         # ZIP archive generation & failure isolation
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (tested on Node v25)
- npm or pnpm

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Unit Tests

```bash
npm test
```

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```
