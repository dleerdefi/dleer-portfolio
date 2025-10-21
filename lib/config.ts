import { portfolioConfig, getPortfolioConfig } from '@/config/portfolio.config';
import { PortfolioConfig, Project, SocialLink } from '@/config/types';

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

// Note: useSkills() removed - skills array deleted from config
// Skills displayed in NeofetchTile (via config.system) and AboutTechGrid (via config.technologies)

/**
 * Get technologies from config
 */
export function useTechnologies() {
  const config = usePortfolioConfig();
  return config.technologies;
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

// Note: useBlogPosts() and useBlogPost() removed - blog posts moved to Content Collections
// Use `allBlogs` from 'content-collections' instead (see app/blog/[slug]/page.tsx)

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

// Note: useThemeConfig() removed - theme managed by ThemeContext (contexts/ThemeContext.tsx)

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

// Note: useUIStrings() removed - UI strings deleted from config
// All UI text is hardcoded directly in components for simplicity

/**
 * Format username for display (e.g., "dleer@portfolio")
 */
export function formatUsername(): string {
  const config = getPortfolioConfig();
  return `${config.personal.username}@portfolio`;
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