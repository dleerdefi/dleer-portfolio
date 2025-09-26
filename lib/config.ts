import { portfolioConfig, getPortfolioConfig } from '@/config/portfolio.config';
import { PortfolioConfig, Project, BlogPost, SocialLink, UIStrings } from '@/config/types';

// Configuration utilities and helpers

/**
 * Get the full portfolio configuration
 */
export function usePortfolioConfig(): PortfolioConfig {
  return getPortfolioConfig();
}

/**
 * Get personal information from config
 */
export function usePersonalInfo() {
  const config = usePortfolioConfig();
  return config.personal;
}

/**
 * Get skills from config
 */
export function useSkills() {
  const config = usePortfolioConfig();
  return config.skills;
}

/**
 * Get social links from config
 */
export function useSocialLinks(): SocialLink[] {
  const config = usePortfolioConfig();
  return config.social;
}

/**
 * Get projects from config
 */
export function useProjects(): Project[] {
  const config = usePortfolioConfig();
  return config.projects;
}

/**
 * Get a specific project by ID
 */
export function useProject(id: string): Project | undefined {
  const projects = useProjects();
  return projects.find(p => p.id === id);
}

/**
 * Get blog posts from config
 */
export function useBlogPosts(): BlogPost[] {
  const config = usePortfolioConfig();
  return config.blog;
}

/**
 * Get a specific blog post by ID
 */
export function useBlogPost(id: string): BlogPost | undefined {
  const posts = useBlogPosts();
  return posts.find(p => p.id === id);
}

/**
 * Get system information for neofetch display
 */
export function useSystemInfo() {
  const config = usePortfolioConfig();
  return config.system;
}

/**
 * Get SEO configuration
 */
export function useSEOConfig() {
  const config = usePortfolioConfig();
  return config.seo;
}

/**
 * Get theme configuration
 */
export function useThemeConfig() {
  const config = usePortfolioConfig();
  return config.theme || {};
}

/**
 * Get feature flags
 */
export function useFeatureFlags() {
  const config = usePortfolioConfig();
  return config.features || {
    blog: true,
    projects: true,
    contact: true,
    about: true,
    neofetch: true
  };
}

/**
 * Get UI strings configuration
 */
export function useUIStrings(): UIStrings {
  const config = usePortfolioConfig();
  return config.uiStrings || {
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
      about: "// About Me",
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
      rootPath: "~/portfolio",
      tabHint: "Tab to navigate between tiles"
    },
    tips: {
      title: "Quick Tips:",
      items: [
        "• Click navigation items to view content",
        "• Projects contain detailed technical information",
        "• Blog posts share insights and tutorials"
      ]
    }
  };
}

/**
 * Format username for display (e.g., "dleer@portfolio")
 */
export function formatUsername(): string {
  const { username } = usePersonalInfo();
  return `${username}@portfolio`;
}

/**
 * Get ASCII art by ID
 */
export function useASCIIArt(id: string) {
  const config = usePortfolioConfig();
  return config.ascii?.find(art => art.id === id);
}

/**
 * Validate configuration
 */
export function validateConfig(config: Partial<PortfolioConfig>): boolean {
  // Basic validation
  if (!config.personal?.name) {
    console.error('Configuration error: Personal name is required');
    return false;
  }
  if (!config.seo?.title) {
    console.error('Configuration error: SEO title is required');
    return false;
  }
  return true;
}

// Export the configuration directly for components that need it
export { portfolioConfig };

// Re-export types for convenience
export type { PortfolioConfig, Project, BlogPost, SocialLink, PersonalInfo } from '@/config/types';