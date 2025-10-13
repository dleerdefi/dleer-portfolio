# Hyprland-Inspired Portfolio

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

**Terminal-inspired portfolio with tiled window manager aesthetics and modern UX.**

[Live Demo](#) • [Report Issue](https://github.com/dleerdefi/dleer-portfolio/issues)

</div>

---

## ✨ Features

- **Desktop**: 4-tile Hyprland-style layout with keyboard navigation and workspace indicators
- **Mobile**: Dual-mode support (Standard scrolling or Parallax depth effects)
- **Themes**: 3 presets (Tokyo Night, Nord, Solarized) + 15 accent colors
- **Contact**: Production-ready form with Resend API and multi-layer spam protection
- **Architecture**: Next.js 15.5, TypeScript strict mode, modular CSS (11 focused modules)
- **Deployment**: Docker, Railway, and Vercel ready with environment-based configuration

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
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local` from template and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | ✅ Yes | Resend API key for contact form ([resend.com](https://resend.com) - free tier: 3K emails/month) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | ✅ Yes | Email address to receive form submissions |
| `NEXT_PUBLIC_NAME` | Recommended | Your full name |
| `NEXT_PUBLIC_TITLE` | Recommended | Your professional title |
| `NEXT_PUBLIC_GITHUB_URL` | Recommended | GitHub profile URL |
| `NEXT_PUBLIC_LINKEDIN_URL` | Optional | LinkedIn profile URL |
| `NEXT_PUBLIC_TWITTER_URL` | Optional | Twitter/X profile URL |

See [.env.example](.env.example) for complete list of 30+ customizable variables.

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

One-click deployment with automatic Dockerfile detection:

1. Visit [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
2. Select `dleer-portfolio` repository
3. Add environment variables in **Variables** tab
4. Railway auto-detects and deploys

[Detailed Railway Guide](docs/DEPLOYMENT.md#railway)

### Vercel

```bash
npm i -g vercel
vercel
```

Add environment variables via Vercel dashboard → Settings → Environment Variables.

[Detailed Vercel Guide](docs/DEPLOYMENT.md#vercel)

### Docker (Self-Hosted)

```bash
docker build -t portfolio .
docker run -p 3000:3000 \
  -e RESEND_API_KEY=your_key \
  -e NEXT_PUBLIC_CONTACT_EMAIL=your@email.com \
  portfolio
```

[Detailed Docker Guide](docs/DEPLOYMENT.md#docker)

---

## 🏗️ Tech Stack

**Framework**: Next.js 15.5.4 with App Router and Turbopack
**Language**: TypeScript 5.0 (strict mode)
**Styling**: Tailwind CSS v4 + Modular CSS architecture (11 modules)
**Animation**: Framer Motion
**Email**: Resend API v6.1.2
**State**: React Context API (Theme, Focus)
**Icons**: React Icons + Custom ASCII art
**Fonts**: JetBrains Mono, Geist, Geist Mono

### Key Features

- **Modular CSS**: 11 focused stylesheets organized by concern
- **Responsive**: Desktop (≥1024px) tiled layout, Mobile (<1024px) dual-mode
- **Contact Security**: 5-layer spam protection (honeypot, rate limiting, validation)
- **Theme System**: CSS variables with localStorage persistence
- **Type Safety**: Strict TypeScript throughout with path aliases

---

## 📁 Project Structure

```
dleer-portfolio/
├── app/                    # Next.js App Router
│   ├── api/contact/       # Contact form API endpoint
│   ├── styles/            # 11 modular CSS files
│   └── globals.css        # CSS module imports
├── components/
│   ├── layout/            # Desktop & mobile layouts
│   ├── tiles/             # Desktop tile components
│   └── ui/                # Reusable UI components
├── config/
│   ├── portfolio.config.ts # Main configuration
│   ├── projects.config.ts  # Project definitions
│   └── types.ts           # TypeScript types
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── docs/                  # Documentation
├── Dockerfile             # Multi-stage production build
└── railway.toml           # Railway deployment config
```

---

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Architecture, commands, and development guide
- **[CONTACT_FORM_SPEC.md](docs/CONTACT_FORM_SPEC.md)** - Contact form implementation details
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Comprehensive deployment guides

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
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animated with [Framer Motion](https://www.framer.com/motion/)
- Emails powered by [Resend](https://resend.com/)

---

## 📧 Contact

**David Leer**

- **GitHub**: [@dleerdefi](https://github.com/dleerdefi)
- **LinkedIn**: [dleer](https://linkedin.com/in/dleer)
- **Twitter**: [@dleer_defi](https://x.com/dleer_defi)
- **Email**: Contact via form on live site

---

<div align="center">

**Built with ❤️ and lots of [rice](https://www.reddit.com/r/unixporn/wiki/themeing/dictionary#wiki_rice)**

[⬆ Back to Top](#hyprland-inspired-portfolio)

</div>
