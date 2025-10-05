import { PortfolioConfig } from './types';

// Main portfolio configuration
// Replace values with your own information
export const portfolioConfig: PortfolioConfig = {
  personal: {
    name: process.env.NEXT_PUBLIC_NAME || "David Leer",
    username: process.env.NEXT_PUBLIC_USERNAME || "dleer",
    greeting: process.env.NEXT_PUBLIC_GREETING || "Hi, I'm David Leer",
    title: process.env.NEXT_PUBLIC_TITLE || "Founder & Software Engineer",
    subtitle: process.env.NEXT_PUBLIC_SUBTITLE || "Building next-generation AI memory systems",
    email: process.env.NEXT_PUBLIC_EMAIL || "your.email@example.com",
    location: process.env.NEXT_PUBLIC_LOCATION || "Your Location",
    bio: {
      // Structured bio for parallax sections
      intro: process.env.NEXT_PUBLIC_BIO_INTRO ||
        "A founder and software engineer building the next generation of AI memory. My work connects Large Language Models with knowledge graphs, creating systems capable of context-aware reasoning.",

      experience: process.env.NEXT_PUBLIC_BIO_EXPERIENCE ||
        "As Chief Product Officer of ConsumerFi, I architected the protocol's core three-layer system. I also developed proprietary agent-based simulators that modeled token economies over $300M, directly guiding strategy for foundations and market makers.",

      leadership: process.env.NEXT_PUBLIC_BIO_LEADERSHIP ||
        "My technical leadership is built on a foundation of shipping complex systems at scale. I previously managed $63M in scope and led teams of 50+ engineers to deliver a $500M hospital campus. Today, my focus is on advanced LLM memory and scalable, user-owned data infrastructure.",

      // Personal tagline
      tagline: process.env.NEXT_PUBLIC_BIO_TAGLINE ||
        "Outside of work, I experiment in my homelab, fly drones, and travel.",

      // Legacy fields for compatibility
      short: process.env.NEXT_PUBLIC_BIO_SHORT ||
        "A founder and software engineer building the next generation of AI memory. My work connects Large Language Models with knowledge graphs, creating systems capable of context-aware reasoning.",

      long: process.env.NEXT_PUBLIC_BIO_LONG ||
        "As Chief Product Officer of ConsumerFi, I architected the protocol's core three-layer system. I also developed proprietary agent-based simulators that modeled token economies over $300M, directly guiding strategy for foundations and market makers.",

      // Keep existing fields for other sections
      homeDescription: "Navigate through the file tree on the left to explore my portfolio. Each project showcases my expertise in modern web development, system design, and creative problem solving.",
      currentFocus: "Currently exploring the intersection of terminal aesthetics and modern web development, creating experiences that blur the line between desktop environments and web applications."
    }
  },

  social: [
    {
      platform: "GitHub",
      url: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/username",
      username: process.env.NEXT_PUBLIC_GITHUB_USERNAME || "@username"
    },
    {
      platform: "LinkedIn",
      url: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/username",
      username: process.env.NEXT_PUBLIC_LINKEDIN_USERNAME || "username"
    },
    {
      platform: "Twitter",
      url: process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/username",
      username: process.env.NEXT_PUBLIC_TWITTER_USERNAME || "@username"
    },
    {
      platform: "Telegram",
      url: process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/username",
      username: process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "@username"
    }
  ],

  skills: [
    {
      category: "Frontend",
      skills: ["React & Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Responsive Design"]
    },
    {
      category: "Backend",
      skills: ["Node.js", "Python", "PostgreSQL", "Neo4j", "REST APIs"]
    },
    {
      category: "Blockchain",
      skills: ["Solidity", "Hardhat", "Foundry", "OpenZeppelin", "Chainlink"]
    },
    {
      category: "AI & Data",
      skills: ["LangChain", "Knowledge Graphs", "Vector DBs", "RAG Systems", "Token Simulators"]
    }
  ],

  technologies: {
    items: [
      { name: "Python", icon: "SiPython" },
      { name: "TypeScript", icon: "SiTypescript" },
      { name: "React", icon: "SiReact" },
      { name: "Tailwind CSS", icon: "SiTailwindcss" },
      { name: "PostgreSQL", icon: "SiPostgresql" },
      { name: "Neo4j", icon: "SiNeo4J" },  // Fixed: capital J
      { name: "Redis", icon: "SiRedis" },
      { name: "Kafka", icon: "SiApachekafka" },
      { name: "Docker", icon: "SiDocker" }
    ]
  },

  projects: [
    {
      id: "project-one",
      name: "awesome-project.ts",
      filename: "awesome-project.ts",
      description: "Full-stack web application",
      overview: "This project demonstrates advanced development practices with focus on security, efficiency, and scalability. Implemented using modern development tools and following industry best practices.",
      features: [
        "Fully tested and documented codebase",
        "Optimized implementations",
        "Comprehensive documentation",
        "Production-ready deployment"
      ],
      techStack: ["TypeScript", "React", "Node.js", "PostgreSQL"],
      techStackDisplay: "TypeScript, React, Node.js, PostgreSQL",
      github: "https://github.com/example/defi-lending",
      demo: "https://defi-lending.example.com",
      status: "production"
    },
    {
      id: "project-two",
      name: "api-service.py",
      filename: "api-service.py",
      description: "RESTful API microservice",
      techStack: ["Python", "FastAPI", "Redis", "Docker"],
      techStackDisplay: "Python, FastAPI, Redis, Docker",
      github: "https://github.com/example/neo4j-rag",
      status: "production"
    },
    {
      id: "project-three",
      name: "data-viz.ts",
      filename: "data-viz.ts",
      description: "Interactive data visualization",
      techStack: ["TypeScript", "React", "D3.js", "Tailwind"],
      techStackDisplay: "TypeScript, React, D3.js, Tailwind CSS",
      github: "https://github.com/example/token-model",
      demo: "https://token-model.example.com",
      status: "development"
    },
    {
      id: "project-four",
      name: "mobile-app.tsx",
      filename: "mobile-app.tsx",
      description: "Cross-platform mobile application",
      techStack: ["React Native", "TypeScript", "Expo", "Firebase"],
      techStackDisplay: "React Native, TypeScript, Expo, Firebase",
      github: "https://github.com/example/amm-opt",
      status: "production"
    }
  ],

  blog: [
    {
      id: "post-one",
      filename: "2024-01-15-modern-web-dev.md",
      title: "Modern Web Development Best Practices",
      date: "2024-01-15",
      category: "Web Development",
      excerpt: "Exploring current best practices and patterns in modern web development.",
      content: `Detailed explanation of the topic, with code examples and technical insights that demonstrate deep understanding of the subject matter.

## Introduction
Modern web development has evolved significantly over the past few years, with new frameworks, tools, and best practices emerging regularly.

## Key Concepts
Here we explore the fundamental concepts that drive modern web applications...

## Example Implementation
\`\`\`javascript
// Example code snippet
const Example = () => {
  return <div>Modern Web Component</div>;
};
\`\`\`

## Conclusion
Summary of key points and takeaways from the article.`
    },
    {
      id: "post-two",
      filename: "2024-01-10-system-design.md",
      title: "Scalable System Design Patterns",
      date: "2024-01-10",
      category: "Architecture",
      excerpt: "Deep dive into designing scalable and maintainable software systems."
    }
  ],

  system: {
    github: {
      platform: "GitHub",
      username: process.env.NEXT_PUBLIC_GITHUB_HANDLE || "dleerdefi",
      url: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/dleerdefi"
    },
    twitter: {
      platform: "X",
      username: process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@dleer_defi",
      url: process.env.NEXT_PUBLIC_TWITTER_URL || "https://x.com/dleer_defi",
      followers: process.env.NEXT_PUBLIC_TWITTER_FOLLOWERS || "22,000 Followers"
    },
    linkedin: {
      platform: "LinkedIn",
      username: process.env.NEXT_PUBLIC_LINKEDIN_HANDLE || "dleer",
      url: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/dleer"
    },
    youtube: {
      platform: "YouTube",
      username: process.env.NEXT_PUBLIC_YOUTUBE_HANDLE || "@dleer_defi",
      url: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com/@dleer_defi"
    },
    instagram: {
      platform: "Instagram",
      username: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "feralchef5",
      url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/feralchef5",
      followers: process.env.NEXT_PUBLIC_INSTAGRAM_STATS || "5M views"
    },
    tiktok: {
      platform: "TikTok",
      username: process.env.NEXT_PUBLIC_TIKTOK_HANDLE || "feralchef5",
      url: process.env.NEXT_PUBLIC_TIKTOK_URL || "https://tiktok.com/@feralchef5",
      followers: process.env.NEXT_PUBLIC_TIKTOK_STATS || "3M views"
    }
  },

  seo: {
    title: process.env.NEXT_PUBLIC_SEO_TITLE || "Portfolio | Terminal Style",
    description: process.env.NEXT_PUBLIC_SEO_DESCRIPTION ||
      "A modern, terminal-inspired portfolio showcasing projects and expertise in web development and software engineering.",
    keywords: ["Web Development", "Software Engineering", "React", "TypeScript", "Node.js", "Full Stack", "Portfolio"],
    author: process.env.NEXT_PUBLIC_NAME || "Your Name",
    ogImage: process.env.NEXT_PUBLIC_OG_IMAGE || "/og-image.png",
    twitterHandle: process.env.NEXT_PUBLIC_TWITTER_USERNAME || "@username"
  },

  theme: {
    wallpaper: process.env.NEXT_PUBLIC_WALLPAPER || "/images/rice-wallpaper.jpg",
    // Users can override theme colors if desired
    primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR,
    accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR
  },

  uiStrings: {
    buttons: {
      viewGithub: "View on GitHub",
      liveDemo: "Live Demo",
      sendMessage: "Send Message"
    },
    placeholders: {
      name: "John Doe",
      email: "john@example.com",
      message: "Your message here..."
    },
    headers: {
      about: "About Me",
      overview: "Overview",
      techStack: "Technical Stack",
      keyFeatures: "Key Features",
      currentFocus: "Current Focus",
      introduction: "Introduction",
      conclusion: "Conclusion",
      contact: "Contact"
    },
    labels: {
      name: "Name:",
      email: "Email:",
      message: "Message:"
    },
    navigation: {
      rootPath: "Contents",
      tabHint: "Tab to navigate between tiles"
    },
    tips: {
      title: "Quick Tips:",
      items: [
        "• Click navigation items to view content",
        "• Projects contain detailed technical information",
        "• Blog posts share insights and tutorials"
      ]
    },
    welcomeAscii: ` ██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗
 ██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝
 ██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗
 ██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝
 ╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗
  ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝`
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