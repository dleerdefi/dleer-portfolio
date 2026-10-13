import { PortfolioConfig, SocialInfo } from './types';

/** A neofetch row, or nothing when its URL is unset or empty; the handle defaults to the URL's last part */
function social(platform: string, url?: string, username?: string, followers?: string): SocialInfo | undefined {
  if (!url) return undefined;
  return { platform, url, username: username || url.replace(/\/+$/, '').split('/').pop() || url, followers: followers || undefined };
}

// Main portfolio configuration
// Replace values with your own information
export const portfolioConfig: PortfolioConfig = {
  personal: {
    name: process.env.NEXT_PUBLIC_NAME || "Your Name",
    username: process.env.NEXT_PUBLIC_USERNAME || "username",
    greeting: process.env.NEXT_PUBLIC_GREETING || "Hi, I'm [Your Name]",
    title: process.env.NEXT_PUBLIC_TITLE || "Your Professional Title",
    subtitle: process.env.NEXT_PUBLIC_SUBTITLE || "A brief description of what you do",
    email: process.env.NEXT_PUBLIC_EMAIL || "your.email@example.com",
    contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com",
    location: process.env.NEXT_PUBLIC_LOCATION || "Your City, Country",
    // The photo in the desktop neofetch tile (components/home/HeroPhoto.tsx), shown while
    // NEXT_PUBLIC_PROFILE_PHOTO is set. Its files are cropped from public/images/profile by
    // scripts/build-hero-photo.mjs; without it the tile keeps the ASCII logo.
    profilePhoto: process.env.NEXT_PUBLIC_PROFILE_PHOTO
      ? { alt: process.env.NEXT_PUBLIC_PROFILE_ALT || "Profile photo" }
      : undefined,
    bio: {
      // The home view: a one-line pitch, then a two or three sentence bio under it
      intro: process.env.NEXT_PUBLIC_BIO_INTRO ||
        "Brief introduction about yourself and what you do.",

      summary: process.env.NEXT_PUBLIC_BIO_SUMMARY ||
        "Two or three sentences: what you built, and what you did before.",

      // Legacy fields for compatibility
      short: process.env.NEXT_PUBLIC_BIO_SHORT ||
        "A concise professional bio that describes your role, expertise, and what makes your work unique.",

      long: process.env.NEXT_PUBLIC_BIO_LONG ||
        "A more detailed bio that provides context about your professional journey, key projects, and the impact of your work.",

      // Static fields (customize directly here)
      homeDescription: "Navigate through the file tree on the left to explore my portfolio. Each project showcases expertise in modern development.",
      currentFocus: "Currently exploring new technologies and building innovative solutions."
    }
  },

  social: [
    {
      platform: "GitHub",
      url: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/yourusername",
      username: process.env.NEXT_PUBLIC_GITHUB_USERNAME || "@yourusername"
    },
    {
      platform: "LinkedIn",
      url: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/yourprofile",
      username: process.env.NEXT_PUBLIC_LINKEDIN_USERNAME || "yourprofile"
    },
    {
      platform: "Twitter",
      url: process.env.NEXT_PUBLIC_TWITTER_URL || "https://x.com/yourusername",
      username: process.env.NEXT_PUBLIC_TWITTER_USERNAME || "@yourusername"
    },
    {
      platform: "Telegram",
      url: process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/yourusername",
      username: process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "@yourusername"
    }
  ],

  // The neofetch rows. A row shows only when its URL is set; followers is optional text after it
  system: {
    github: social("GitHub", process.env.NEXT_PUBLIC_GITHUB_URL, process.env.NEXT_PUBLIC_GITHUB_HANDLE),
    twitter: social("X", process.env.NEXT_PUBLIC_TWITTER_URL, process.env.NEXT_PUBLIC_TWITTER_HANDLE, process.env.NEXT_PUBLIC_TWITTER_FOLLOWERS),
    linkedin: social("LinkedIn", process.env.NEXT_PUBLIC_LINKEDIN_URL, process.env.NEXT_PUBLIC_LINKEDIN_HANDLE),
    youtube: social("YouTube", process.env.NEXT_PUBLIC_YOUTUBE_URL, process.env.NEXT_PUBLIC_YOUTUBE_HANDLE),
    instagram: social("Instagram", process.env.NEXT_PUBLIC_INSTAGRAM_URL, process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE, process.env.NEXT_PUBLIC_INSTAGRAM_STATS),
    tiktok: social("TikTok", process.env.NEXT_PUBLIC_TIKTOK_URL, process.env.NEXT_PUBLIC_TIKTOK_HANDLE, process.env.NEXT_PUBLIC_TIKTOK_STATS)
  },

  seo: {
    title: process.env.NEXT_PUBLIC_SEO_TITLE || "Portfolio | Terminal Style",
    description: process.env.NEXT_PUBLIC_SEO_DESCRIPTION ||
      "A modern, terminal-inspired portfolio showcasing projects and expertise in web development and software engineering.",
    keywords: ["Web Development", "Software Engineering", "React", "TypeScript", "Node.js", "Full Stack", "Portfolio"],
    author: process.env.NEXT_PUBLIC_NAME || "Your Name",
    twitterHandle: process.env.NEXT_PUBLIC_TWITTER_USERNAME || "@username"
  },

  features: {
    // The blog's entry points (a polybar workspace, blog/ in the contents tree, a phone section).
    // On unless NEXT_PUBLIC_FEATURE_BLOG=false; dleer.ai sets false and keeps the posts as an
    // archive, reachable at their URLs and from the home page's writing link. Inlined at build time.
    blog: process.env.NEXT_PUBLIC_FEATURE_BLOG !== 'false',
    projects: true,
    contact: true,
    neofetch: true,
    // ~/lab: homelab telemetry and the honeypot threat map (docs/lab). Inlined at build time.
    lab: process.env.NEXT_PUBLIC_FEATURE_LAB === 'true'
  }
};

// Export a function to get the config (useful for server components)
export function getPortfolioConfig(): PortfolioConfig {
  return portfolioConfig;
}