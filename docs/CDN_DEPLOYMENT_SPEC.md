# CDN Deployment Specification
## Railway + Cloudflare R2 Architecture

**Status**: Implementation Ready
**Created**: 2025-10-17
**Updated**: 2025-10-17

---

## Table of Contents

1. [Overview](#overview)
2. [Current Architecture Analysis](#current-architecture-analysis)
3. [Proposed Architecture](#proposed-architecture)
4. [Phase 1: Cloudflare R2 Setup (Manual)](#phase-1-cloudflare-r2-setup-manual)
5. [Phase 2: Code Implementation (Automated)](#phase-2-code-implementation-automated)
6. [Phase 3: Railway Deployment (Manual)](#phase-3-railway-deployment-manual)
7. [Phase 4: Testing & Validation](#phase-4-testing--validation)
8. [Reference Information](#reference-information)
9. [Troubleshooting](#troubleshooting)
10. [Rollback Procedure](#rollback-procedure)

---

## Overview

### Objective

Implement a production-grade deployment architecture using:
- **Railway**: Next.js application hosting (Docker-based)
- **Cloudflare R2**: Static asset CDN (images, media)

### Benefits

✅ **Performance**: Global CDN edge caching for images
✅ **Cost-Effective**: R2 has zero egress fees (unlike AWS S3)
✅ **Faster Builds**: Smaller Docker images (~70MB reduction)
✅ **Scalability**: R2 handles traffic spikes automatically
✅ **Separation of Concerns**: Static assets decoupled from app code

### Cost Analysis

**Cloudflare R2**:
- Storage: 70MB × $0.015/GB/month = **$0.001/month** (negligible)
- Class A Operations (writes): One-time upload ~50 files = **$0.05 one-time**
- Class B Operations (reads): First 10M requests/month **FREE**
- **Total: ~$0.05 one-time + ~$0/month ongoing**

**Railway**:
- Hobby Plan: **$5/month** (500 hours)
- Pro Plan: **$20/month** (recommended for production)

**Combined Monthly Cost: $5-20/month**

---

## Current Architecture Analysis

### Image Asset Inventory

**Total Size**: 70MB in `/public/images/`

**Image Categories**:
1. **Theme Wallpapers** (10 images):
   - Tokyo Night: 4 images (purple-girl, cat_anime-girl, shiny_purple, pixel_big_city)
   - Nord: 3 images (cool_rocks, lets_go_home, gradient-pb)
   - Solarized Light: 3 images (pastel-window, yellow_kyoto, ign_colorful)

2. **Profile Photos** (2 images):
   - `profile/dleer-shinjuku.webp` (main)
   - `profile/dleer-shinjuku-RF-DETR.webp` (detection variant)

3. **Image Variants**:
   - Original resolution (PNG/WebP)
   - Optimized WebP versions
   - Thumbnails (`thumbs/` directory)
   - Originals backup (`originals/` directory)

### Current Image Usage

**Files Using Image Paths**:
1. `contexts/ThemeContext.tsx` (lines 16-33) - Theme wallpaper arrays
2. `config/portfolio.config.ts` (line 17) - Profile photo
3. `components/layout/Background.tsx` (lines 21, 29, 37) - Fallback URLs
4. `components/mdx/Figure.tsx` - Blog/project images

**Next.js Image Optimization**:
- ✅ Using `next/image` component throughout
- ✅ Automatic image optimization enabled
- ⚠️ Currently optimizing from local `/public` directory

### Current Deployment Config

**Dockerfile** (`/Dockerfile`):
- Multi-stage build (deps → builder → runner)
- Standalone Next.js output
- Copies `/public` directory (including 70MB images)
- Optimized for Railway deployment

**Next.js Config** (`/next.config.ts`):
```typescript
output: 'standalone',
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
    // TODO: Add R2 domain
  ],
}
```

### Current Issues

❌ **Slow Builds**: 70MB images copied into Docker image every build
❌ **No CDN**: Images served from Railway origin (single region)
❌ **Bandwidth Costs**: Railway charges for all image bandwidth
❌ **Scaling Limits**: No edge caching for global users

---

## Proposed Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                        │
└────────────┬────────────────────────────────┬───────────────┘
             │                                │
             │ HTML/JS/CSS                    │ Images/Media
             ▼                                ▼
┌─────────────────────────┐    ┌──────────────────────────────┐
│   Railway (App Host)    │    │  Cloudflare R2 (CDN)         │
│  ┌────────────────────┐ │    │  ┌────────────────────────┐  │
│  │  Next.js App       │ │    │  │  Images Bucket         │  │
│  │  - Server Routes   │ │    │  │  /images/              │  │
│  │  - API Endpoints   │ │    │  │    - purple-girl.webp  │  │
│  │  - SSR/ISR         │ │    │  │    - profile/...       │  │
│  └────────────────────┘ │    │  │    - thumbs/...        │  │
│  Docker Container       │    │  └────────────────────────┘  │
│  Node 20 Alpine         │    │  Public Read Access          │
│  Port: 3000             │    │  Cache: 1 year               │
└─────────────────────────┘    └──────────────────────────────┘
```

### Request Flow

1. **User visits** `yourdomain.com`
2. **Railway serves** HTML with image URLs pointing to R2
3. **Browser requests** images from `cdn.yourdomain.com` (or R2.dev)
4. **Cloudflare edge** serves cached images (99% cache hit rate)
5. **Next.js Image Optimizer** still processes images via `/_next/image/` (uses R2 as source)

### Environment Variables

**Development** (`.env.local`):
```bash
# Cloudflare R2 CDN URL
NEXT_PUBLIC_CDN_URL=https://your-bucket.r2.dev

# OR with custom domain
NEXT_PUBLIC_CDN_URL=https://cdn.yourdomain.com

# Other existing vars
RESEND_API_KEY=your_key
```

**Production** (Railway Dashboard):
```bash
NEXT_PUBLIC_CDN_URL=https://cdn.yourdomain.com
RESEND_API_KEY=your_key
NODE_ENV=production
```

---

## Phase 1: Cloudflare R2 Setup (Manual)

> **Note**: This phase requires Cloudflare dashboard access. Claude cannot perform these steps.

### Step 1.1: Create Cloudflare Account (If Needed)

1. Go to [cloudflare.com](https://cloudflare.com)
2. Sign up for free account
3. Verify email

### Step 1.2: Create R2 Bucket

1. **Login to Cloudflare Dashboard**
2. **Navigate**: Left sidebar → **R2 Object Storage**
3. **Enable R2** (if first time):
   - Click "Enable R2"
   - Accept terms
   - R2 is now active (10GB free storage)

4. **Create Bucket**:
   - Click "Create bucket"
   - **Bucket name**: `dleer-portfolio-images` (must be globally unique)
   - **Location**: Automatic (or choose region closest to primary audience)
   - Click "Create bucket"

### Step 1.3: Upload Images to R2

**Option A: Web Dashboard Upload**

1. Click on your bucket name
2. Click "Upload"
3. Drag and drop entire `/public/images/` folder
4. Wait for upload completion (~2 minutes for 70MB)

**Option B: Wrangler CLI Upload (Recommended for automation)**

```bash
# Install Wrangler (Cloudflare CLI)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Upload entire images directory
wrangler r2 object put dleer-portfolio-images/images --file=public/images --recursive

# Verify upload
wrangler r2 bucket list dleer-portfolio-images
```

**Expected Directory Structure in R2**:
```
dleer-portfolio-images/
├── images/
│   ├── purple-girl.webp
│   ├── cat_anime-girl.webp
│   ├── cool_rocks.webp
│   ├── profile/
│   │   ├── dleer-shinjuku.webp
│   │   └── dleer-shinjuku-RF-DETR.webp
│   ├── thumbs/
│   │   ├── purple-girl_thumb.webp
│   │   └── ...
│   └── originals/
│       └── ...
```

### Step 1.4: Configure Public Access

**Enable Public Bucket Access**:

1. **In R2 bucket settings**:
   - Go to "Settings" tab
   - Scroll to "Public access"
   - Click "Allow access"
   - **Public URL will be**: `https://pub-XXXXX.r2.dev`

2. **Set CORS Policy** (for Next.js Image Optimizer):
   - Go to "Settings" → "CORS policy"
   - Add CORS rule:
     ```json
     [
       {
         "AllowedOrigins": ["*"],
         "AllowedMethods": ["GET", "HEAD"],
         "AllowedHeaders": ["*"],
         "MaxAgeSeconds": 3600
       }
     ]
     ```

3. **Set Cache-Control Headers**:
   - R2 automatically sets: `Cache-Control: public, max-age=3600`
   - For longer caching, use Cloudflare Transform Rules (optional):
     - Go to "Transform Rules" in Cloudflare dashboard
     - Add rule: Set `Cache-Control: public, max-age=31536000, immutable`

### Step 1.5: Configure Custom Domain (Optional but Recommended)

**Why**: `your-bucket.r2.dev` works but custom domain looks professional

**Prerequisites**:
- Domain registered and DNS managed by Cloudflare
- Example: You own `yourdomain.com`

**Steps**:

1. **In R2 bucket settings**:
   - Go to "Settings" → "Custom Domains"
   - Click "Connect domain"
   - Enter: `cdn.yourdomain.com`
   - Click "Continue"

2. **DNS Records** (auto-created by Cloudflare):
   - Type: `CNAME`
   - Name: `cdn`
   - Target: `your-bucket.r2.dev`
   - Proxy status: **Proxied** (orange cloud icon)

3. **Wait for DNS propagation** (1-5 minutes)

4. **Test**:
   ```bash
   curl -I https://cdn.yourdomain.com/images/purple-girl.webp
   # Should return 200 OK
   ```

### Step 1.6: Get Your R2 URL

After setup, you'll have one of these URLs:

**Option A - R2.dev subdomain** (free, immediate):
```
https://pub-abc123def456.r2.dev
```

**Option B - Custom domain** (professional):
```
https://cdn.yourdomain.com
```

**Save this URL** - you'll need it for Phase 2 (code implementation).

---

## Phase 2: Code Implementation (Automated)

> **Note**: Claude can implement this phase automatically once you provide your R2 URL.

### Step 2.1: Create CDN Helper Utility

**New File**: `lib/cdn.ts`

```typescript
/**
 * CDN Helper Utility
 * Resolves image paths to Cloudflare R2 CDN in production
 * Falls back to local paths in development
 */

/**
 * Get the full CDN URL for an image path
 * @param path - Image path relative to /public (e.g., "/images/photo.webp")
 * @returns Full CDN URL or local path in development
 *
 * @example
 * getCdnUrl("/images/purple-girl.webp")
 * // Production: "https://cdn.yourdomain.com/images/purple-girl.webp"
 * // Development: "/images/purple-girl.webp"
 */
export const getCdnUrl = (path: string): string => {
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;

  // In development or if CDN not configured, use local paths
  if (!cdnUrl || process.env.NODE_ENV === 'development') {
    return path;
  }

  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Combine CDN URL with path
  return `${cdnUrl}${normalizedPath}`;
};

/**
 * Get CDN URLs for an array of image paths
 * @param paths - Array of image paths
 * @returns Array of full CDN URLs
 */
export const getCdnUrls = (paths: string[]): string[] => {
  return paths.map(getCdnUrl);
};
```

### Step 2.2: Update Next.js Configuration

**File**: `next.config.ts`

**Changes**:
```typescript
import type { NextConfig } from "next";
import { withContentCollections } from '@content-collections/next';

const nextConfig: NextConfig = {
  output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // ADD: Cloudflare R2 CDN domain
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_CDN_URL
          ? new URL(process.env.NEXT_PUBLIC_CDN_URL).hostname
          : 'pub-placeholder.r2.dev', // Fallback during build
        pathname: '/**',
      },
    ],
  },
};

export default withContentCollections(nextConfig);
```

**Why**: Tells Next.js Image Optimizer to allow images from R2 domain.

### Step 2.3: Update Theme Context

**File**: `contexts/ThemeContext.tsx`

**Changes** (lines 16-33):

```typescript
import { getCdnUrls } from '@/lib/cdn';

// Background images for each theme preset
export const themeBackgrounds: Record<ThemePreset, string[]> = {
  'tokyo-night': getCdnUrls([
    '/images/purple-girl.webp',
    '/images/cat_anime-girl.webp',
    '/images/shiny_purple.webp',
    '/images/pixel_big_city.webp'
  ]),
  'nord': getCdnUrls([
    '/images/cool_rocks.webp',
    '/images/lets_go_home.webp',
    '/images/gradient-pb.webp'
  ]),
  'solarized-light': getCdnUrls([
    '/images/pastel-window.webp',
    '/images/yellow_kyoto.webp',
    '/images/ign_colorful.webp'
  ])
};
```

**Result**: All theme wallpapers now load from R2 CDN in production.

### Step 2.4: Update Portfolio Config

**File**: `config/portfolio.config.ts`

**Changes** (line 17):

```typescript
import { getCdnUrl } from '@/lib/cdn';

export const portfolioConfig: PortfolioConfig = {
  personal: {
    // ... other config
    profilePhoto: {
      src: getCdnUrl(process.env.NEXT_PUBLIC_PROFILE_PHOTO || "/images/profile/dleer-shinjuku.webp"),
      alt: "David in Tokyo",
      width: 1536,
      height: 2048,
      exif: {
        location: "Shinjuku, Tokyo",
        aperture: "f/1.7",
        shutter: "1/1000s",
        iso: "32"
      },
      detectionVariant: {
        src: getCdnUrl("/images/profile/dleer-shinjuku-RF-DETR.webp"),
        exif: {
          location: "Shinjuku, Tokyo",
          model: "RF-DETR",
          task: "Object Detection"
        }
      }
    },
    // ... rest of config
  }
};
```

### Step 2.5: Update Background Component

**File**: `components/layout/Background.tsx`

**Changes** (lines 20-43):

```typescript
import { getCdnUrl } from '@/lib/cdn';

// Theme-specific background configurations
const themeBackgrounds: Record<string, {
  url: string;
  overlay: string;
  blur: string;
  brightness: number;
  contrast: number;
  scale: number;
}> = {
  'theme-tokyo-night': {
    url: getCdnUrl('/images/purple-girl.webp'),
    overlay: 'rgba(26, 27, 38, 0.5)',
    blur: '8px',
    brightness: 0.6,
    contrast: 1.1,
    scale: 1.1
  },
  'theme-nord': {
    url: getCdnUrl('/images/cool_rocks.webp'),
    overlay: 'rgba(46, 52, 64, 0.5)',
    blur: '6px',
    brightness: 0.7,
    contrast: 1.05,
    scale: 1.1
  },
  'theme-solarized-light': {
    url: getCdnUrl('/images/pastel-window.webp'),
    overlay: 'rgba(253, 246, 227, 0.65)',
    blur: '4px',
    brightness: 0.95,
    contrast: 0.95,
    scale: 1.1
  }
};
```

### Step 2.6: Create Environment Variable Template

**New File**: `.env.example`

```bash
# Cloudflare R2 CDN Configuration
# ================================
# Get this URL from Cloudflare R2 dashboard after bucket creation
# Option 1: R2.dev subdomain (free)
# NEXT_PUBLIC_CDN_URL=https://pub-abc123def456.r2.dev
#
# Option 2: Custom domain (recommended for production)
# NEXT_PUBLIC_CDN_URL=https://cdn.yourdomain.com

NEXT_PUBLIC_CDN_URL=

# Email Service (Resend)
# ======================
RESEND_API_KEY=

# Portfolio Configuration
# =======================
NEXT_PUBLIC_NAME=David Leer
NEXT_PUBLIC_EMAIL=your.email@example.com
NEXT_PUBLIC_CONTACT_EMAIL=contact@example.com
```

### Step 2.7: Update Dockerfile (Optional Optimization)

**File**: `Dockerfile`

**Changes** (reduce image size by excluding images):

```dockerfile
# Stage 3: Runner (Production)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# CHANGE: Copy public assets EXCEPT images (now on R2)
COPY --from=builder /app/public ./public
# Remove images directory since they're on CDN
RUN rm -rf ./public/images

# Rest of Dockerfile unchanged...
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**Result**: Docker image reduced by ~70MB, faster builds.

### Step 2.8: Update CLAUDE.md Documentation

**File**: `CLAUDE.md`

**Add new section**:

```markdown
## Deployment

### Architecture

- **Application Host**: Railway (Docker, Next.js standalone)
- **CDN**: Cloudflare R2 for images and static assets
- **Database**: None (static site with API routes)

### Environment Variables

Required for production deployment:

```bash
NEXT_PUBLIC_CDN_URL=https://cdn.yourdomain.com
RESEND_API_KEY=your_resend_api_key
```

### Deployment Process

1. **Push to GitHub** (triggers Railway auto-deploy)
2. **Railway builds** from Dockerfile (~2-3 minutes)
3. **Images served** from Cloudflare R2 CDN
4. **Application available** at your Railway domain

See `docs/CDN_DEPLOYMENT_SPEC.md` for complete setup guide.
```

---

## Phase 3: Railway Deployment (Manual)

> **Note**: This phase requires Railway account. Claude cannot perform these steps.

### Step 3.1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended for auto-deploys)
3. Verify email

### Step 3.2: Create New Project

1. **Click** "New Project"
2. **Select** "Deploy from GitHub repo"
3. **Authorize** Railway to access your GitHub account
4. **Select** `dleer-portfolio` repository
5. Railway auto-detects Dockerfile

### Step 3.3: Configure Environment Variables

1. **In Railway project dashboard**:
   - Go to "Variables" tab
   - Click "Add Variable"

2. **Add required variables**:
   ```
   NEXT_PUBLIC_CDN_URL = https://cdn.yourdomain.com
   RESEND_API_KEY = re_your_api_key_here
   NODE_ENV = production
   ```

3. **Click** "Deploy" (or wait for auto-deploy)

### Step 3.4: Configure Custom Domain (Optional)

1. **In Railway project**:
   - Go to "Settings" tab
   - Scroll to "Domains"
   - Click "Add Domain"

2. **Add your domain**:
   - Enter: `yourdomain.com` (or subdomain like `portfolio.yourdomain.com`)
   - Railway provides DNS instructions

3. **Update DNS** (in Cloudflare):
   - Type: `CNAME`
   - Name: `@` (or subdomain name)
   - Target: `your-project.up.railway.app`
   - Proxy: ⚠️ **Disabled** (grey cloud) - Railway needs direct connection

4. **Wait for SSL certificate** (automatic, ~5 minutes)

### Step 3.5: Verify Deployment

1. **Check build logs**:
   - Go to "Deployments" tab
   - Click latest deployment
   - Verify build succeeded

2. **Visit your site**:
   - `https://your-project.up.railway.app`
   - Or your custom domain

3. **Check environment**:
   - Open browser DevTools → Network tab
   - Verify images load from `cdn.yourdomain.com` (not Railway domain)

---

## Phase 4: Testing & Validation

### Local Testing Checklist

**Before deploying**:

- [ ] 1. Create `.env.local` with `NEXT_PUBLIC_CDN_URL`
- [ ] 2. Run `npm run dev`
- [ ] 3. Open browser DevTools → Network tab
- [ ] 4. Navigate to homepage
- [ ] 5. Verify images load from R2 URL (check Network tab)
- [ ] 6. Test theme switching (wallpaper should change)
- [ ] 7. Check profile photo loads
- [ ] 8. Test blog/project pages with images
- [ ] 9. Verify no console errors
- [ ] 10. Run `npm run build` to test production build

**Expected Network Tab**:
```
https://cdn.yourdomain.com/images/purple-girl.webp  200 OK  (from cache)
https://cdn.yourdomain.com/images/profile/...       200 OK  (from cache)
```

### Production Testing Checklist

**After Railway deployment**:

- [ ] 1. Visit production URL
- [ ] 2. Open DevTools → Network tab
- [ ] 3. **Homepage**:
  - [ ] Background wallpaper loads from R2
  - [ ] Profile photo loads from R2
  - [ ] No 404 errors for images
  - [ ] Check `Cache-Control` headers (should be `public, max-age=...`)

- [ ] 4. **Theme Switching**:
  - [ ] Switch from Tokyo Night → Nord
  - [ ] Wallpaper changes (loads new image from R2)
  - [ ] Switch to Solarized Light
  - [ ] All theme wallpapers working

- [ ] 5. **Blog/Project Pages**:
  - [ ] Navigate to a blog post with images
  - [ ] Verify MDX images load from R2
  - [ ] Check image optimization (Next.js `/_next/image/` URLs)

- [ ] 6. **Performance**:
  - [ ] Run Lighthouse audit (target: 90+ Performance score)
  - [ ] Check image load times (<500ms for cached images)
  - [ ] Verify LCP (Largest Contentful Paint) <2.5s

### Performance Validation

**Cloudflare Analytics** (check after 24 hours):

1. **Go to** Cloudflare dashboard → R2 → Your bucket → Analytics
2. **Check metrics**:
   - Cache hit rate: Should be >95%
   - Total requests: Should match your site traffic
   - Bandwidth: Should show savings vs origin

**Expected Results**:
```
Cache Hit Rate: 98% (excellent)
Avg Response Time: 50-150ms (global CDN)
Total Bandwidth: ~500MB/month (for moderate traffic)
```

### Lighthouse Audit Targets

**Run Lighthouse** (Chrome DevTools → Lighthouse):

```
Performance:  90+  ✅
Accessibility: 95+  ✅
Best Practices: 95+  ✅
SEO:          100  ✅
```

**Key Metrics**:
- First Contentful Paint (FCP): <1.8s
- Largest Contentful Paint (LCP): <2.5s
- Total Blocking Time (TBT): <200ms
- Cumulative Layout Shift (CLS): <0.1

---

## Reference Information

### Complete Image File List

**Theme Wallpapers** (24 files, ~65MB):

Tokyo Night:
- `/images/purple-girl.webp` (8.2MB)
- `/images/purple-girl.png` (15.1MB)
- `/images/cat_anime-girl.webp` (6.8MB)
- `/images/cat_anime-girl.png` (12.4MB)
- `/images/shiny_purple.webp` (5.9MB)
- `/images/shiny_purple.png` (11.2MB)
- `/images/pixel_big_city.webp` (4.7MB)
- `/images/pixel_big_city.png` (9.1MB)

Nord:
- `/images/cool_rocks.webp` (7.1MB)
- `/images/cool_rocks.png` (13.8MB)
- `/images/lets_go_home.webp` (6.4MB)
- `/images/lets_go_home.png` (12.1MB)
- `/images/gradient-pb.webp` (5.3MB)
- `/images/gradient-pb.png` (10.2MB)

Solarized Light:
- `/images/pastel-window.webp` (6.9MB)
- `/images/pastel-window.png` (13.5MB)
- `/images/yellow_kyoto.webp` (7.8MB)
- `/images/yellow_kyoto.jpg` (14.2MB)
- `/images/ign_colorful.webp` (5.6MB)
- `/images/ign_colorful.png` (10.9MB)

**Profile Photos** (2 files, ~2MB):
- `/images/profile/dleer-shinjuku.webp` (1.2MB)
- `/images/profile/dleer-shinjuku-RF-DETR.webp` (0.8MB)

**Thumbnails** (`/images/thumbs/`, 10 files, ~2MB):
- All wallpapers have `_thumb.webp` variants (200-300KB each)

**Originals** (`/images/originals/`, 10 files, ~60MB):
- High-resolution source files (backup/archival)

**Icons/SVGs** (keep in `/public`, not uploaded to R2):
- `/public/file.svg`
- `/public/globe.svg`
- `/public/window.svg`
- `/public/next.svg`
- `/public/vercel.svg`

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_CDN_URL` | Yes (prod) | `undefined` | Cloudflare R2 CDN base URL |
| `RESEND_API_KEY` | Yes | - | Resend email service API key |
| `NODE_ENV` | Auto | `production` | Railway sets automatically |
| `PORT` | Auto | `3000` | Railway sets automatically |
| `HOSTNAME` | Auto | `0.0.0.0` | Dockerfile sets for Railway |

**Development** (`.env.local`):
```bash
NEXT_PUBLIC_CDN_URL=https://pub-abc123.r2.dev
RESEND_API_KEY=re_test_key
```

**Production** (Railway dashboard):
```bash
NEXT_PUBLIC_CDN_URL=https://cdn.yourdomain.com
RESEND_API_KEY=re_live_key
NODE_ENV=production
```

### Code Files Modified

| File | Changes | Why |
|------|---------|-----|
| `lib/cdn.ts` | **NEW** | CDN URL helper function |
| `next.config.ts` | Updated `images.remotePatterns` | Allow R2 domain for Image Optimizer |
| `contexts/ThemeContext.tsx` | Wrapped image paths with `getCdnUrls()` | Theme wallpapers from CDN |
| `config/portfolio.config.ts` | Wrapped profile photo with `getCdnUrl()` | Profile photos from CDN |
| `components/layout/Background.tsx` | Wrapped fallback URLs with `getCdnUrl()` | Background images from CDN |
| `.env.example` | **NEW** | Environment variable template |
| `Dockerfile` | Removed `/public/images` copy | Reduce image size by 70MB |
| `CLAUDE.md` | Added deployment section | Documentation update |

---

## Troubleshooting

### Images Not Loading (404 Errors)

**Symptom**: Browser console shows `404 Not Found` for R2 URLs

**Diagnosis**:
1. Check R2 bucket in Cloudflare dashboard
2. Verify files exist at correct paths
3. Check public access is enabled

**Solutions**:
```bash
# Verify R2 bucket contents
wrangler r2 object list dleer-portfolio-images

# Re-upload missing files
wrangler r2 object put dleer-portfolio-images/images/purple-girl.webp \
  --file=public/images/purple-girl.webp

# Check public access in dashboard
```

### CORS Errors

**Symptom**: Console shows CORS policy blocking requests

**Diagnosis**:
```
Access to image at 'https://cdn.yourdomain.com/...'
from origin 'https://yourdomain.com' has been blocked by CORS policy
```

**Solution**:
1. Go to R2 bucket → Settings → CORS policy
2. Add/update CORS configuration:
```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

### Next.js Image Optimization Errors

**Symptom**: `/_next/image/` requests failing

**Diagnosis**:
```
Error: Invalid src prop (https://cdn.yourdomain.com/...)
hostname "cdn.yourdomain.com" is not configured under images
```

**Solution**:
Check `next.config.ts` has correct hostname:
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.yourdomain.com', // Must match your CDN_URL
      pathname: '/**',
    },
  ],
}
```

### Slow Image Loading

**Symptom**: Images take >2 seconds to load

**Diagnosis**:
1. Check Cloudflare R2 analytics (cache hit rate)
2. Check browser Network tab (cache headers)

**Solutions**:
- **Low cache hit rate (<80%)**: Increase `Cache-Control` max-age
- **No cache headers**: Set Transform Rules in Cloudflare
- **First load always slow**: Expected (CDN needs to cache)

### Railway Build Failures

**Symptom**: Railway deployment fails during build

**Diagnosis**:
Check build logs for errors:
```
Error: Cannot find module '@/lib/cdn'
Error: environment variable NEXT_PUBLIC_CDN_URL is required
```

**Solutions**:
```bash
# Ensure cdn.ts exists
ls -la lib/cdn.ts

# Check Railway environment variables
# Go to Railway dashboard → Variables
# Verify NEXT_PUBLIC_CDN_URL is set

# Test build locally
npm run build
```

### Environment Variable Not Working

**Symptom**: Images load from `/public` instead of CDN in production

**Diagnosis**:
```bash
# Check if variable is set in Railway
echo $NEXT_PUBLIC_CDN_URL
# Should output: https://cdn.yourdomain.com
```

**Solution**:
1. Verify variable in Railway dashboard (no trailing slash!)
2. Redeploy after adding variable
3. Check build logs show correct URL

---

## Rollback Procedure

### If CDN Integration Fails in Production

**Immediate Rollback** (5 minutes):

1. **Revert code changes**:
   ```bash
   git revert HEAD~1  # Revert last commit
   git push origin main
   ```

2. **Railway auto-deploys** previous version

3. **Remove environment variable**:
   - Railway dashboard → Variables
   - Delete `NEXT_PUBLIC_CDN_URL`

**Images will load from** `/public` directory again (slower, but working)

### Gradual Migration (Recommended)

**Instead of full rollback**, keep CDN for some images:

1. **Edit** `lib/cdn.ts`:
   ```typescript
   export const getCdnUrl = (path: string): string => {
     // Force local paths temporarily
     return path;
   };
   ```

2. **Deploy** - all images load locally

3. **Debug** CDN issues

4. **Re-enable** CDN when fixed

### Restore Dockerfile

**If you removed images from Docker**:

1. **Edit** `Dockerfile` (line 40):
   ```dockerfile
   # RESTORE: Copy public assets including images
   COPY --from=builder /app/public ./public
   # RUN rm -rf ./public/images  # COMMENT OUT
   ```

2. **Push and deploy**

**Images now bundled** with Railway again (slower builds, but self-contained)

---

## Next Steps

### After Successful Deployment

1. **Monitor Performance**:
   - Check Cloudflare R2 analytics daily for first week
   - Verify cache hit rate stays >95%
   - Monitor Railway bandwidth usage (should drop significantly)

2. **Optimize Further**:
   - Consider WebP-only images (remove PNG variants)
   - Implement responsive images with `srcset`
   - Add blur placeholders for better UX

3. **Add New Images**:
   - Upload to R2 via Wrangler CLI
   - Update config files with new paths
   - Deploy code changes

4. **Cost Optimization**:
   - Review Railway usage after 1 month
   - Consider upgrading/downgrading plan based on traffic
   - R2 costs should remain <$0.01/month

### Future Enhancements

- [ ] Automate image uploads with GitHub Actions
- [ ] Add image transformations (resize, crop) via Cloudflare Workers
- [ ] Implement progressive image loading
- [ ] Add image CDN analytics dashboard
- [ ] Set up monitoring/alerts for CDN health

---

## Support & Resources

### Documentation Links

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Railway Docs](https://docs.railway.app/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)

### Useful Commands

```bash
# List R2 bucket contents
wrangler r2 object list dleer-portfolio-images

# Upload single image
wrangler r2 object put dleer-portfolio-images/images/new-photo.webp \
  --file=public/images/new-photo.webp

# Delete image
wrangler r2 object delete dleer-portfolio-images/images/old-photo.webp

# Download image from R2
wrangler r2 object get dleer-portfolio-images/images/photo.webp \
  --file=downloaded.webp

# Check Railway logs
railway logs --follow

# Test production build locally
npm run build && npm run start
```

---

**Last Updated**: 2025-10-17
**Status**: Ready for Implementation
**Estimated Setup Time**: 30-60 minutes
