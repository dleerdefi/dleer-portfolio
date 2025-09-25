export interface ProjectMetrics {
  [key: string]: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  metrics: ProjectMetrics;
  status: string;
  github?: string | null;
  demo?: string | null;
}

export interface ProjectsData {
  projects: Project[];
}