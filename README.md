# Swirl

A blazing-fast, privacy-first GIF toolkit that runs entirely in your browser. Create, optimize, and transform GIFs with professional tools — no uploads, no servers, no compromises.

**The GIF companion to [Squish](https://github.com/ishanjalan/ImageOptimser) (images) and [Squash](https://github.com/ishanjalan/Squash) (video).**

**[🚀 Try it live](https://ishanjalan.github.io/Swirl/)**

## ✨ Features

### 🔒 100% Private
Your GIFs **never leave your device**. All processing happens locally using WebAssembly — no server uploads, no data collection, complete privacy.

### 🎬 8 Professional Tools

| Tool | Description |
|------|-------------|
| **Video to GIF** | Convert any video clip to a high-quality GIF with gifski encoding |
| **GIF Maker** | Create GIFs from images with drag-and-drop reordering |
| **Optimize** | Compress GIFs for Discord, Slack, Twitter with one-click presets |
| **Combine** | Merge multiple GIFs into one seamless animation |
| **Resize** | Resize for emojis, stickers, or any platform |
| **Crop** | Visual cropping with drag handles and aspect ratio presets |
| **Speed & Reverse** | Speed up, slow down, reverse, or boomerang |
| **Split Frames** | Export every frame as PNG |

### ⚡ State-of-the-Art Encoding
Powered by the latest GIF technology:
- **[gifski-wasm](https://github.com/nicferrier/gifski-wasm)** — High-quality GIF encoding with pngquant-level dithering
- **[gifsicle-wasm](https://github.com/nicferrier/gifsicle-wasm-browser)** — Optimized GIF manipulation (resize, crop, speed, merge)
- **[WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)** — Hardware-accelerated video decoding

### 🎯 Smart Presets
One-click optimization for popular platforms:
- **Discord** — 10MB limit
- **Twitter/X** — 15MB limit
- **Slack** — 1MB limit
- **WhatsApp** — 16MB limit

### 🚀 Batch Processing
- Process multiple GIFs simultaneously
- Download all results as a single ZIP
- Batch summary with processing stats

### 🎨 Beautiful Experience
- Side-by-side before/after comparison slider
- Real-time processing progress
- Dark theme optimized for focus
- Responsive design for all screen sizes
- Copy to clipboard support
- Drag-to-reorder images

### 📱 PWA Support
- Installable as a desktop/mobile app
- Offline-capable with Service Worker caching
- Fast repeat visits with cached assets

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | [SvelteKit 2](https://kit.svelte.dev/) + [Svelte 5](https://svelte.dev/) | Modern reactive UI |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS |
| GIF Encoding | [gifski-wasm](https://github.com/nicferrier/gifski-wasm) | High-quality GIF creation |
| GIF Processing | [gifsicle-wasm](https://github.com/nicferrier/gifsicle-wasm-browser) | Optimize, resize, crop, speed |
| Video Decode | [Mediabunny](https://mediabunny.dev/) | WebCodecs video extraction |
| ZIP | [JSZip](https://stuk.github.io/jszip/) | Batch downloads |
| Icons | [Lucide](https://lucide.dev/) | Beautiful icon set |
| Language | TypeScript | Type safety |

## 🔧 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Svelte 5 UI                            │   │
│  │  Video to GIF │ GIF Maker │ Optimize │ Resize │ Crop ... │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             │                                    │
│         ┌───────────────────┼───────────────────┐               │
│         ▼                   ▼                   ▼               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ WebCodecs   │    │ gifski-wasm │    │ gifsicle    │         │
│  │ (Decode)    │    │ (Encode)    │    │ (Process)   │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│         │                   │                   │               │
│         └───────────────────┼───────────────────┘               │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Output GIF                             │   │
│  │  • Download  • Copy to Clipboard  • Compare  • ZIP       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              
              🔒 Everything runs locally — zero uploads 🔒
```

### Processing Pipelines

**Video to GIF:**
```
Video → WebCodecs (decode frames) → Canvas → gifski (encode) → GIF
```

**GIF Maker:**
```
Images → Canvas (resize/normalize) → gifski (encode) → GIF
```

**Optimize/Resize/Crop/Speed:**
```
GIF → gifsicle-wasm → Optimized GIF
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, pnpm, or yarn
- Modern browser (Chrome 94+, Edge 94+, Safari 16.4+)

### Installation

```bash
# Clone the repository
git clone https://github.com/ishanjalan/Swirl.git
cd Swirl

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## 📖 Usage

### Video to GIF
1. **Drop a video** — Drag and drop or click to browse
2. **Trim** — Select start and end times
3. **Configure** — Set FPS, width, and quality
4. **Convert** — Click Convert and wait for processing
5. **Download** — Save, copy to clipboard, or compare

### GIF Optimization
1. **Drop GIFs** — Multiple files supported
2. **Choose preset** — Discord, Twitter, Slack, or custom
3. **Optimize** — Click Optimize All
4. **Download** — Individual files or ZIP

### Resize for Platforms
Quick presets for:
- Discord Emoji (128×128)
- Discord Sticker (320×320)
- Slack Emoji (128×128)
- Profile Picture (400×400)
- Custom dimensions

## 📊 Supported Formats

### Input
| Format | Video to GIF | GIF Maker | Other Tools |
|--------|--------------|-----------|-------------|
| GIF | ❌ | ❌ | ✅ |
| MP4 | ✅ | ❌ | ❌ |
| WebM | ✅ | ❌ | ❌ |
| MOV | ✅ | ❌ | ❌ |
| PNG | ❌ | ✅ | ❌ |
| JPEG | ❌ | ✅ | ❌ |
| WebP | ❌ | ✅ | ❌ |

### Output
- GIF (all tools)
- PNG (Split Frames)
- ZIP (batch downloads)

## 🌟 The Squish Family

| App | Purpose | Tech |
|-----|---------|------|
| **[Squish](https://github.com/ishanjalan/ImageOptimser)** | Image optimization | icodec WASM |
| **[Squash](https://github.com/ishanjalan/Squash)** | Video compression | WebCodecs |
| **Swirl** | GIF toolkit | gifski + gifsicle |

All three apps share the same philosophy:
- ✅ 100% client-side
- ✅ No uploads
- ✅ Open source
- ✅ Free forever

## 🌟 Swirl vs Competitors

| Feature | Swirl | EZGif | Giphy | Kapwing |
|---------|:-----:|:-----:|:-----:|:-------:|
| **Privacy & Access** |||||
| 100% Client-side (no uploads) | ✅ | ❌ | ❌ | ❌ |
| Works Offline | ✅ | ❌ | ❌ | ❌ |
| No Account Required | ✅ | ✅ | ❌ | ❌ |
| No Watermarks | ✅ | ✅ | ✅ | ❌ Free |
| No Ads | ✅ | ❌ | ✅ | ✅ |
| Open Source | ✅ | ❌ | ❌ | ❌ |
| **Core Tools** |||||
| Video to GIF | ✅ | ✅ | ✅ | ✅ |
| GIF from Images | ✅ | ✅ | ✅ | ✅ |
| Optimize/Compress | ✅ | ✅ | ❌ | Limited |
| Resize | ✅ | ✅ | ❌ | ✅ |
| Crop | ✅ | ✅ | ❌ | ✅ |
| Speed Control | ✅ | ✅ | ❌ | ✅ |
| Reverse/Boomerang | ✅ | ✅ | ❌ | ✅ |
| Combine/Merge GIFs | ✅ | ✅ | ❌ | ✅ |
| Split to Frames | ✅ | ✅ | ❌ | ❌ |
| **Workflow Features** |||||
| Batch Processing | ✅ | Limited | ❌ | ✅ |
| ZIP Download | ✅ | ❌ | ❌ | ✅ |
| Platform Presets (Discord, Slack) | ✅ | ❌ | ❌ | ❌ |
| Copy to Clipboard | ✅ | ❌ | ❌ | ❌ |
| Before/After Compare | ✅ | ❌ | ❌ | ❌ |
| **Features We Don't Have (Yet)** |||||
| Text/Caption Overlay | ❌ | ✅ | ✅ | ✅ |
| Filters & Effects | ❌ | ✅ | ✅ | ✅ |
| Rotate/Flip | ❌ | ✅ | ❌ | ✅ |
| Frame-by-Frame Editing | ❌ | ✅ | ❌ | ✅ |
| APNG/WebP/AVIF Animation | ❌ | ✅ | ❌ | ❌ |
| GIF Search/Library | ❌ | ❌ | ✅ | ❌ |
| URL Input | ❌ | ✅ | ❌ | ✅ |
| Templates | ❌ | ❌ | ✅ | ✅ |

### Where Swirl Shines

**🔒 Privacy** — Your files never leave your device. EZGif, Giphy, and Kapwing all upload to their servers.

**⚡ Speed** — No upload/download wait. Processing starts instantly on your hardware.

**🎯 Workflow** — Platform presets, batch ZIP downloads, clipboard copy, before/after compare.

**💰 Truly Free** — No watermarks, no limits, no upsells. Forever.

### Where Competitors Win

**EZGif** — More features: text overlay, effects, rotate/flip, frame editing, animated WebP/APNG support. The most complete online GIF toolkit.

**Giphy** — GIF discovery and search. Great for finding existing GIFs, not just making them.

**Kapwing** — Full video editor with timeline, layers, text, and templates. Overkill for simple GIF tasks, but powerful for complex projects.

### The Trade-off

Swirl prioritizes **privacy and simplicity** over feature count. If you need text overlays or frame-by-frame editing, EZGif is excellent. If you want your files to stay on your device and just need the core GIF tools done well, that's what Swirl is for.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [gifski](https://gif.ski/) — High-quality GIF encoder
- [gifsicle](https://www.lcdf.org/gifsicle/) — Powerful GIF manipulation
- [Squoosh](https://squoosh.app/) — Inspiration for browser-based media tools
- [Mediabunny](https://mediabunny.dev/) — WebCodecs video toolkit

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ishanjalan">Ishan Jalan</a>
</p>
