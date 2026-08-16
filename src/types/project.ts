export interface Project {
  id: string;
  title: string;
  slug: string;
  images: string[];
  videoUrl?: string;
  description: string;
  specs: { label: string; value: string }[];
  githubUrl?: string;
  publishedAt: string;
}
