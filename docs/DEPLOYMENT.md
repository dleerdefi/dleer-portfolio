# Deployment Guide

Comprehensive deployment instructions for the Hyprland-Inspired Portfolio across multiple platforms.

---

## Table of Contents

- [Railway](#railway-recommended)
- [Vercel](#vercel)
- [Docker](#docker-self-hosted)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## Railway (Recommended)

Railway provides one-click deployment with automatic environment variable detection and Dockerfile support.

### Prerequisites

- GitHub account
- Railway account ([railway.app](https://railway.app))
- Resend API key ([resend.com](https://resend.com))

### Step 1: Connect Repository

1. Visit [railway.app](https://railway.app)
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Authorize Railway to access your GitHub
5. Select your `dleer-portfolio` repository

### Step 2: Configure Environment Variables

Railway will detect your `Dockerfile` automatically. Add environment variables:

1. Go to your project dashboard
2. Click on your service
3. Navigate to **Variables** tab
4. Add the following variables:

**Required:**
```bash
RESEND_API_KEY=re_your_actual_api_key_here
NEXT_PUBLIC_CONTACT_EMAIL=your@email.com
```

**Recommended:**
```bash
NEXT_PUBLIC_NAME=Your Name
NEXT_PUBLIC_TITLE=Your Title
NEXT_PUBLIC_GITHUB_URL=https://github.com/yourusername
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/yourprofile
NEXT_PUBLIC_TWITTER_URL=https://x.com/yourhandle
```

**Security Tip**: Enable "Sealed" for `RESEND_API_KEY` to hide the value in the UI.

### Step 3: Deploy

Railway will automatically:
- ✅ Detect `Dockerfile`
- ✅ Read `railway.toml` configuration
- ✅ Build multi-stage Docker image
- ✅ Start with command: `node server.js`
- ✅ Expose on port 3000

Click **Deploy** and Railway will build and launch your portfolio!

### Step 4: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Click **Generate Domain** for free Railway subdomain
3. Or click **Custom Domain** to add your own domain
4. Configure DNS records as instructed by Railway

---

## Vercel

Vercel provides seamless Next.js deployment with automatic builds on every push.

### Prerequisites

- GitHub account
- Vercel account ([vercel.com](https://vercel.com))
- Resend API key

### Method 1: GitHub Integration (Recommended)

1. Visit [vercel.com](https://vercel.com) and log in
2. Click **Add New** → **Project**
3. Import your `dleer-portfolio` repository from GitHub
4. Vercel auto-detects Next.js configuration
5. Click **Deploy**

### Method 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project root
cd dleer-portfolio
vercel

# Follow prompts:
# - Link to existing project? (No for first deploy)
# - Project name: dleer-portfolio
# - Directory: ./ (current directory)
# - Build settings: Auto-detected
```

### Configure Environment Variables

#### Via Dashboard:

1. Go to your project on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add all variables with appropriate environments:

| Variable | Value | Production | Preview | Development |
|----------|-------|------------|---------|-------------|
| `RESEND_API_KEY` | `re_...` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `your@email.com` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_NAME` | `Your Name` | ✅ | ✅ | ✅ |

#### Via CLI:

```bash
# Add environment variables
vercel env add RESEND_API_KEY
vercel env add NEXT_PUBLIC_CONTACT_EMAIL
vercel env add NEXT_PUBLIC_NAME

# Pull environment variables for local development
vercel env pull
```

### Redeploy

Vercel automatically redeploys on every push to `main` branch. Manual redeploy:

```bash
vercel --prod
```

---

## Docker (Self-Hosted)

Deploy using the included multi-stage Dockerfile for optimized production builds.

### Prerequisites

- Docker installed ([get.docker.com](https://get.docker.com))
- Port 3000 available
- Environment variables prepared

### Build Image

```bash
# Build production image
docker build -t portfolio:latest .

# The Dockerfile uses multi-stage builds:
# Stage 1: Dependencies (node:18-alpine)
# Stage 2: Build (production build with Turbopack)
# Stage 3: Runtime (minimal runtime image)
```

### Run Container

#### Basic Run:

```bash
docker run -d \
  --name portfolio \
  -p 3000:3000 \
  -e RESEND_API_KEY=your_key \
  -e NEXT_PUBLIC_CONTACT_EMAIL=your@email.com \
  -e NEXT_PUBLIC_NAME="Your Name" \
  portfolio:latest
```

#### Using Environment File:

```bash
# Create .env.production
cat > .env.production <<EOF
RESEND_API_KEY=re_your_key
NEXT_PUBLIC_CONTACT_EMAIL=your@email.com
NEXT_PUBLIC_NAME=Your Name
NEXT_PUBLIC_TITLE=Your Title
NEXT_PUBLIC_GITHUB_URL=https://github.com/yourusername
EOF

# Run with env file
docker run -d \
  --name portfolio \
  -p 3000:3000 \
  --env-file .env.production \
  portfolio:latest
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  portfolio:
    build: .
    ports:
      - "3000:3000"
    environment:
      RESEND_API_KEY: ${RESEND_API_KEY}
      NEXT_PUBLIC_CONTACT_EMAIL: ${NEXT_PUBLIC_CONTACT_EMAIL}
      NEXT_PUBLIC_NAME: ${NEXT_PUBLIC_NAME}
      NEXT_PUBLIC_TITLE: ${NEXT_PUBLIC_TITLE}
      NEXT_PUBLIC_GITHUB_URL: ${NEXT_PUBLIC_GITHUB_URL}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Run with:

```bash
docker-compose up -d
```

### Container Management

```bash
# View logs
docker logs portfolio

# Stop container
docker stop portfolio

# Start container
docker start portfolio

# Remove container
docker rm -f portfolio

# View resource usage
docker stats portfolio
```

### Reverse Proxy with Nginx (Optional)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Environment Variables

### Complete Reference

All available environment variables for customization:

#### Contact Form (Required)

| Variable | Type | Description |
|----------|------|-------------|
| `RESEND_API_KEY` | Server | API key from resend.com (required for contact form) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Client | Email address to receive form submissions |

#### Personal Information

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_NAME` | "David Leer" | Your full name |
| `NEXT_PUBLIC_USERNAME` | "dleer" | Your username/handle |
| `NEXT_PUBLIC_TITLE` | "Founder & Software Engineer" | Professional title |
| `NEXT_PUBLIC_EMAIL` | - | Display email address |
| `NEXT_PUBLIC_LOCATION` | "San Francisco" | Your location |

#### Social Media

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GITHUB_URL` | GitHub profile URL |
| `NEXT_PUBLIC_GITHUB_HANDLE` | GitHub username (for links) |
| `NEXT_PUBLIC_LINKEDIN_URL` | LinkedIn profile URL |
| `NEXT_PUBLIC_TWITTER_URL` | Twitter/X profile URL |

#### SEO & Meta

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_SEO_TITLE` | "Your Portfolio" | Page title for SEO |
| `NEXT_PUBLIC_SEO_DESCRIPTION` | - | Meta description |
| `NEXT_PUBLIC_SEO_IMAGE` | - | Open Graph image URL |

See [.env.example](../.env.example) for complete list of 30+ variables.

---

## Post-Deployment

### Verification Checklist

After deployment, verify the following:

- [ ] Homepage loads correctly
- [ ] Desktop 4-tile layout renders (≥1024px)
- [ ] Mobile parallax mode works (<1024px)
- [ ] Theme switching works (Tokyo Night, Nord, Solarized)
- [ ] Accent color customization works
- [ ] Contact form submits successfully
- [ ] Contact form sends email to configured address
- [ ] All projects display correctly
- [ ] Navigation between pages works
- [ ] Console has no errors

### Testing Contact Form

1. Open contact form
2. Fill in name, email, message
3. Submit form
4. Check for success message
5. Verify email received at `NEXT_PUBLIC_CONTACT_EMAIL`

### Performance Optimization

**Enable Compression** (if not using CDN):
- Railway: Automatic compression
- Vercel: Automatic compression
- Docker: Add nginx with gzip

**Enable Caching**:
- Set proper cache headers for static assets
- Use CDN for images (Cloudflare, Vercel Edge)

---

## Troubleshooting

### Common Issues

#### Contact Form Not Sending

**Symptom**: Form shows success but no email received

**Solutions**:
1. Check `RESEND_API_KEY` is correct
2. Verify `NEXT_PUBLIC_CONTACT_EMAIL` is set
3. Check Resend dashboard for delivery status
4. Ensure Resend domain is verified (for custom domains)

#### Environment Variables Not Working

**Symptom**: Variables show as undefined or default values

**Solutions**:
1. Verify variables start with `NEXT_PUBLIC_` for client-side
2. Rebuild application after adding variables
3. Check deployment platform has variables saved
4. Restart the application/container

#### Docker Build Fails

**Symptom**: Build errors during Docker image creation

**Solutions**:
```bash
# Clear Docker cache
docker build --no-cache -t portfolio .

# Check available disk space
df -h

# Verify Node version in Dockerfile matches local
```

#### Port Already in Use

**Symptom**: `EADDRINUSE: address already in use :::3000`

**Solutions**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
docker run -p 3001:3000 portfolio
```

#### Mobile Layout Not Working

**Symptom**: Mobile shows desktop layout or vice versa

**Solutions**:
1. Clear browser cache
2. Check viewport meta tag in HTML
3. Verify CSS media queries load
4. Test in private/incognito window

### Debug Mode

Enable debug logging for troubleshooting:

```bash
# Set debug environment variable
DEBUG=* npm run dev

# Or in production
docker run -e DEBUG=* portfolio
```

### Getting Help

If issues persist:

1. Check [GitHub Issues](https://github.com/dleerdefi/dleer-portfolio/issues)
2. Review deployment platform logs
3. Verify environment variables are set correctly
4. Check browser console for errors

---

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Resend API Documentation](https://resend.com/docs)

---

**Last Updated**: January 2025
