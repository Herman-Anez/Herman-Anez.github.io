export interface TeamMember {
  name: string;
  avatar: string;
  role?: string;
  linkedIn?: string;
}

export interface ProjectMetadata {
  title: string;
  publishedAt: string;
  summary: string;
  images: string[];
  team?: TeamMember[];
  link?: string;
  tag?: string;
  slugs?: Record<string, string>;
}

export interface Project {
  slug: string;
  family?: string;
  isIndex?: boolean;
  metadata: ProjectMetadata;
  content: string;
}
