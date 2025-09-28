# Tile Portfolio Template

A Hyprland/Arch Linux rice-inspired portfolio template featuring a tiled window manager aesthetic with Tokyo Night color scheme.

## 🖥️ Overview

A customizable portfolio template with a minimalist, terminal-inspired design. Built with a distinctive tiled window manager interface reminiscent of Hyprland configurations. Perfect for developers who appreciate the Linux rice aesthetic.

## 🎨 Design Features

### Tiled Layout System
- **Fixed 4-tile layout**: Neofetch system info, file navigation tree, content viewer, and theme customization
- **Polybar navigation**: Workspace-style navigation bar with active indicators
- **Glass morphism effects**: Translucent tiles with backdrop blur
- **Dynamic theme system**: Three themes with 15 customizable accent colors
- **Smooth animations**: Framer Motion-powered layout transitions
- **Responsive design**: Desktop tiled (≥1024px) and mobile stacked (<1024px) layouts

### Current Implementation
- ✅ Fixed 4-tile desktop layout with proper spacing
- ✅ Polybar with workspace navigation
- ✅ Neofetch-style system information tile with dynamic ASCII art
- ✅ File tree navigation with expandable directories
- ✅ Content viewer with project and blog support
- ✅ Animated gradient background with glass morphism
- ✅ Mobile-responsive stacked layout with auto-scroll
- ✅ Framer Motion layout animations (FLIP technique)
- ✅ Tab navigation with focus management
- ✅ Uniform 12px spacing throughout
- ✅ Dynamic theme system (Tokyo Night, Nord, Solarized Light)
- ✅ Customizable accent colors (15 color options)
- ✅ Focus context system for keyboard navigation
- ✅ Theme-aware text colors using CSS variables
- ✅ Responsive color picker with optimized touch targets
- ✅ Full accent color system affecting all interactive elements
- ✅ Dynamic headers that change with accent color selection
- ✅ Fixed hydration errors for seamless SSR
- ✅ Single-click navigation with smooth auto-scroll
- ✅ Event propagation fixes for better UX

## 🛠️ Tech Stack

```bash
├── Framework:     Next.js 15.5.4 (App Router + Turbopack)
├── Language:      TypeScript
├── Styling:       Tailwind CSS v4 (@tailwindcss/postcss)
├── Animations:    Framer Motion (layout transitions)
├── UI:            Custom tiled window manager components
├── Theme:         Tokyo Night, Nord, Solarized Light
├── Fonts:         JetBrains Mono, Geist, Geist Mono
└── Icons:         Custom ASCII art
```

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page with tiled layout
│   └── globals.css                   # Global styles and theme variables
├── components/
│   └── RicedLayout/                  # Tiled window manager components
│       ├── LayoutManagerWithFocus.tsx    # Main layout with focus management
│       ├── PolybarWithFocus.tsx         # Navigation bar with focus
│       ├── NeofetchTile.tsx             # System info display
│       ├── NavigationTileWithFocus.tsx  # File tree navigation with focus
│       ├── ContentViewerWithFocus.tsx   # Content display with focus
│       ├── ThemeTile.tsx                # Theme and accent color picker
│       ├── Background.tsx               # Animated gradient background
│       └── archAscii.tsx                # ASCII art collections
├── contexts/
│   ├── ThemeContext.tsx             # Theme state management
│   └── FocusContext.tsx             # Focus and navigation state
└── lib/
    └── config.ts                     # Portfolio configuration
```

## 🎨 Color Scheme (Dynamic Theme System)

### Theme Presets

#### Tokyo Night (Default Dark)
```css
--theme-bg:        #1a1b26    /* Base background */
--theme-surface:   #16161e    /* Tile backgrounds */
--theme-text:      #c0caf5    /* Body text */
--theme-primary:   #7aa2f7    /* Headers (uses accent color) */
--theme-success:   #9ece6a    /* Success states */
--theme-info:      #7dcfff    /* Info highlights */
--theme-warning:   #e0af68    /* Warning states */
--theme-error:     #f7768e    /* Error states */
--accent-color:    [user selectable] /* Default: #bb9af7 (purple) */
```

#### Nord (Arctic Dark)
```css
--theme-bg:        #2E3440    /* Base background (Polar Night) */
--theme-surface:   #3B4252    /* Tile backgrounds */
--theme-text:      #D8DEE9    /* Body text (Snow Storm) */
--theme-primary:   #88C0D0    /* Headers (uses accent color) */
--theme-success:   #A3BE8C    /* Success states (Aurora Green) */
--theme-info:      #5E81AC    /* Info highlights (Frost) */
--theme-warning:   #EBCB8B    /* Warning states (Aurora Yellow) */
--theme-error:     #BF616A    /* Error states (Aurora Red) */
--accent-color:    [user selectable] /* Default: #81A1C1 (blue) */
```

#### Solarized Light
```css
--theme-bg:        #fdf6e3    /* Base background */
--theme-surface:   #eee8d5    /* Tile backgrounds */
--theme-text:      #657b83    /* Body text */
--theme-primary:   #268bd2    /* Headers (uses accent color) */
--theme-success:   #859900    /* Success states (green) */
--theme-info:      #2aa198    /* Info highlights (cyan) */
--theme-warning:   #b58900    /* Warning states (yellow) */
--theme-error:     #dc322f    /* Error states (red) */
--accent-color:    [user selectable] /* Default: #d33682 (magenta) */
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
- **Desktop (≥1024px)**: Full 4-tile layout with polybar
  - Fixed viewport height with no scrolling
  - 50/50 column split with subdivisions
  - Left: Neofetch (top), Navigation + Theme (bottom)
  - Right: Content viewer (full height)
  - Keyboard navigation with Tab key

- **Mobile/Tablet (<1024px)**: Stacked layout
  - Natural scrolling with content-based heights
  - Full-width tiles in vertical stack
  - Single-click navigation with smooth auto-scroll
  - Touch-optimized interactions
  - Fixed event propagation for reliable clicks

### Animation Features
- **Framer Motion Layout Animations**: Smooth transitions between desktop/mobile
- **Spring Physics**: Natural motion with configurable stiffness/damping
- **Auto-scroll**: Smart scrolling to active tiles (180ms delay)
- **Focus Management**: Visual feedback with animated borders

## ✨ Recent Improvements

### Theming System
- **Dynamic Accent Colors**: All interactive elements (buttons, links, borders) use the selected accent color
- **Header Color Integration**: Main section headers now use accent colors for better personalization
- **Theme Persistence**: Settings saved to localStorage for consistent experience
- **Smooth Transitions**: 300ms CSS transitions when switching themes/colors

### Mobile Experience
- **Fixed Auto-Scroll**: Single-click navigation now works reliably
- **Event Propagation Fixes**: No more double-click requirements
- **Improved Touch Targets**: Minimum 24px touch targets, 32px on mobile
- **Hydration Error Fixes**: Server-side rendering now works seamlessly

### Performance & UX
- **Optimized Scroll Behavior**: Using setTimeout instead of nested requestAnimationFrame
- **Better Event Handling**: Proper stopPropagation throughout navigation
- **Focus Management**: Visual feedback with accent color borders
- **Accessibility**: Keyboard navigation with proper focus states

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