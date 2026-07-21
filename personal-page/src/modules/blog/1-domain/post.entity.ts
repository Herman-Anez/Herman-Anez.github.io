export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  linkedIn?: string;
}

export interface BlogPostMetadata {
  title: string;
  subtitle?: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team: TeamMember[];
  link?: string;
  slugs?: Record<string, string>;
}

export interface BlogPost {
  slug: string;
  family?: string;
  isIndex?: boolean;
  metadata: BlogPostMetadata;
  content: string;
}
