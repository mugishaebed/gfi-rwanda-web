export type BlogContent = {
  id: string;
  blogId: string;
  position: number;
  header: string | null;
  body: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Blog = {
  id: string;
  title: string;
  author: string;
  shortDescription: string | null;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl: string | null;
  contents: BlogContent[];
};

export type BlogListResponse = {
  data: Blog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateBlogPayload = {
  title: string;
  shortDescription?: string;
  thumbnail?: string;
  contents: Array<{
    header?: string;
    body: string;
    image?: string;
  }>;
};
