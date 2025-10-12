// Configuration type definitions for the portfolio

export interface PersonalInfo {
  name: string;
  username: string;
  greeting?: string;  // Personalized greeting (e.g., "Hi, I'm David Leer")
  title: string;
  subtitle: string;
  email: string;
  contactEmail: string;  // Email for contact form submissions
  location: string;
  bio: {
    // Structured bio fields for parallax mode
    intro?: string;
    experience?: string;
    leadership?: string;
    tagline?: string;
    // Legacy fields
    short: string;
    long: string;
    homeDescription?: string;
    currentFocus?: string;
  };
}

export interface SocialLink {
  platform: string;
  url: string;
  username: string;
  icon?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Technology {
  name: string;
  icon: string;         // Icon identifier from react-icons (e.g., "SiPython")
  category?: string;    // Optional category for grouping
}

export interface TechnologiesConfig {
  items: Technology[];
}

export interface Project {
  id: string;
  name: string;
  filename: string;
  description: string;
  longDescription?: string;
  overview?: string;
  features?: string[];
  techStack: string[];
  techStackDisplay: string; // Formatted string for display
  github?: string;
  demo?: string;
  status?: 'production' | 'development' | 'archived';

  // New fields for enhanced categorization
  category?: 'systems' | 'product' | 'experimental';
  role?: 'built' | 'architected' | 'led';
  visibility?: 'open-source' | 'proprietary';  // For better project organization
  metrics?: string[];  // e.g., ["Processed 2M+ transactions daily", "Modeled $300M+ token economies"]
  outcome?: string;     // Brief outcome statement
  videoUrl?: string;    // YouTube or other video embeds
  blogUrl?: string;     // Link to detailed blog post
  images?: string[];    // Screenshots, diagrams, etc.
}

export interface BlogPost {
  id: string;
  filename: string;
  title: string;
  date: string;
  category: string;
  excerpt?: string;
  content?: string;
}

export interface SocialInfo {
  platform: string;
  username: string;
  url: string;
  followers?: string;  // Optional follower count or stats
}

export interface SystemInfo {
  // Social links as objects
  github?: SocialInfo;
  twitter?: SocialInfo;
  linkedin?: SocialInfo;
  youtube?: SocialInfo;
  instagram?: SocialInfo;
  tiktok?: SocialInfo;

  // Legacy support (for backward compatibility)
  os?: string | SocialInfo;
  terminal?: string | SocialInfo;
  kernel?: string | SocialInfo;
  cpu?: string | SocialInfo;
  memory?: string | SocialInfo;
  gpu?: string | SocialInfo;
  shell?: string;
  [key: string]: string | SocialInfo | undefined; // Allow custom fields
}

export interface NavigationSection {
  id: string;
  label: string;
  icon?: string;
  items?: NavigationItem[];
}

export interface NavigationItem {
  id: string;
  name: string;
  type: 'project' | 'blog' | 'page' | 'external';
  data?: any;
}

export interface ThemeConfig {
  primaryColor?: string;
  accentColor?: string;
  wallpaper?: string;
  customCSS?: string;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  ogImage?: string;
  twitterHandle?: string;
}

export interface ASCIIArt {
  id: string;
  name: string;
  art: string;
  compact?: string;
  mini?: string;
}

export interface UIStrings {
  buttons: {
    viewGithub: string;
    liveDemo: string;
    sendMessage: string;
  };
  placeholders: {
    name: string;
    email: string;
    message: string;
  };
  headers: {
    about: string;
    overview: string;
    techStack: string;
    keyFeatures: string;
    currentFocus: string;
    introduction: string;
    conclusion: string;
    contact: string;
  };
  labels: {
    name: string;
    email: string;
    message: string;
  };
  navigation: {
    rootPath: string;
    tabHint: string;
  };
  tips: {
    title: string;
    items: string[];
  };
  welcomeAscii?: string;
}

export interface PortfolioConfig {
  personal: PersonalInfo;
  social: SocialLink[];
  skills: SkillCategory[];
  technologies?: TechnologiesConfig;
  projects: Project[];
  blog: BlogPost[];
  system: SystemInfo;
  navigation?: NavigationSection[];
  theme?: ThemeConfig;
  seo: SEOConfig;
  ascii?: ASCIIArt[];
  uiStrings?: UIStrings;
  features?: {
    blog?: boolean;
    projects?: boolean;
    contact?: boolean;
    about?: boolean;
    neofetch?: boolean;
  };
}