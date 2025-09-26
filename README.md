# David Leer Portfolio

A Hyprland/Arch Linux rice-inspired portfolio website featuring a tiled window manager aesthetic with Tokyo Night color scheme.

## 🖥️ Overview

This portfolio showcases expertise in decentralized finance, token economics, and AI applications with a minimalist, terminal-inspired design. Built with a distinctive tiled window manager interface reminiscent of Hyprland configurations.

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

## 🛠️ Tech Stack

```bash
├── Framework:     Next.js 15.5.4 (App Router + Turbopack)
├── Language:      TypeScript
├── Styling:       Tailwind CSS v4 (@tailwindcss/postcss)
├── Animations:    Framer Motion (layout transitions)
├── UI:            Custom tiled window manager components
├── Theme:         Tokyo Night + Catppuccin Latte hybrid
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
│       ├── Background.tsx      # Animated gradient background
│       └── archAscii.tsx       # ASCII art collections
└── content/                # Blog posts and project data (planned)
```

## 🎨 Color Scheme (Tokyo Night + Catppuccin)

```css
/* Tokyo Night Deep Tones */
--tokyo-bg:        #1a1b26    /* Base background */
--tokyo-surface:   #24283b    /* Tile backgrounds */
--tokyo-border:    #414868    /* Default borders */

/* Tokyo Night Vibrant Accents */
--tokyo-blue:      #7aa2f7    /* Primary accent */
--tokyo-cyan:      #7dcfff    /* Cyan highlights */
--tokyo-green:     #9ece6a    /* Success states */
--tokyo-magenta:   #bb9af7    /* Purple accents */
--tokyo-yellow:    #e0af68    /* Warning/special */

/* Text Hierarchy */
--text-bright:     #c0caf5    /* Headers */
--text-primary:    #a9b1d6    /* Body text */
--text-dim:        #565f89    /* Muted text */

/* Glass Morphism */
--tile-bg-solid:   rgba(30, 30, 46, 1)      /* Opaque tiles */
--tile-bg-glass:   rgba(30, 30, 46, 0.6)    /* Translucent tiles */
--tile-bg-semi:    rgba(30, 30, 46, 0.8)    /* Semi-transparent */
```

## 🚀 Getting Started

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation
```bash
# Clone the repository
git clone https://github.com/dleer/dleer-portfolio.git

# Navigate to project
cd dleer-portfolio

# Install dependencies
npm install

# Run development server with Turbopack
npm run dev
```

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

- GitHub: [@dleer](https://github.com/dleer)
- Portfolio: [In Development]

---

```bash
$ echo "Built with ❤️ and lots of rice"
```