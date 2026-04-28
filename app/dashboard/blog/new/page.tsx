'use client';

import BlogEditor from '../../components/BlogEditor';
import { useAuth } from '@/app/lib/auth-context';
import { createBlog } from '@/lib/api/blogs';
import type { BlogPost } from '@/app/lib/blog-types';
import type { CreateBlogPayload } from '@/types/blog';

type FormData = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>;

function toCreatePayload(data: FormData): CreateBlogPayload {
  return {
    title: data.title,
    shortDescription: data.shortDescription || undefined,
    thumbnail: data.image || undefined,
    contents: data.blocks.map((block) => ({
      header: block.title || undefined,
      body: block.body,
      image: block.image || undefined,
    })),
  };
}

export default function NewBlogPage() {
  const { getValidToken } = useAuth();

  return (
    <BlogEditor
      pageTitle="New Post"
      hideDraftAction
      publishLabel="Create post →"
      onSubmit={async (data: FormData) => {
        const token = await getValidToken();

        if (!token) {
          throw new Error('Your session expired. Please sign in again.');
        }

        await createBlog(token, toCreatePayload(data));
      }}
    />
  );
}
