export interface ProjectVideo {
  url: string;
  title: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  images: string[];
  videos?: ProjectVideo[];
  description: string;
  content?: string;
  specs: { label: string; value: string }[];
  githubUrl?: string;
  publishedAt: string;
}
