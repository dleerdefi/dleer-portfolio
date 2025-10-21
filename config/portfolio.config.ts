import { PortfolioConfig } from './types';
import { projectsData } from './projects.config';
import { getImageUrl } from '@/lib/image-paths';

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
    profilePhoto: {
      src: process.env.NEXT_PUBLIC_PROFILE_PHOTO || getImageUrl("profile/placeholder.webp"),
      alt: process.env.NEXT_PUBLIC_PROFILE_ALT || "Profile photo",
      width: 1536,
      height: 2048,
      // EXIF data for photography theme (optional - customize via env vars)
      exif: {
        location: process.env.NEXT_PUBLIC_PHOTO_LOCATION || "Location",
        aperture: process.env.NEXT_PUBLIC_PHOTO_APERTURE || "f/1.7",
        shutter: process.env.NEXT_PUBLIC_PHOTO_SHUTTER || "1/1000s",
        iso: process.env.NEXT_PUBLIC_PHOTO_ISO || "100"
      },
      // Detection variant for AI/ML theme (optional - set NEXT_PUBLIC_PROFILE_DETECTION)
      detectionVariant: {
        src: process.env.NEXT_PUBLIC_PROFILE_DETECTION || getImageUrl("profile/placeholder-detection.webp"),
        exif: {
          location: process.env.NEXT_PUBLIC_PHOTO_LOCATION || "Location",
          model: "RF-DETR",
          task: "Object Detection"
        }
      }
    },
    bio: {
      // Structured bio for parallax sections (minimal version)
      intro: process.env.NEXT_PUBLIC_BIO_INTRO ||
        "Brief introduction about yourself and what you do.",

      leadership: process.env.NEXT_PUBLIC_BIO_LEADERSHIP ||
        "Your professional background and expertise. Highlight key accomplishments and areas of focus.",

      // Personal tagline
      tagline: process.env.NEXT_PUBLIC_BIO_TAGLINE ||
        "What you enjoy outside of work.",

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

  technologies: {
    items: [
      { name: "Python", icon: "SiPython" },
      { name: "TypeScript", icon: "SiTypescript" },
      { name: "React", icon: "SiReact" },
      { name: "Tailwind CSS", icon: "SiTailwindcss" },
      { name: "PostgreSQL", icon: "SiPostgresql" },
      { name: "Neo4j", icon: "SiNeo4J" },
      { name: "Redis", icon: "SiRedis" },
      { name: "Kafka", icon: "SiApachekafka" },
      { name: "Docker", icon: "SiDocker" }
    ]
  },

  projects: projectsData,

  system: {
    github: {
      platform: "GitHub",
      username: process.env.NEXT_PUBLIC_GITHUB_HANDLE || "username",
      url: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/username"
    },
    twitter: {
      platform: "X",
      username: process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@username",
      url: process.env.NEXT_PUBLIC_TWITTER_URL || "https://x.com/username",
      followers: process.env.NEXT_PUBLIC_TWITTER_FOLLOWERS || "N/A"
    },
    linkedin: {
      platform: "LinkedIn",
      username: process.env.NEXT_PUBLIC_LINKEDIN_HANDLE || "Your Name",
      url: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/yourprofile"
    },
    youtube: {
      platform: "YouTube",
      username: process.env.NEXT_PUBLIC_YOUTUBE_HANDLE || "Your Channel",
      url: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com/@username"
    },
    instagram: {
      platform: "Instagram",
      username: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "username",
      url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/username",
      followers: process.env.NEXT_PUBLIC_INSTAGRAM_STATS || "N/A"
    },
    tiktok: {
      platform: "TikTok",
      username: process.env.NEXT_PUBLIC_TIKTOK_HANDLE || "username",
      url: process.env.NEXT_PUBLIC_TIKTOK_URL || "https://tiktok.com/@username",
      followers: process.env.NEXT_PUBLIC_TIKTOK_STATS || "N/A"
    }
  },

  seo: {
    title: process.env.NEXT_PUBLIC_SEO_TITLE || "Portfolio | Terminal Style",
    description: process.env.NEXT_PUBLIC_SEO_DESCRIPTION ||
      "A modern, terminal-inspired portfolio showcasing projects and expertise in web development and software engineering.",
    keywords: ["Web Development", "Software Engineering", "React", "TypeScript", "Node.js", "Full Stack", "Portfolio"],
    author: process.env.NEXT_PUBLIC_NAME || "Your Name",
    ogImage: process.env.NEXT_PUBLIC_OG_IMAGE || getImageUrl("og-image.png"),
    twitterHandle: process.env.NEXT_PUBLIC_TWITTER_USERNAME || "@username"
  },

  features: {
    blog: true,
    projects: true,
    contact: true,
    about: true,
    neofetch: true
  }
};

// Export a function to get the config (useful for server components)
export function getPortfolioConfig(): PortfolioConfig {
  return portfolioConfig;
}