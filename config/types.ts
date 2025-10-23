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
  profilePhoto?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    exif?: {
      location?: string;
      aperture?: string;
      shutter?: string;
      iso?: string;
      model?: string;
      task?: string;
    };
    detectionVariant?: {
      src: string;
      exif?: {
        location?: string;
        model?: string;
        task?: string;
      };
    };
  };
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
  description: string; // Single 50-70 word paragraph (replaces overview + features)
  techStack: string[];
  techStackDisplay: string; // Formatted string for display
  github?: string;
  demo?: string;
  status?: 'production' | 'development' | 'archived';

  // Enhanced categorization
  category?: 'systems' | 'product' | 'experimental';
  role?: 'built' | 'architected' | 'led';
  visibility?: 'open-source' | 'proprietary';

  // New: Condensed metrics (1-line summary)
  metricsSummary?: string; // e.g., "18K+ messages • Multi-LLM support • Real-time parallel processing"

  // Media
  screenshots?: string[];   // Array of screenshot filenames (e.g., ["frontend-interface.webp", "neo4j-graph.webp"])
  videoUrl?: string;        // YouTube or other video embeds
  blogUrl?: string;         // Link to detailed blog post

  // Legacy fields (deprecated, for backward compatibility)
  longDescription?: string;
  overview?: string;
  features?: string[];
  metrics?: string[];
  outcome?: string;
  images?: string[];
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
  skills?: SkillCategory[]; // Optional - legacy field, can be removed
  technologies?: TechnologiesConfig;
  projects: Project[];
  blog?: BlogPost[]; // Optional - migrated to Content Collections (content/blog/*.mdx)
  system: SystemInfo;
  navigation?: NavigationSection[];
  theme?: ThemeConfig; // Optional - managed by ThemeContext
  seo: SEOConfig;
  ascii?: ASCIIArt[];
  uiStrings?: UIStrings; // Optional - UI text hardcoded in components
  features?: {
    blog?: boolean;
    projects?: boolean;
    contact?: boolean;
    about?: boolean;
    neofetch?: boolean;
  };
}