// Configuration type definitions for the portfolio

export interface PersonalInfo {
  name: string;
  username: string;
  greeting?: string;  // Personalized greeting (e.g., "Hi, I'm David Leer")
  title: string;
  subtitle: string;
  email: string;
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

export interface SystemInfo {
  os: string;
  kernel: string;
  shell: string;
  terminal: string;
  cpu: string;
  gpu: string;
  memory: string;
  [key: string]: string; // Allow custom fields
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