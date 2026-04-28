export type BlogStatus = 'draft' | 'published';

export type ParagraphBlock = {
  id: string;
  title: string;
  body: string;  // HTML
  image: string; // base64 data URL or empty
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string; // HTML derived from blocks (for display)
  blocks: ParagraphBlock[];
  date: string;
  time: string;
  image: string; // cover image — base64 or public path
  status: BlogStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};
