# Hyprland-Inspired Portfolio Template

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

**A modern, terminal-inspired portfolio template featuring a tiled window manager aesthetic reminiscent of Hyprland configurations.**

[Live Demo](#) • [Documentation](docs/) • [Report Bug](https://github.com/dleerdefi/dleer-portfolio/issues)

</div>

---

## ✨ Features

### 🖼️ **Tiled Window Manager UI**
- 4-tile desktop layout with Neofetch info, file navigation, theme customizer, and content viewer
- Workspace-style navigation bar with active workspace indicators
- Terminal-inspired aesthetics with custom ASCII art
- Translucent glass effects with smooth backdrop blur

### 📱 **Dual-Mode Mobile Layout**
- **Standard Mode**: Traditional scrolling layout
- **Parallax Mode**: Immersive scrolling with fixed background that fades as you scroll
- Easily toggle between modes in the theme settings
- Optimized for smooth touch interactions on all devices

### 🎨 **Dynamic Theme System**
- **3 Theme Presets**: Tokyo Night (default), Nord, Solarized Light
- **15 Accent Colors**: Customizable across all interactive elements
- **CSS Variables**: Theme-aware colors throughout the app
- **Smooth Transitions**: 300ms transitions when switching themes
- **Persistent Settings**: Auto-saved to localStorage

### 📧 **Production Contact Form**
- **Resend API Integration**: Professional email delivery
- **Multi-Layer Spam Protection**:
  - Honeypot field (invisible to users)
  - Time-based validation (< 3 sec rejected)
  - Rate limiting (3 requests per 10 min per IP)
  - Server-side validation
- **Zero Third-Party Branding**: Custom domain email support
- **Railway-Compatible**: API-based (no SMTP issues)

### 🏗️ **Modern Architecture**
- **Next.js 15.5.4** with App Router and Turbopack
- **Modular CSS**: 11 focused stylesheets (<200 LOC each)
- **TypeScript Strict Mode** with path aliases (@/*)
- **Framer Motion**: Professional layout animations
- **React Context API**: Theme and focus state management

### 🚀 **Deployment-Ready**
- **Dockerfile**: Multi-stage production build
- **Railway Configuration**: One-click deployment
- **Environment Variables**: Secure credential management
- **WebP Optimized Images**: Fast loading with fallbacks

---

## 🚀 Quick Start

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

#### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/dleerdefi/dleer-portfolio.git
cd dleer-portfolio

# Install dependencies
npm install
```

#### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your information
nano .env.local
```

**Required Environment Variables:**

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | ✅ Yes | API key from [resend.com](https://resend.com) (free tier: 3,000 emails/month) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | ✅ Yes | Email address to receive contact form submissions |
| `NEXT_PUBLIC_NAME` | ⚠️ Recommended | Your full name |
| `NEXT_PUBLIC_GITHUB_URL` | ⚠️ Recommended | GitHub profile URL |

See [.env.example](.env.example) for complete list of customizable variables.

#### 3. Resend API Setup (For Contact Form)

The contact form requires a free Resend account to send emails:

1. Sign up at [resend.com](https://resend.com) (free: 3,000 emails/month)
2. In your Resend dashboard, go to **API Keys**
3. Click **Create API Key** → Select "Sending access" permission
4. Copy the key and paste it into `RESEND_API_KEY` in your `.env.local` file

**Optional**: Verify your custom domain to send emails from `contact@yourdomain.com` instead of the default Resend address.

#### 4. Run Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** to see your portfolio!

### Build & Production

```bash
# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run typecheck

# Linting
npm run lint
```

---

## 📁 Project Structure

```
dleer-portfolio/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts              # Contact form API endpoint
│   ├── styles/                       # Modular CSS architecture
│   │   ├── 01-theme-variables.css    # Theme presets & CSS variables
│   │   ├── 02-theme-effects.css      # Visual effects & transitions
│   │   ├── 03-fonts.css              # JetBrains Mono fonts
│   │   ├── 04-terminal-theme.css     # Terminal color system
│   │   ├── 05-base.css               # CSS reset & base styles
│   │   ├── 06-typography.css         # Text styles
│   │   ├── 07-terminal-ui.css        # Terminal UI components
│   │   ├── 08-animations.css         # Keyframes & animations
│   │   ├── 09-utilities.css          # Utility classes
│   │   ├── 10-mobile.css             # Mobile optimizations
│   │   └── 11-glass-effects.css      # Glass morphism
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Main portfolio page
│   └── globals.css                   # Imports all CSS modules
│
├── components/
│   ├── layout/
│   │   ├── LayoutManager.tsx         # Desktop 4-tile layout
│   │   ├── MobileParallaxLayout.tsx  # Mobile parallax mode
│   │   ├── Polybar.tsx               # Top navigation bar
│   │   ├── Background.tsx            # Animated gradient background
│   │   └── parallax/
│   │       ├── sections/             # Mobile parallax sections
│   │       │   ├── ParallaxAboutSection.tsx
│   │       │   ├── ParallaxContactSection.tsx
│   │       │   └── ...
│   │       └── hooks/                # Parallax scroll hooks
│   │
│   ├── tiles/
│   │   ├── ContentViewer.tsx         # Main content display (desktop)
│   │   ├── NavigationTile.tsx        # File tree navigation
│   │   ├── NeofetchTile.tsx          # System info display
│   │   ├── ThemeTile.tsx             # Theme customizer
│   │   ├── AccentColorTile.tsx       # Accent color picker
│   │   ├── BackgroundTile.tsx        # Background selector
│   │   └── about/
│   │       └── AboutTechGrid.tsx     # Technology icon grid
│   │
│   └── ui/                           # Reusable UI components
│       ├── Badge.tsx
│       ├── Card.tsx
│       ├── ProjectCard.tsx
│       ├── ScrollProgress.tsx        # Scroll indicator (parallax)
│       └── TechIcon.tsx
│
├── config/
│   ├── portfolio.config.ts           # Main configuration file
│   └── types.ts                      # TypeScript type definitions
│
├── contexts/
│   ├── ThemeContext.tsx              # Theme state management
│   └── FocusContext.tsx              # Navigation & focus state
│
├── docs/
│   └── CONTACT_FORM_SPEC.md          # Contact form documentation
│
├── hooks/
│   ├── useResponsive.ts              # Responsive breakpoint hook
│   └── useFocus.ts                   # Focus management hook
│
├── lib/
│   ├── config.ts                     # Config helper functions
│   └── themes.ts                     # Theme utilities
│
├── public/
│   ├── fonts/                        # JetBrains Mono font files
│   └── images/                       # Background images (webp)
│       ├── cat_anime-girl.webp
│       ├── cool_rocks.webp
│       ├── gradient-pb.webp
│       ├── purple-girl.webp
│       └── ... (9 total backgrounds)
│
├── scripts/
│   ├── cleanup-dev.sh                # Clean dev server processes
│   └── convert-to-webp.js            # Image optimization script
│
├── Dockerfile                        # Multi-stage production build
├── railway.toml                      # Railway deployment config
├── .env.example                      # Environment variable template
├── CLAUDE.md                         # AI assistant guidance
└── README.md                         # This file
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local` from template:

```bash
cp .env.example .env.local
```

**Complete Variable Reference:**

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| **Contact Form** |
| `RESEND_API_KEY` | Server | - | Resend API key (get from resend.com) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Client | `email@email.com` | Email recipient for contact form |
| **Personal Information** |
| `NEXT_PUBLIC_NAME` | Client | "David Leer" | Your full name |
| `NEXT_PUBLIC_USERNAME` | Client | "dleer" | Your username/handle |
| `NEXT_PUBLIC_TITLE` | Client | "Founder & Software Engineer" | Your professional title |
| `NEXT_PUBLIC_EMAIL` | Client | - | Display email address |
| **Social Media** |
| `NEXT_PUBLIC_GITHUB_URL` | Client | - | GitHub profile URL |
| `NEXT_PUBLIC_LINKEDIN_URL` | Client | - | LinkedIn profile URL |
| `NEXT_PUBLIC_TWITTER_URL` | Client | - | Twitter/X profile URL |
| **SEO** |
| `NEXT_PUBLIC_SEO_TITLE` | Client | "Your Portfolio" | Page title for SEO |
| `NEXT_PUBLIC_SEO_DESCRIPTION` | Client | - | Meta description |

See [.env.example](.env.example) for **all 30+ configurable variables**.

### Portfolio Content

Edit `config/portfolio.config.ts` to customize:

```typescript
export const portfolioConfig: PortfolioConfig = {
  personal: {
    name: "Your Name",
    title: "Your Title",
    bio: { /* ... */ }
  },

  projects: [
    {
      id: "project-one",
      name: "Project Name",
      description: "Short description",
      techStack: ["React", "TypeScript", "Next.js"],
      github: "https://github.com/you/project",
      demo: "https://project.demo"
    }
  ],

  skills: [
    {
      category: "Frontend",
      skills: ["React", "Next.js", "TypeScript"]
    }
  ],

  // ... more configuration
};
```

---

## 🎨 Customization

### Level 1: Basic (No Code Changes)

**Update `.env.local` with your information:**

```bash
NEXT_PUBLIC_NAME="Your Name"
NEXT_PUBLIC_GITHUB_URL="https://github.com/yourusername"
NEXT_PUBLIC_CONTACT_EMAIL="you@example.com"
```

Restart dev server to see changes.

### Level 2: Content (Config File)

**Edit `config/portfolio.config.ts`:**

- Update `projects` array with your projects
- Modify `blog` posts
- Customize `skills` and `technologies`
- Change ASCII art in `ascii` array

### Level 3: Styling (CSS Modules)

**Modify theme colors** in `app/styles/01-theme-variables.css`:

```css
.theme-tokyo-night {
  --theme-bg: #1a1b26;        /* Your custom background */
  --theme-primary: #7aa2f7;   /* Your custom primary color */
  /* ... */
}
```

**Add custom animations** in `app/styles/08-animations.css`:

```css
@keyframes yourAnimation {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Adjust mobile layout** in `app/styles/10-mobile.css`:

```css
@media (max-width: 1024px) {
  /* Your mobile-specific styles */
}
```

---

## 🏗️ Architecture Highlights

### Tech Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Build Tool**: Turbopack (faster than Webpack)
- **Language**: TypeScript 5.0 (strict mode)
- **Styling**: Tailwind CSS v4 with modular architecture
- **Animations**: Framer Motion (FLIP technique)
- **Icons**: React Icons + Custom ASCII art
- **Fonts**: JetBrains Mono, Geist, Geist Mono
- **Email**: Resend API v6.1.2
- **State**: React Context API (Theme, Focus)
- **Deployment**: Docker + Railway

### Key Design Patterns

**1. Modular CSS Architecture**
- 11 focused CSS modules (<200 LOC each)
- Organized by concern (theme, typography, animations, etc.)
- Improves maintainability and git diff clarity

**2. Context-Based State Management**
- `ThemeContext`: Theme preset, accent color, background settings
- `FocusContext`: Active tile, navigation state, scroll management

**3. Responsive Design**
- Desktop (≥1024px): 4-tile layout with full keyboard navigation
- Mobile (<1024px): Dual-mode (Standard or Parallax scrolling)
- Adaptive components for optimal viewing on any device

**4. Contact Form Security**
- **Layer 1**: Honeypot field (invisible to users, bots fill it)
- **Layer 2**: Time-based validation (reject < 3 sec submissions)
- **Layer 3**: Rate limiting (3 requests per 10 min per IP)
- **Layer 4**: Server-side validation (email format, length)
- **Layer 5**: Resend API (professional email delivery)

---

## 📱 Responsive Design

### Desktop Layout (≥1024px)

```
┌─────────────────────────────────────┐
│         Polybar Navigation          │  36px height
├──────────────┬──────────────────────┤
│              │                      │
│  Neofetch    │                      │
│  Tile        │     Content          │  50% height
│              │     Viewer           │
├──────────────┤                      │
│ Navigation   │                      │
│ Tile    Theme│                      │  50% height
│         Tile │                      │
└──────────────┴──────────────────────┘
   50% width        50% width
```

**Features:**
- Full-height viewport (content fills screen, no scrolling needed)
- Navigate between tiles using Tab key
- Highlighted borders show which tile is active
- Consistent spacing throughout the interface

### Mobile Layout (<1024px)

**Standard Mode** (Default):
```
┌─────────────────────┐
│  Polybar (mobile)   │
├─────────────────────┤
│   Neofetch Tile     │
├─────────────────────┤
│  Navigation Tile    │
├─────────────────────┤
│   Content Tile      │
├─────────────────────┤
│    Theme Tile       │
└─────────────────────┘
```

**Parallax Mode**:
- Fixed Neofetch background that fades as you scroll
- Content sections slide over the background
- Smooth visual effects at screen edges
- Progress indicator tracks your scroll position

**Toggle between modes** in Theme Tile → Mobile Mode setting.

---

## 🚢 Deployment

### Railway (Recommended)

Railway provides one-click deployment with automatic environment variable detection.

#### Step 1: Connect Repository

1. Visit [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub repo**
3. Authorize Railway and select `dleer-portfolio` repository

#### Step 2: Configure Environment Variables

Railway dashboard → Your Service → **Variables** tab:

```bash
# Add these variables:
RESEND_API_KEY=re_your_actual_api_key_here
NEXT_PUBLIC_CONTACT_EMAIL=your@email.com
NEXT_PUBLIC_NAME=Your Name
# ... add other NEXT_PUBLIC_ variables
```

**Tip**: Enable "Sealed" for `RESEND_API_KEY` (extra security - hides value in UI)

#### Step 3: Deploy

Railway auto-detects:
- ✅ Dockerfile (multi-stage build)
- ✅ railway.toml (configuration)
- ✅ Start command: `node server.js`

Click **Deploy** → Railway builds and launches your portfolio!

**Custom Domain:** Railway Settings → Domains → Add custom domain

---

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables via dashboard
```

**Important**: Add all `NEXT_PUBLIC_*` and `RESEND_API_KEY` variables in Vercel dashboard → Settings → Environment Variables.

---

### Docker (Self-Hosted)

```bash
# Build image
docker build -t portfolio .

# Run container
docker run -p 3000:3000 \
  -e RESEND_API_KEY=your_key \
  -e NEXT_PUBLIC_CONTACT_EMAIL=your@email.com \
  portfolio
```

See [Dockerfile](Dockerfile) for multi-stage build configuration.

---

## 📚 Documentation

### Specifications

- **[Contact Form Specification](docs/CONTACT_FORM_SPEC.md)** - Complete implementation guide for contact form with Resend API, spam protection, and Railway deployment
- **[CLAUDE.md](CLAUDE.md)** - Project architecture and development guidance for AI assistants

### Component Reference

Key components and their responsibilities:

| Component | Location | Purpose |
|-----------|----------|---------|
| `LayoutManager` | `components/layout/` | Desktop 4-tile layout orchestrator |
| `MobileParallaxLayout` | `components/layout/` | Mobile parallax scrolling mode |
| `Polybar` | `components/layout/` | Top navigation bar (workspace-style) |
| `ContentViewer` | `components/tiles/` | Main content display (desktop) |
| `NavigationTile` | `components/tiles/` | File tree navigation |
| `NeofetchTile` | `components/tiles/` | System info display with ASCII art |
| `ThemeTile` | `components/tiles/` | Theme preset & accent color picker |

### CSS Modules

Each CSS module is under 200 lines for maintainability:

| Module | Lines | Purpose |
|--------|-------|---------|
| `01-theme-variables.css` | 182 | Theme presets (Tokyo Night, Nord, Solarized) |
| `02-theme-effects.css` | 49 | Visual effects & transitions |
| `03-fonts.css` | 29 | JetBrains Mono @font-face |
| `04-terminal-theme.css` | 103 | Terminal color system |
| `05-base.css` | 70 | CSS reset & base styles |
| `06-typography.css` | 72 | Text styling |
| `07-terminal-ui.css` | 75 | Terminal UI components |
| `08-animations.css` | 72 | Keyframes & animations |
| `09-utilities.css` | 102 | Utility classes |
| `10-mobile.css` | 133 | Mobile optimizations |
| `11-glass-effects.css` | 71 | Glass morphism |

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Development Workflow

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/yourusername/dleer-portfolio.git

# 3. Create feature branch
git checkout -b feature/your-feature-name

# 4. Make changes and test
npm run dev
npm run typecheck
npm run lint

# 5. Commit with clear message
git commit -m "Add: your feature description"

# 6. Push to your fork
git push origin feature/your-feature-name

# 7. Create Pull Request
```

### Code Style

- **TypeScript**: Use strict mode, define types for all props
- **CSS**: Keep modules under 200 LOC, use CSS variables for theming
- **Components**: Prefer functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions/variables

### Testing Checklist

Before submitting PR:

- [ ] Code compiles without TypeScript errors (`npm run typecheck`)
- [ ] No linting errors (`npm run lint`)
- [ ] Tested on desktop (≥1024px) and mobile (<1024px)
- [ ] Both Standard and Parallax modes work (mobile)
- [ ] All three themes render correctly
- [ ] Contact form submits successfully (if modified)

---

## 📄 License

MIT License - feel free to use this template for personal or commercial projects.

```
Copyright (c) 2025 David Leer

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
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### Design Inspiration

- **[Hyprland](https://hyprland.org/)** - Dynamic tiling Wayland compositor
- **[r/unixporn](https://reddit.com/r/unixporn)** - Linux customization community
- **[Neofetch](https://github.com/dylanaraps/neofetch)** - System information tool

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

[⬆ Back to Top](#hyprland-inspired-portfolio-template)

</div>
