'use client';

import { useState, useCallback } from 'react';
import type { BlogPost } from './blog-types';

const STORAGE_KEY = 'gfi_blog_posts';

const seed: BlogPost[] = [
  {
    id: '1',
    slug: 'umuganura-export-company-loan',
    title: "Growing Together: How Our First Loan's Impact with Umuganura Export Company Ltd is Cultivating Sustainability in Rwanda's Coffee Sector",
    shortDescription: "At Green Financing Incorporate, we believe that every strong tree begins as a carefully nurtured seed. Today we are planting a seed of possibility — one that will grow far beyond the financial value alone.",
    content: '<p>At Green Financing Incorporate, we believe that every strong tree begins as a carefully nurtured seed.</p>',
    blocks: [
      {
        id: 'b1',
        title: 'Growing Together',
        body: '<p>At Green Financing Incorporate, we believe that every strong tree begins as a carefully nurtured seed. Today we are planting a seed of possibility — one that will grow far beyond the financial value alone.</p>',
        image: '',
      },
    ],
    date: 'April 8, 2026',
    time: '09:00 AM',
    image: '/about.png',
    status: 'published',
    tags: ['coffee', 'sustainability', 'agriculture'],
    createdAt: '2026-04-08T09:00:00Z',
    updatedAt: '2026-04-08T09:00:00Z',
  },
  {
    id: '2',
    slug: 'green-finance-vision-2050',
    title: "Mobilising Climate Capital: GFI's Role in Advancing Rwanda's Vision 2050 Green Economy Goals",
    shortDescription: "Rwanda's Vision 2050 sets an ambitious target for a prosperous, knowledge-based economy built on sustainable foundations. Green Financing Incorporate stands at the intersection of capital access and climate action.",
    content: "<p>Rwanda's Vision 2050 sets an ambitious target for a prosperous, knowledge-based economy.</p>",
    blocks: [
      {
        id: 'b2',
        title: 'Vision 2050',
        body: "<p>Rwanda's Vision 2050 sets an ambitious target for a prosperous, knowledge-based economy built on sustainable foundations. Green Financing Incorporate stands at the intersection of capital access and climate action.</p>",
        image: '',
      },
    ],
    date: 'March 21, 2026',
    time: '10:30 AM',
    image: '/hero.png',
    status: 'published',
    tags: ['climate', 'vision2050', 'green economy'],
    createdAt: '2026-03-21T10:30:00Z',
    updatedAt: '2026-03-21T10:30:00Z',
  },
];

// Lazy initializer — runs once synchronously on mount (client only).
function load(): BlogPost[] {
  if (typeof window === 'undefined') return seed;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as BlogPost[];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  } catch {
    return seed;
  }
}

function persist(updated: BlogPost[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export function useBlogStore() {
  // Reads localStorage synchronously — no loading state needed.
  const [posts, setPosts] = useState<BlogPost[]>(load);

  const createPost = useCallback(
    (data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const next: BlogPost = { ...data, id: Date.now().toString(), createdAt: now, updatedAt: now };
      setPosts((prev) => {
        const updated = [...prev, next];
        persist(updated);
        return updated;
      });
      return next;
    },
    [],
  );

  const updatePost = useCallback((id: string, updates: Partial<BlogPost>) => {
    setPosts((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p,
      );
      persist(updated);
      return updated;
    });
  }, []);

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      persist(updated);
      return updated;
    });
  }, []);

  const getPost = useCallback((id: string) => posts.find((p) => p.id === id), [posts]);

  return { posts, createPost, updatePost, deletePost, getPost };
}
