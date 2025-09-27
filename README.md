# Tile Portfolio Template

A Hyprland/Arch Linux rice-inspired portfolio template featuring a tiled window manager aesthetic with Tokyo Night color scheme.

## 🖥️ Overview

A customizable portfolio template with a minimalist, terminal-inspired design. Built with a distinctive tiled window manager interface reminiscent of Hyprland configurations. Perfect for developers who appreciate the Linux rice aesthetic.

## 🎨 Design Features

### Tiled Layout System
- **Fixed 3-tile layout**: Neofetch system info, file navigation tree, and content viewer
- **Polybar navigation**: Workspace-style navigation bar with active indicators
- **Glass morphism effects**: Translucent tiles with backdrop blur
- **Tokyo Night theme**: Dark color palette with vibrant accents
- **Smooth animations**: Framer Motion-powered layout transitions
- **Responsive design**: Desktop tiled (≥1024px) and mobile stacked (<1024px) layouts

### Current Implementation
- ✅ Fixed 3-tile desktop layout with proper spacing
- ✅ Polybar with workspace navigation
- ✅ Neofetch-style system information tile with dynamic ASCII art
- ✅ File tree navigation with expandable directories
- ✅ Content viewer with project and blog support
- ✅ Animated gradient background with glass morphism
- ✅ Mobile-responsive stacked layout with auto-scroll
- ✅ Framer Motion layout animations (FLIP technique)
- ✅ Tab navigation with focus management
- ✅ Uniform 12px spacing throughout
- ✅ Dynamic theme system (Tokyo Night, Catppuccin Mocha, Catppuccin Latte)
- ✅ Customizable accent colors (15 color options)
- ✅ Focus context system for keyboard navigation
- ✅ Theme-aware text colors using CSS variables
- ✅ Responsive color picker with optimized touch targets

## 🛠️ Tech Stack

```bash
├── Framework:     Next.js 15.5.4 (App Router + Turbopack)
├── Language:      TypeScript
├── Styling:       Tailwind CSS v4 (@tailwindcss/postcss)
├── Animations:    Framer Motion (layout transitions)
├── UI:            Custom tiled window manager components
├── Theme:         Tokyo Night, Catppuccin Mocha, Catppuccin Latte
├── Fonts:         JetBrains Mono, Geist, Geist Mono
└── Icons:         Custom ASCII art
```

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page with tiled layout
├── components/
│   └── RicedLayout/        # Tiled window manager components
│       ├── LayoutManager.tsx    # Main layout orchestrator
│       ├── Polybar.tsx         # Navigation bar
│       ├── NeofetchTile.tsx    # System info display
│       ├── NavigationTile.tsx  # File tree navigation
│       ├── ContentViewer.tsx   # Content display panel
│       ├── ThemeTile.tsx       # Theme customization tile
│       ├── Background.tsx      # Animated gradient background
│       └── archAscii.tsx       # ASCII art collections
└── content/                # Blog posts and project data (planned)
```

## 🎨 Color Scheme (Dynamic Theme System)

### Theme Presets

#### Tokyo Night (Default)
```css
--theme-bg:        #1a1b26    /* Base background */
--theme-surface:   #24283b    /* Tile backgrounds */
--theme-primary:   #7aa2f7    /* Primary accent */
--theme-text:      #a9b1d6    /* Body text */
--theme-success:   #9ece6a    /* Success states */
--theme-info:      #7dcfff    /* Info highlights */
--theme-warning:   #e0af68    /* Warning states */
--theme-error:     #f7768e    /* Error states */
```

#### Catppuccin Mocha
```css
--theme-bg:        #1e1e2e    /* Base background */
--theme-surface:   #313244    /* Tile backgrounds */
--theme-primary:   #89b4fa    /* Primary accent */
--theme-text:      #cdd6f4    /* Body text */
--theme-success:   #a6e3a1    /* Success states */
--theme-info:      #89dceb    /* Info highlights */
--theme-warning:   #f9e2af    /* Warning states */
--theme-error:     #f38ba8    /* Error states */
```

#### Catppuccin Latte
```css
--theme-bg:        #eff1f5    /* Base background */
--theme-surface:   #e6e9ef    /* Tile backgrounds */
--theme-primary:   #1e66f5    /* Primary accent */
--theme-text:      #4c4f69    /* Body text */
--theme-success:   #40a02b    /* Success states */
--theme-info:      #04a5e5    /* Info highlights */
--theme-warning:   #df8e1d    /* Warning states */
--theme-error:     #d20f39    /* Error states */
```

### Accent Colors
15 customizable accent colors available:
- Rose, Pink, Fuchsia, Purple, Violet
- Indigo, Blue, Sky, Cyan, Teal
- Emerald, Green, Lime, Amber, Orange

## 🚀 Getting Started

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Quick Start

#### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/tile-portfolio.git

# Navigate to project
cd tile-portfolio

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

#### 2. Configure Your Portfolio
```bash
# Edit .env.local with your information
nano .env.local

# Or edit the main configuration file
nano config/portfolio.config.ts
```

#### 3. Run Development Server
```bash
# Start with Turbopack
npm run dev
```

Visit `http://localhost:3000` to see your portfolio!

### Build & Production
```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📱 Responsive Design

### Breakpoints
- **Desktop (≥1024px)**: Full 3-tile layout with polybar
  - Fixed viewport height with no scrolling
  - 50/50 column split (left column subdivided)
  - Keyboard navigation with Tab key

- **Mobile/Tablet (<1024px)**: Stacked layout
  - Natural scrolling with content-based heights
  - Full-width tiles in vertical stack
  - Auto-scroll to focused tile (Tab navigation)
  - Touch-optimized interactions

### Animation Features
- **Framer Motion Layout Animations**: Smooth transitions between desktop/mobile
- **Spring Physics**: Natural motion with configurable stiffness/damping
- **Auto-scroll**: Smart scrolling to active tiles (180ms delay)
- **Focus Management**: Visual feedback with animated borders

## 🔧 Development Notes

### Build Configuration
- Using Turbopack for faster builds and hot reload
- Tailwind CSS v4 with PostCSS configuration
- TypeScript strict mode enabled
- Path aliases configured (@/* for root imports)

### Key Technologies
- **Framer Motion**: Professional layout animations using FLIP technique
- **React Hooks**: Custom hooks for responsive design and focus management
- **CSS Variables**: Dynamic theming with CSS custom properties
- **Backdrop Filter**: Glass morphism effects with fallbacks

### Performance Optimizations
- GPU-accelerated animations (transform/opacity only)
- Lazy loading for content components
- Optimized re-renders with React.memo where appropriate
- Debounced resize handlers

## 📈 Performance

### Metrics
- **Build Time**: <2s with Turbopack
- **Animation FPS**: 60fps target with Framer Motion
- **First Contentful Paint**: <1s
- **Time to Interactive**: <2s

### Optimizations
- Fast refresh with Turbopack
- Hardware-accelerated animations (GPU)
- Optimized backdrop-blur with will-change hints
- Efficient tile rendering with React
- Spring-based animations for natural motion
- Debounced resize observers

## 🚢 Deployment

Ready for deployment on Vercel, Netlify, or any Node.js hosting platform that supports Next.js 15.

```bash
# Build for deployment
npm run build

# Output will be in .next directory
```

## 📄 License

MIT License - feel free to use this project as inspiration for your own tiled portfolio.

## 🤝 Contact

- GitHub: [@dleerdefi](https://github.com/dleerdefi)
- Portfolio: [In Development]

---

```bash
$ echo "Built with ❤️ and lots of rice"
```