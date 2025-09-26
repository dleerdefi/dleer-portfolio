# Portfolio Configuration Guide

This portfolio is designed to be fully configurable, making it easy to customize for your own use when forking or using as a template.

## Quick Start

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** with your personal information

3. **Customize `config/portfolio.config.ts`** for detailed configuration

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Configuration Structure

### 1. Environment Variables (`.env.local`)

The most common settings can be configured through environment variables:

```env
# Personal Information
NEXT_PUBLIC_NAME="Your Name"
NEXT_PUBLIC_USERNAME="yourusername"
NEXT_PUBLIC_TITLE="Your Professional Title"
NEXT_PUBLIC_SUBTITLE="Your tagline"
NEXT_PUBLIC_EMAIL="your.email@example.com"
NEXT_PUBLIC_LOCATION="Your Location"

# Social Media Links
NEXT_PUBLIC_GITHUB_URL="https://github.com/yourusername"
NEXT_PUBLIC_GITHUB_USERNAME="@yourusername"
NEXT_PUBLIC_LINKEDIN_URL="https://linkedin.com/in/yourusername"
NEXT_PUBLIC_LINKEDIN_USERNAME="yourusername"
NEXT_PUBLIC_TWITTER_URL="https://twitter.com/yourusername"
NEXT_PUBLIC_TWITTER_USERNAME="@yourusername"
NEXT_PUBLIC_TELEGRAM_URL="https://t.me/yourusername"
NEXT_PUBLIC_TELEGRAM_USERNAME="@yourusername"

# SEO Configuration
NEXT_PUBLIC_SEO_TITLE="Your Portfolio | Terminal Style"
NEXT_PUBLIC_SEO_DESCRIPTION="Your portfolio description"
NEXT_PUBLIC_OG_IMAGE="/og-image.png"

# Theme Configuration (Optional)
NEXT_PUBLIC_WALLPAPER="/images/rice-wallpaper.jpg"
NEXT_PUBLIC_PRIMARY_COLOR="#7aa2f7"
NEXT_PUBLIC_ACCENT_COLOR="#9ece6a"
```

### 2. Main Configuration File (`config/portfolio.config.ts`)

For more detailed configuration, edit the main configuration file:

#### Personal Information
```typescript
personal: {
  name: "Your Name",
  username: "yourusername",
  title: "Your Professional Title",
  subtitle: "Your tagline",
  email: "contact@example.com",
  location: "Your Location",
  bio: {
    short: "A brief bio for quick introductions",
    long: `A longer, more detailed bio that can span
    multiple paragraphs. This is shown in the about section.`
  }
}
```

#### Projects
```typescript
projects: [
  {
    id: "project-id",
    name: "project-name.ext",
    filename: "project-name.ext",  // Shown in file tree
    description: "Brief description",
    techStack: ["Tech1", "Tech2"],
    techStackDisplay: "Tech1, Tech2, Tech3",
    github: "https://github.com/user/repo",
    demo: "https://demo.example.com",
    status: "production" // or "development" or "archived"
  }
]
```

#### Blog Posts
```typescript
blog: [
  {
    id: "post-id",
    filename: "2024-01-01-post-title.md",
    title: "Post Title",
    date: "2024-01-01",
    category: "Technology",
    excerpt: "Brief description of the post"
  }
]
```

#### System Information (Neofetch Display)
```typescript
system: {
  os: "Arch Linux",
  kernel: "6.16.7-arch1-1",
  uptime: "2 days, 4 hours",
  shell: "zsh 5.9",
  terminal: "alacritty",
  cpu: "AMD Ryzen 9 5900X (24) @ 3.7GHz",
  gpu: "NVIDIA GeForce RTX 3080",
  memory: "32GB DDR4 @ 3600MHz"
}
```

#### Skills
```typescript
skills: [
  {
    category: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
  },
  {
    category: "Backend",
    skills: ["Node.js", "Python", "PostgreSQL", "Redis"]
  }
]
```

### 3. Feature Flags

Enable or disable features in `portfolio.config.ts`:

```typescript
features: {
  blog: true,        // Enable/disable blog section
  projects: true,    // Enable/disable projects section
  contact: true,     // Enable/disable contact form
  about: true,       // Enable/disable about section
  neofetch: true    // Enable/disable neofetch tile
}
```

## Customization Examples

### Example 1: Minimal Portfolio

For a minimal setup with just projects:

```typescript
// config/portfolio.config.ts
features: {
  blog: false,
  projects: true,
  contact: false,
  about: true,
  neofetch: false
}
```

### Example 2: Blog-Focused Site

For a blog-focused configuration:

```typescript
// config/portfolio.config.ts
features: {
  blog: true,
  projects: false,
  contact: true,
  about: true,
  neofetch: true
}
```

### Example 3: Custom Theme Colors

Override the default Tokyo Night theme:

```env
# .env.local
NEXT_PUBLIC_PRIMARY_COLOR="#00ff00"
NEXT_PUBLIC_ACCENT_COLOR="#ff00ff"
```

## Adding Custom Content

### Adding a New Project

1. Add the project to `config/portfolio.config.ts`:

```typescript
projects: [
  // ... existing projects
  {
    id: "my-new-project",
    name: "awesome-app.ts",
    filename: "awesome-app.ts",
    description: "An awesome application",
    techStack: ["React", "Node.js"],
    techStackDisplay: "React, Node.js, PostgreSQL",
    github: "https://github.com/user/awesome-app",
    demo: "https://awesome-app.com",
    status: "production"
  }
]
```

### Adding a Blog Post

1. Add the post metadata to `config/portfolio.config.ts`:

```typescript
blog: [
  // ... existing posts
  {
    id: "my-new-post",
    filename: "2024-01-20-my-new-post.md",
    title: "My New Blog Post",
    date: "2024-01-20",
    category: "Tutorial",
    excerpt: "Learn something new today"
  }
]
```

2. Create the actual blog content file if using MDX (optional, for future implementation)

## Advanced Configuration

### Custom ASCII Art

You can customize the ASCII art shown in the neofetch tile by modifying `components/RicedLayout/archAscii.ts`.

### Custom System Info Fields

Add custom fields to the system info:

```typescript
system: {
  // ... standard fields
  customField: "Custom Value",
  editor: "Neovim",
  wm: "Hyprland"
}
```

## Deployment

When deploying to production:

1. Ensure all environment variables are set in your hosting platform
2. Build the project: `npm run build`
3. The configuration is compiled at build time for optimal performance

## Troubleshooting

### Configuration Not Updating

- Restart the development server after changing `.env.local`
- Clear the `.next` cache: `rm -rf .next`

### Type Errors

- Ensure all required fields in `config/types.ts` are populated
- Run `npm run typecheck` to validate configuration

### Missing Data

- Check that environment variables are properly prefixed with `NEXT_PUBLIC_`
- Verify the configuration is exported correctly from `portfolio.config.ts`

## Contributing

When contributing to this project:

1. Do not commit `.env.local` or personal configuration
2. Update `.env.example` if adding new environment variables
3. Update this documentation for new configuration options
4. Ensure type safety by updating `config/types.ts`

## License

This configuration system is part of the open-source portfolio template. Feel free to customize and use for your own portfolio!