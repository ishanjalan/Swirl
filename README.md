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

## 🌟 Why Swirl?

| Feature | Swirl | EZGif | Giphy | Kapwing | Imgflip |
|---------|-------|-------|-------|---------|---------|
| 100% Client-side | ✅ | ❌ | ❌ | ❌ | ❌ |
| No File Uploads | ✅ | ❌ | ❌ | ❌ | ❌ |
| No Watermarks | ✅ | ✅ | ✅ | ❌ Free | ✅ |
| Batch Processing | ✅ | Limited | ❌ | ✅ | ❌ |
| ZIP Download | ✅ | ❌ | ❌ | ✅ | ❌ |
| Video to GIF | ✅ | ✅ | ✅ | ✅ | ✅ |
| GIF from Images | ✅ | ✅ | ✅ | ✅ | ✅ |
| Optimize/Compress | ✅ | ✅ | ❌ | Limited | ❌ |
| Visual Crop | ✅ | ✅ | ❌ | ✅ | ❌ |
| Speed Control | ✅ | ✅ | ❌ | ✅ | ❌ |
| Reverse/Boomerang | ✅ | ✅ | ❌ | ✅ | ❌ |
| Combine GIFs | ✅ | ✅ | ❌ | ✅ | ❌ |
| Split to Frames | ✅ | ✅ | ❌ | ❌ | ❌ |
| Platform Presets | ✅ | ❌ | ❌ | ❌ | ❌ |
| Copy to Clipboard | ✅ | ❌ | ❌ | ❌ | ❌ |
| Before/After Compare | ✅ | ❌ | ❌ | ❌ | ❌ |
| Offline Support | ✅ | ❌ | ❌ | ❌ | ❌ |
| Open Source | ✅ | ❌ | ❌ | ❌ | ❌ |
| No Account Required | ✅ | ✅ | ❌ | ❌ | ✅ |
| No Ads | ✅ | ❌ | ✅ | ✅ | ❌ |
| Upload Limit | None | ~100MB | Varies | 250MB | 35MB |

### Key Advantages

**🔒 Privacy First**
- EZGif, Giphy, and others upload your files to their servers
- Swirl processes everything locally — your GIFs never leave your device
- No tracking, no analytics, no data collection

**⚡ No Waiting**
- No upload time, no server queue, no download wait
- Processing starts immediately on your hardware
- Works offline once loaded

**🎯 Built for Workflows**
- One-click presets for Discord, Slack, Twitter, WhatsApp
- Batch process multiple files with ZIP download
- Before/after comparison to verify quality
- Copy directly to clipboard for instant sharing

**🎨 Modern Experience**
- Clean, distraction-free interface
- Mobile-friendly with touch-optimized controls
- Dark theme for comfortable extended use

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
