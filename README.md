# David Leer Portfolio

A Hyprland/Arch Linux rice-inspired portfolio website featuring a tiled window manager aesthetic with Tokyo Night color scheme.

## 🖥️ Overview

This portfolio showcases expertise in decentralized finance, token economics, and AI applications with a minimalist, terminal-inspired design. Built with a distinctive tiled window manager interface reminiscent of Hyprland configurations.

## 🎨 Design Features

### Tiled Layout System
- **Fixed 3-tile layout**: Neofetch system info, file navigation tree, and content viewer
- **Polybar navigation**: Workspace-style navigation bar with active indicators
- **Glass morphism effects**: Translucent tiles with backdrop blur
- **Tokyo Night theme**: Dark color palette with blue accents
- **Responsive design**: Adaptive layouts for mobile, tablet, and desktop

### Current Implementation
- ✅ Fixed 3-tile desktop layout with proper spacing
- ✅ Polybar with workspace navigation
- ✅ Neofetch-style system information tile
- ✅ File tree navigation with expandable directories
- ✅ Content viewer with project and blog support
- ✅ Animated gradient background
- ✅ Mobile-responsive tabbed layout
- ✅ Uniform 12px spacing throughout

## 🛠️ Tech Stack

```bash
├── Framework:     Next.js 15.5.4 (App Router + Turbopack)
├── Language:      TypeScript
├── Styling:       Tailwind CSS v4 (@tailwindcss/postcss)
├── UI:            Custom tiled window manager components
├── Theme:         Tokyo Night color scheme
└── Font:          Geist Mono
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
│       └── Background.tsx      # Animated gradient background
└── content/                # Blog posts and project data (planned)
```

## 🎨 Color Scheme (Tokyo Night)

```css
--bg-primary:    #24283b    /* Tile backgrounds */
--bg-secondary:  #1a1b26    /* Dark backgrounds */
--border:        #414868    /* Default borders */
--border-active: #7aa2f7    /* Active/focused borders */
--text-primary:  #a9b1d6    /* Main text */
--text-accent:   #7aa2f7    /* Blue accents */
--text-dim:      #565f89    /* Dimmed text */
--success:       #9ece6a    /* Green indicators */
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

- **Desktop (≥768px)**: Full 3-tile layout with polybar
- **Mobile (<768px)**: Tabbed interface with hamburger menu

## 🔧 Development Notes

- Using Turbopack for faster builds and hot reload
- Tailwind CSS v4 with PostCSS configuration
- TypeScript strict mode enabled
- Path aliases configured (@/* for root imports)

## 📈 Performance

- Fast refresh with Turbopack
- Optimized backdrop-blur effects
- Efficient tile rendering with React
- Smooth animations and transitions

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