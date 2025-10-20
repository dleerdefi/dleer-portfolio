import { PortfolioConfig } from './types';
import { projectsData } from './projects.config';
import { getImageUrl } from '@/lib/image-paths';

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
    contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "email@email.com",
    location: process.env.NEXT_PUBLIC_LOCATION || "Your Location",
    profilePhoto: {
      src: process.env.NEXT_PUBLIC_PROFILE_PHOTO || getImageUrl("profile/dleer-shinjuku.webp"),
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
        src: getImageUrl("profile/dleer-shinjuku-RF-DETR.webp"),
        exif: {
          location: "Shinjuku, Tokyo",
          model: "RF-DETR",
          task: "Object Detection"
        }
      }
    },
    bio: {
      // Structured bio for parallax sections (minimal version)
      intro: process.env.NEXT_PUBLIC_BIO_INTRO ||
        "Founder–engineer building AI memory with knowledge graphs.",

      leadership: process.env.NEXT_PUBLIC_BIO_LEADERSHIP ||
        "I enjoy shipping complex systems. Previously, I managed $63M in scope and led 12+ engineers on a $500M hospital campus build. Today I focus on LLM memory, scoring and ranking and agent-routing algorithms, and privacy-first data infrastructure.",

      // Personal tagline
      tagline: process.env.NEXT_PUBLIC_BIO_TAGLINE ||
        "Outside work: homelab, drones, travel.",

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
      url: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/dleerdefi",
      username: process.env.NEXT_PUBLIC_GITHUB_USERNAME || "@dleerdefi"
    },
    {
      platform: "LinkedIn",
      url: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/dleer",
      username: process.env.NEXT_PUBLIC_LINKEDIN_USERNAME || "dleer"
    },
    {
      platform: "Twitter",
      url: process.env.NEXT_PUBLIC_TWITTER_URL || "https://x.com/dleer_defi",
      username: process.env.NEXT_PUBLIC_TWITTER_USERNAME || "@dleer_defi"
    },
    {
      platform: "Telegram",
      url: process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/dleer",
      username: process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "@dleer"
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

  projects: projectsData,

  // Projects are now imported from projects.config.ts
  // Legacy projects_old array removed

  /*
  projects_old_removed: [
    // === Systems & Infrastructure (Hands-On Engineering) ===
    {
      id: "peak-ai-agent-stack",
      name: "Peak AI Agent Stack",
      filename: "peak-ai-agent-stack",
      description: "Multi-agent AI orchestration framework for complex workflows",
      overview: "Production-ready framework for orchestrating multiple AI agents with advanced state management, task routing, and error recovery. Built to handle complex, multi-step workflows with automatic fallbacks and parallel execution.",
      features: [
        "Dynamic agent orchestration with dependency resolution",
        "Built-in state persistence and recovery",
        "Parallel task execution with resource management",
        "Comprehensive error handling and retry logic",
        "Real-time monitoring and observability"
      ],
      techStack: ["Python", "LangChain", "Redis", "FastAPI", "PostgreSQL"],
      techStackDisplay: "Python, LangChain, Redis, FastAPI, PostgreSQL",
      github: "https://github.com/dleerdefi/peak-ai-agent-stack",
      status: "production",
      category: "systems",
      role: "built",
      metrics: [
        "Powers 10+ production AI applications",
        "Handles 100K+ agent interactions daily",
        "99.9% uptime in production"
      ],
      outcome: "Created scalable infrastructure for AI agent coordination"
    },
    {
      id: "consumer-score-engine",
      name: "Consumer Score Engine",
      filename: "consumer-score-engine",
      description: "Distributed scoring pipeline for DeFi user behavior analysis",
      overview: "High-performance data pipeline that processes on-chain and social data to generate user scores. Built with microservices architecture for scalability and real-time processing capabilities.",
      features: [
        "Real-time data ingestion from multiple sources",
        "Graph-based relationship modeling",
        "ML-powered scoring algorithms",
        "Horizontal scaling with Kafka",
        "Sub-second query response times"
      ],
      techStack: ["Python", "Kafka", "Neo4j", "Redis", "scikit-learn"],
      techStackDisplay: "Python, Kafka, Neo4j, Redis, scikit-learn",
      status: "production",
      category: "systems",
      role: "built",
      metrics: [
        "Processed 2M+ transactions daily",
        "Analyzed 30K+ user accounts",
        "Sub-100ms scoring latency"
      ],
      outcome: "Enabled real-time user behavior analysis at scale"
    },
    {
      id: "token-economy-simulator",
      name: "Token Economy Simulator",
      filename: "token-economy-simulator",
      description: "Agent-based simulator for token economy modeling",
      overview: "Sophisticated simulation framework that models complex token economies using agent-based modeling. Used by major foundations and market makers for strategic planning.",
      features: [
        "Agent-based market simulation",
        "Monte Carlo scenario analysis",
        "Liquidity pool dynamics modeling",
        "Governance token distribution optimization",
        "Visual analytics dashboard"
      ],
      techStack: ["Python", "NumPy", "Pandas", "Mesa", "Plotly"],
      techStackDisplay: "Python, NumPy, Pandas, Mesa, Plotly",
      status: "production",
      category: "systems",
      role: "built",
      metrics: [
        "Modeled $300M+ in token economies",
        "Used by 5 major crypto foundations",
        "10,000+ simulation runs completed"
      ],
      outcome: "Informed strategic decisions for major DeFi protocols"
    },
    {
      id: "llm-security-auditor",
      name: "LLM Security Auditor",
      filename: "llm-security-auditor",
      description: "Automated security analysis tool for LLM applications",
      overview: "Comprehensive security testing framework specifically designed for LLM-powered applications. Identifies vulnerabilities, prompt injection risks, and data leakage issues.",
      features: [
        "Automated prompt injection testing",
        "Data exfiltration detection",
        "Model behavior analysis",
        "Compliance checking (GDPR, CCPA)",
        "Detailed vulnerability reporting"
      ],
      techStack: ["Python", "LangChain", "OWASP ZAP", "Burp Suite API"],
      techStackDisplay: "Python, LangChain, OWASP ZAP, Burp Suite API",
      github: "https://github.com/dleerdefi/llm-security-auditor",
      status: "production",
      category: "systems",
      role: "built",
      metrics: [
        "Identified 50+ critical vulnerabilities",
        "Used by 20+ AI companies",
        "Reduced security review time by 80%"
      ],
      outcome: "Made LLM applications more secure and compliant"
    },

    // === Product Design & Leadership (Architectural / Strategic) ===
    {
      id: "kinsu-savings",
      name: "Kinsu Savings App",
      filename: "kinsu-savings",
      description: "DeFi savings aggregator built on ConsumerFi protocol",
      overview: "Led the product vision and execution for a consumer-friendly DeFi savings application. Architected the system design and coordinated cross-functional teams from concept to launch.",
      features: [
        "Automated yield optimization",
        "Multi-chain portfolio management",
        "Risk assessment dashboard",
        "One-click diversification strategies",
        "Mobile-first responsive design"
      ],
      techStack: ["React", "Web3.js", "Solidity", "The Graph", "Node.js"],
      techStackDisplay: "React, Web3.js, Solidity, The Graph, Node.js",
      demo: "https://kinsu.fi",
      status: "production",
      category: "product",
      role: "led",
      metrics: [
        "$10M+ TVL at peak",
        "5,000+ active users",
        "4.8/5 user satisfaction score"
      ],
      outcome: "Simplified DeFi savings for mainstream users"
    },
    {
      id: "play-to-airdrop",
      name: "Play-to-Airdrop Campaign System",
      filename: "play-to-airdrop",
      description: "Gamified user acquisition and retention platform",
      overview: "Designed and led the development of a gamified campaign system that increased protocol engagement through quest-based rewards and social mechanics.",
      features: [
        "Dynamic quest generation",
        "Social referral tracking",
        "Anti-sybil protection",
        "Real-time leaderboards",
        "Automated reward distribution"
      ],
      techStack: ["TypeScript", "Next.js", "PostgreSQL", "Redis", "Chainlink"],
      techStackDisplay: "TypeScript, Next.js, PostgreSQL, Redis, Chainlink",
      status: "production",
      category: "product",
      role: "architected",
      metrics: [
        "50K+ participants",
        "3x increase in protocol TVL",
        "85% user retention after 30 days"
      ],
      outcome: "Revolutionized Web3 user acquisition strategies"
    },

    // === Experimental & Home Lab Projects ===
    {
      id: "rinai-multimodal-vtuber",
      name: "RinAI Multimodal VTuber",
      filename: "rinai-multimodal-vtuber",
      description: "Real-time AI-powered virtual avatar with multimodal interaction",
      overview: "Experimental project combining computer vision, NLP, and real-time rendering to create an interactive AI VTuber. Features emotion recognition, gesture control, and dynamic responses.",
      features: [
        "Real-time facial tracking and mapping",
        "Voice synthesis with emotion",
        "Gesture recognition and response",
        "Live streaming integration",
        "Custom avatar rendering pipeline"
      ],
      techStack: ["Python", "PyTorch", "OpenCV", "Unity", "WebRTC"],
      techStackDisplay: "Python, PyTorch, OpenCV, Unity, WebRTC",
      github: "https://github.com/dleerdefi/rinai-multimodal-vtuber",
      videoUrl: "https://youtube.com/watch?v=example1",
      status: "development",
      category: "experimental",
      role: "built",
      metrics: [
        "10ms motion capture latency",
        "95% emotion detection accuracy",
        "1000+ GitHub stars"
      ],
      outcome: "Pushed boundaries of real-time AI interaction"
    },
    {
      id: "agent-state-machine",
      name: "Agent State Machine",
      filename: "agent-state-machine",
      description: "Finite state machine framework for AI agent behavior",
      overview: "Lightweight framework for managing complex AI agent behaviors using finite state machines. Provides visual debugging tools and behavior tree integration.",
      features: [
        "Visual state machine editor",
        "Behavior tree integration",
        "Real-time state debugging",
        "Plugin architecture",
        "Performance monitoring"
      ],
      techStack: ["TypeScript", "React", "D3.js", "Node.js"],
      techStackDisplay: "TypeScript, React, D3.js, Node.js",
      github: "https://github.com/dleerdefi/agent-state-machine",
      demo: "https://agent-fsm-demo.vercel.app",
      status: "production",
      category: "experimental",
      role: "built",
      metrics: [
        "Used in 50+ AI projects",
        "500+ GitHub stars",
        "Active community of 100+ developers"
      ],
      outcome: "Simplified complex AI behavior management"
    },
    {
      id: "home-lab-infrastructure",
      name: "Home Lab Network",
      filename: "home-lab-network",
      description: "Enterprise-grade home lab with GPU cluster and automation",
      overview: "Designed and deployed a sophisticated home lab infrastructure featuring multiple servers, VLAN segmentation, GPU compute cluster, and comprehensive automation.",
      features: [
        "Proxmox virtualization cluster",
        "VLAN-segmented security zones",
        "4-node GPU compute cluster",
        "Automated backup pipelines",
        "Self-hosted AI inference endpoints"
      ],
      techStack: ["Proxmox", "pfSense", "Kubernetes", "Ansible", "TrueNAS"],
      techStackDisplay: "Proxmox, pfSense, Kubernetes, Ansible, TrueNAS",
      videoUrl: "https://youtube.com/watch?v=example2",
      blogUrl: "/blog/home-lab-setup",
      status: "production",
      category: "experimental",
      role: "built",
      metrics: [
        "99.99% uptime",
        "50TB storage capacity",
        "100+ containers running"
      ],
      outcome: "Created production-grade infrastructure for experiments"
    },
    {
      id: "rin-streams",
      name: "Rin Streams",
      filename: "rin-streams",
      description: "Streaming infrastructure for AI-powered content generation",
      overview: "Real-time streaming platform that combines AI content generation with live broadcasting. Features automatic scene switching, chat interaction, and content moderation.",
      features: [
        "AI-driven content generation",
        "Automatic scene management",
        "Chat sentiment analysis",
        "Real-time content moderation",
        "Multi-platform streaming"
      ],
      techStack: ["Node.js", "FFmpeg", "OBS WebSocket", "TensorFlow.js"],
      techStackDisplay: "Node.js, FFmpeg, OBS WebSocket, TensorFlow.js",
      github: "https://github.com/dleerdefi/rin-streams",
      status: "development",
      category: "experimental",
      role: "built",
      metrics: [
        "24/7 autonomous streaming",
        "1000+ concurrent viewers",
        "90% positive engagement rate"
      ],
      outcome: "Automated content creation and broadcasting"
    }
  ],
  */

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
      username: process.env.NEXT_PUBLIC_LINKEDIN_HANDLE || "David Leer",
      url: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/dleer"
    },
    youtube: {
      platform: "YouTube",
      username: process.env.NEXT_PUBLIC_YOUTUBE_HANDLE || "dleer tech",
      url: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com/@dleer_defi"
    },
    instagram: {
      platform: "Instagram",
      username: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "theferalchef",
      url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/theferalchef5",
      followers: process.env.NEXT_PUBLIC_INSTAGRAM_STATS || "5M views"
    },
    tiktok: {
      platform: "TikTok",
      username: process.env.NEXT_PUBLIC_TIKTOK_HANDLE || "theferalchef",
      url: process.env.NEXT_PUBLIC_TIKTOK_URL || "https://tiktok.com/@theferalchef5",
      followers: process.env.NEXT_PUBLIC_TIKTOK_STATS || "3M views"
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

  theme: {
    wallpaper: process.env.NEXT_PUBLIC_WALLPAPER || getImageUrl("rice-wallpaper.jpg"),
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