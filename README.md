# David Leer's Portfolio

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![Content Collections](https://img.shields.io/badge/Content_Collections-0.11-orange?style=flat-square)
![Resend](https://img.shields.io/badge/Resend-6.1.2-blueviolet?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

A production-ready developer portfolio built with Next.js 15, featuring a tiled window manager aesthetic inspired by Hyprland/Arch Linux. Showcases MDX-powered blog and projects, Cloudflare CDN integration, Resend contact form and parallax scrolling mobile layout. Deployed on Railway with zero-config Railpack builds.

**Modern tech stack meets terminal aesthetics—designed for developers who appreciate both craft and performance.**

[dleer.ai](https://dleer.ai) • [Report Issue](https://github.com/dleerdefi/dleer-portfolio/issues)

</div>

---

## ✨ Features

- **Desktop Layout**: 6-tile Hyprland-inspired layout (Neofetch, Navigation, Content, Theme Preset, Accent Color, Background)
- **Keyboard Navigation**: Vim-style hjkl movement + Tab cycling + workspace indicators via Polybar
- **Mobile Experience**: Parallax scrolling with depth effects and scroll progress indicators
- **Theme System**: 3 curated presets (Tokyo Night, Nord, Solarized Light) + 15 accent color swatches
- **Content Management**: MDX-powered blog and projects with syntax highlighting and reading time
- **Audio Narration**: Blog post audio with auto-detection, playback controls, and analytics tracking
- **Contact Form**: Production-ready Resend integration with 5-layer spam protection (honeypot, rate limiting, validation)
- **CDN Integration**: Optional Cloudflare R2 for optimized image delivery with automatic fallback
- **Modern Architecture**: Next.js 15.5 + TypeScript strict mode + modular CSS (12 focused modules under 200 LOC each)
- **Zero-Config Deployment**: Railway + Railpack auto-detection with intelligent caching

---

## 🚀 Quick Start

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Setup

```bash
# Clone and install
git clone https://github.com/dleerdefi/dleer-portfolio.git
cd dleer-portfolio
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your RESEND_API_KEY and NEXT_PUBLIC_CONTACT_EMAIL

# Run development server
npm run dev
```

Visit **http://localhost:3000**

### Build Commands

```bash
npm run build      # Production build
npm run start      # Start production server
npm run typecheck  # TypeScript validation
npm run lint       # Code linting
npm test           # Unit tests (Vitest)
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local` from template and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | ✅ Yes | Resend API key ([resend.com](https://resend.com) - free: 100 emails/day, 3K/month) |
| `RESEND_FROM_EMAIL` | ✅ Yes | Verified domain email for Resend (e.g., `contact@dleer.ai`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | ✅ Yes | Email address to receive form submissions |
| `NEXT_PUBLIC_CDN_URL` | Optional | Cloudflare R2 CDN URL (e.g., `https://cdn.dleer.ai`) |
| `NEXT_PUBLIC_NAME` | Recommended | Your full name |
| `NEXT_PUBLIC_TITLE` | Recommended | Your professional title |
| `NEXT_PUBLIC_GITHUB_URL` | Recommended | GitHub profile URL |
| `NEXT_PUBLIC_LINKEDIN_URL` | Optional | LinkedIn profile URL |
| `NEXT_PUBLIC_TWITTER_URL` | Optional | Twitter/X profile URL |

See [.env.example](.env.example) for complete list of 49 customizable variables.

### CDN Configuration (Optional)

This project supports **Cloudflare R2** for image hosting:

**Without CDN** (default):
- Images served from `/public/images/`
- Works out-of-the-box, no setup required

**With CDN** (recommended for production):
- Images served from Cloudflare R2
- Faster load times, reduced server bandwidth
- See [CLAUDE.md - Image Storage](CLAUDE.md#image-storage-cdn-configuration) for setup guide

**Quick Setup:**
1. Create Cloudflare R2 bucket
2. Upload images maintaining `/images/` folder structure
3. Connect custom domain (e.g., `cdn.dleer.ai`)
4. Set `NEXT_PUBLIC_CDN_URL` in environment variables
5. Deploy - images automatically load from CDN!

### Lab (Optional)

`~/lab` adds two live views of a homelab: **telemetry** (servers' power, load, temperatures and
GPUs, with 24 h charts) and a **threat map** (a honeypot's attacks on a 3D globe, a live feed and
24 h statistics; no IP addresses anywhere). The homelab pushes small JSON documents to a private
Cloudflare R2 bucket; the site reads them server-side with a read-only token, validates them and
renders them in the active theme. They appear in the nav tile, the polybar, neofetch, the
mobile home page, and at `/lab` and `/lab/threats`.

It is **off by default**. With the flag off the site is unchanged and the lab routes return 404.

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FEATURE_LAB` | `true` turns the lab on. Inlined at build time: redeploy after changing it |
| `LAB_DEMO_DATA` | `true` serves bundled synthetic documents instead of R2 (local dev, previews, forks); wins over the `R2_*` settings |
| `R2_ACCOUNT_ID`, `R2_LAB_BUCKET`, `R2_LAB_READ_KEY_ID`, `R2_LAB_READ_SECRET` | server-side only: an Object Read only token for the bucket the documents are pushed to |

Try it without any credentials:

```bash
NEXT_PUBLIC_FEATURE_LAB=true LAB_DEMO_DATA=true npm run dev
```

The specification, the data contracts the views consume and the approved designs are in
[docs/lab/](docs/lab/README.md).

### Content Customization

Edit `config/portfolio.config.ts` to customize:
- Personal information and bio
- Project portfolio with metrics
- Skills and technologies
- Blog posts
- ASCII art and system info

See [CLAUDE.md](CLAUDE.md) for detailed architecture documentation.

---

## 🚢 Deployment

### Railway (Recommended)

Auto-deployment with Railpack builder:

1. Visit [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
2. Select `dleer-portfolio` repository
3. **Add environment variables** in **Variables** tab:
   - `RESEND_API_KEY` (required)
   - `RESEND_FROM_EMAIL` (required)
   - `NEXT_PUBLIC_CONTACT_EMAIL` (required)
   - `NEXT_PUBLIC_CDN_URL` (optional - for Cloudflare R2)
   - See `.env.example` for complete list
4. Railway auto-detects Next.js and deploys with Railpack

**Features:**
- Zero-config deployment (no Dockerfile needed)
- Automatic NEXT_PUBLIC_* variable injection
- Fast builds with intelligent caching

### Vercel

```bash
npm i -g vercel
vercel
```

Add environment variables via Vercel dashboard → Settings → Environment Variables.


---

## 🏗️ Tech Stack

**Framework**: Next.js 15.5.4 with App Router and Turbopack
**Language**: TypeScript 5.0 (strict mode)
**Styling**: Tailwind CSS v4 + Modular CSS architecture (12 modules)
**Content**: Content Collections + MDX (blog & projects)
**Animation**: Framer Motion 12.23
**Email**: Resend API 6.1.2 + React Email
**Audio**: HTML5 Audio API + Custom analytics (7 event types)
**CDN**: Cloudflare R2 (image storage & delivery)
**Validation**: Zod 4.1 (schema validation)
**State**: React Context API (Theme, Focus)
**Icons**: React Icons 5.5 + Custom ASCII art
**Fonts**: JetBrains Mono, Geist, Geist Mono

### Key Features

- **Modular CSS**: 12 focused stylesheets organized by concern
- **MDX Content**: Blog and projects powered by Content Collections with syntax highlighting
- **CDN Integration**: Cloudflare R2 for optimized image delivery with fallback to local
- **Responsive**: Desktop (≥1024px) tiled layout, Mobile (<1024px) dual-mode
- **Contact Security**: 5-layer spam protection (honeypot, rate limiting, validation)
- **Theme System**: CSS variables with localStorage persistence

---

## 📁 Project Structure

```
dleer-portfolio/
├── app/                    # Next.js App Router
│   ├── api/contact/       # Contact form API endpoint
│   ├── styles/            # 12 modular CSS files
│   └── globals.css        # CSS module imports
├── components/
│   ├── layout/            # Desktop & mobile layouts
│   ├── tiles/             # Desktop tile components
│   └── ui/                # Reusable UI components
├── config/
│   ├── portfolio.config.ts # Main configuration
│   ├── projects.config.ts  # Project definitions
│   └── types.ts           # TypeScript types
├── content/               # MDX content
│   ├── blog/             # Blog posts (*.mdx)
│   └── projects/         # Project pages (*.mdx)
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── public/                # Static assets
│   ├── audio/blog/       # Blog post audio files (MP3)
│   ├── fonts/            # Custom fonts
│   └── images/           # Local images (CDN fallback)
├── scripts/               # Build and utility scripts
├── docs/                  # Documentation
├── content-collections.ts # Content Collections config
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS config
├── tsconfig.json          # TypeScript config
└── railway.toml           # Railway deployment config
```

---

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Architecture, commands, and development guide
- **[CONTACT_FORM_SPEC.md](docs/CONTACT_FORM_SPEC.md)** - Contact form implementation details
- **[CDN_DEPLOYMENT_SPEC.md](docs/CDN_DEPLOYMENT_SPEC.md)** - Cloudflare R2 CDN setup guide
- **[RAILWAY_MEMORY_OPTIMIZATION.md](docs/RAILWAY_MEMORY_OPTIMIZATION.md)** - Railway RAM audit, tuning, and optional further savings
- **[docs/lab/](docs/lab/README.md)** - `~/lab`: homelab telemetry and the honeypot threat map (optional, behind a flag)

---

## 📄 License

MIT License © 2025 David Leer

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 Acknowledgments

### Design Inspiration

- **[Hyprland](https://hyprland.org/)** - Dynamic tiling Wayland compositor
- **[r/unixporn](https://reddit.com/r/unixporn)** - Linux customization community
- **[Neofetch](https://github.com/dylanaraps/neofetch)** - System information tool
- **[Kyrre Gjerstad's Portfolio](https://www.kyrre.dev/)** ([GitHub](https://github.com/kyrregjerstad/portfolio)) - Mobile layout design

### Color Themes

- **[Tokyo Night](https://github.com/enkia/tokyo-night-vscode-theme)** by enkia
- **[Nord](https://www.nordtheme.com/)** by Arctic Ice Studio
- **[Solarized](https://ethanschoonover.com/solarized/)** by Ethan Schoonover

### Technologies

- Built with [Next.js](https://nextjs.org/) by Vercel
- Content managed with [Content Collections](https://content-collections.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animated with [Framer Motion](https://www.framer.com/motion/)
- Emails powered by [Resend](https://resend.com/)
- CDN hosted on [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)

---

## 📧 Contact

**David Leer**

- **GitHub**: [@dleerdefi](https://github.com/dleerdefi)
- **Twitter**: [@dleer_defi](https://x.com/dleer_defi)

---

<div align="center">

**Built with <3 by [@dleerdefi](https://github.com/dleerdefi)**

[⬆ Back to Top](#david-leers-portfolio)

</div>
