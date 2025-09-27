import { PortfolioConfig } from './types';

// Main portfolio configuration
// Replace values with your own information
export const portfolioConfig: PortfolioConfig = {
  personal: {
    name: process.env.NEXT_PUBLIC_NAME || "Your Name",
    username: process.env.NEXT_PUBLIC_USERNAME || "username",
    title: process.env.NEXT_PUBLIC_TITLE || "Full Stack Developer",
    subtitle: process.env.NEXT_PUBLIC_SUBTITLE || "Building modern web applications",
    email: process.env.NEXT_PUBLIC_EMAIL || "your.email@example.com",
    location: process.env.NEXT_PUBLIC_LOCATION || "Your Location",
    bio: {
      short: "Full Stack Developer with expertise in modern web technologies and a passion for creating exceptional user experiences.",
      long: `Welcome! I'm a passionate developer with a deep enthusiasm for building modern,
      performant, and aesthetically pleasing applications. I specialize in crafting clean,
      minimalist interfaces that embody the power and elegance of modern development environments.

      This site serves as a portfolio showcasing my work and experiments. Feel free to explore
      my projects and articles via the navigation panel.`,
      homeDescription: "Navigate through the file tree on the left to explore my portfolio. Each project showcases my expertise in modern web development, system design, and creative problem solving.",
      currentFocus: "Currently exploring the intersection of terminal aesthetics and modern web development, creating experiences that blur the line between desktop environments and web applications. Always seeking new challenges that push the boundaries of what's possible in the browser."
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
      category: "Technical Skills",
      skills: ["React & Next.js", "TypeScript & JavaScript", "Tailwind CSS", "Node.js & Python", "PostgreSQL & Neo4j"]
    },
    {
      category: "Blockchain",
      skills: ["Solidity", "Hardhat", "Foundry", "OpenZeppelin", "Chainlink"]
    },
    {
      category: "Interests",
      skills: ["Linux Ricing & Hyprland", "Terminal UIs", "Open Source Development", "System Architecture", "Performance Optimization"]
    }
  ],

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
    os: "Arch Linux",
    kernel: "6.16.7-arch1-1",
    uptime: "2 days, 4 hours",
    shell: "zsh 5.9",
    terminal: "alacritty",
    cpu: "AMD Ryzen 9 5900X (24) @ 3.7GHz",
    gpu: "NVIDIA GeForce RTX 3080",
    memory: "32GB DDR4 @ 3600MHz"
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