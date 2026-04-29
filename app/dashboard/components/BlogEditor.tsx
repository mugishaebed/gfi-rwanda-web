'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { BlogPost, ParagraphBlock } from '@/app/lib/blog-types';
import RichTextEditor from './RichTextEditor';

// ─── Utilities ────────────────────────────────────────────────────────────────

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function compressImage(file: File, maxW = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Read failed'));
    reader.onload = ({ target }) => {
      const img = document.createElement('img');
      img.onerror = () => reject(new Error('Load failed'));
      img.onload = () => {
        const scale = Math.min(1, maxW / img.naturalWidth);
        const w = Math.round(img.naturalWidth * scale);
        const h = Math.round(img.naturalHeight * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function newBlock(): ParagraphBlock {
  return { id: Date.now().toString() + Math.random(), title: '', body: '', image: '' };
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function UploadIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

// ─── Cover upload zone ────────────────────────────────────────────────────────

function CoverUploadZone({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    onChange(await compressImage(file));
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
          e.target.value = '';
        }}
      />
      {value ? (
        <div
          className="relative rounded-2xl overflow-hidden cursor-pointer group h-60"
          onClick={() => inputRef.current?.click()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full px-5 py-2 text-xs font-semibold text-gray-900 shadow-sm">
              Change image
            </span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) handle(f);
          }}
          className="w-full h-60 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 hover:border-[#36e17b] hover:bg-[#e8faf0]/40 transition-colors group"
        >
          <span className="text-gray-300 group-hover:text-[#36e17b] transition-colors">
            <UploadIcon size={28} />
          </span>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Upload cover image</p>
            <p className="text-xs text-gray-400 mt-0.5">Click or drag & drop · JPG, PNG, WebP</p>
          </div>
        </button>
      )}
    </div>
  );
}

// ─── Paragraph block editor ───────────────────────────────────────────────────

function BlockEditor({
  block, index, isFirst, isLast, onChange, onDelete, onMoveUp, onMoveDown,
}: {
  block: ParagraphBlock;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onChange: (id: string, updates: Partial<ParagraphBlock>) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}) {
  const imgRef = useRef<HTMLInputElement>(null);

  const handleImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    onChange(block.id, { image: await compressImage(f, 1200) });
    e.target.value = '';
  };

  const fieldLabel = 'text-xs font-medium text-gray-500 mb-1.5 block';
  const textInput =
    'w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#36e17b]';

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
      {/* Block header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50/70 border-b border-gray-100">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Paragraph {index + 1}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onMoveUp(block.id)}
            disabled={isFirst}
            title="Move up"
            className="p-1.5 rounded-lg text-gray-300 hover:bg-gray-200 hover:text-gray-700 disabled:opacity-0 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>
          </button>
          <button
            type="button"
            onClick={() => onMoveDown(block.id)}
            disabled={isLast}
            title="Move down"
            className="p-1.5 rounded-lg text-gray-300 hover:bg-gray-200 hover:text-gray-700 disabled:opacity-0 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(block.id)}
            title="Remove paragraph"
            className="p-1.5 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors ml-1"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="p-5 space-y-4">
        {/* Heading */}
        <div>
          <label className={fieldLabel}>Heading</label>
          <input
            type="text"
            value={block.title}
            onChange={(e) => onChange(block.id, { title: e.target.value })}
            placeholder="Section heading (optional)"
            className={textInput}
          />
        </div>

        {/* Body */}
        <div>
          <label className={fieldLabel}>Body</label>
          <RichTextEditor
            initialValue={block.body}
            onChange={(body) => onChange(block.id, { body })}
            placeholder="Write paragraph content…"
          />
        </div>

        {/* Image */}
        <div>
          <label className={fieldLabel}>Image (optional)</label>
          <input ref={imgRef} type="file" accept="image/*" onChange={handleImg} className="hidden" />
          {block.image ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-100 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={block.image} alt="" className="w-full max-h-56 object-cover" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => imgRef.current?.click()}
                    className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange(block.id, { image: '' })}
                    className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 shadow-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => imgRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-3.5 text-xs text-gray-400 hover:border-[#36e17b] hover:text-[#36e17b] transition-colors"
            >
              <UploadIcon size={14} />
              Add image to this paragraph
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Live preview ─────────────────────────────────────────────────────────────

function Preview({
  title, coverImage, shortDescription, blocks,
}: {
  title: string;
  coverImage: string;
  shortDescription: string;
  blocks: ParagraphBlock[];
}) {
  const hasAny =
    title || coverImage || shortDescription || blocks.some((b) => b.title || b.body || b.image);

  return (
    <div className="px-8 py-8">
      <div className="flex items-center gap-3 mb-7">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
          Live Preview
        </p>
        <span className="flex-1 h-px bg-gray-100" />
      </div>

      {!hasAny ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <svg className="text-gray-200 mb-3" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p className="text-sm text-gray-300">Start writing to see the preview</p>
        </div>
      ) : (
        <article className="max-w-lg">
          {/* Cover */}
          {coverImage && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={coverImage} alt="" className="w-full h-44 object-cover rounded-2xl mb-5" />
          )}

          {/* Title */}
          {title ? (
            <h1 className="text-xl font-bold text-gray-900 leading-snug mb-3">{title}</h1>
          ) : (
            <div className="h-6 bg-gray-100 rounded-lg mb-3 w-4/5 animate-pulse" />
          )}

          {/* Short description */}
          {shortDescription && (
            <p className="text-sm text-gray-500 leading-relaxed mb-5 border-b border-gray-100 pb-5">
              {shortDescription}
            </p>
          )}

          {/* Blocks */}
          {blocks.map((block) =>
            block.title || block.body || block.image ? (
              <div key={block.id} className="mb-7">
                {block.title && (
                  <h2 className="text-base font-semibold text-gray-900 mb-2 leading-snug">
                    {block.title}
                  </h2>
                )}
                {block.body && (
                  <div
                    className="text-sm text-gray-600 leading-relaxed
                      [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-2
                      [&_h3]:text-sm  [&_h3]:font-semibold [&_h3]:mb-1
                      [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-1
                      [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:my-1
                      [&_blockquote]:border-l-2 [&_blockquote]:border-[#36e17b] [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-500
                      [&_p]:mb-2 [&_strong]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: block.body }}
                  />
                )}
                {block.image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={block.image}
                    alt=""
                    className="mt-3 w-full rounded-xl object-cover border border-gray-100"
                  />
                )}
              </div>
            ) : null,
          )}
        </article>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export type BlogEditorFormData = Omit<
  BlogPost,
  'id' | 'createdAt' | 'updatedAt' | 'date' | 'time' | 'tags'
>;

type Props = {
  initialValues?: Partial<BlogPost>;
  onSubmit: (data: BlogEditorFormData) => Promise<void> | void;
  pageTitle: string;
  hideDraftAction?: boolean;
  publishLabel?: string;
};

export default function BlogEditor({
  initialValues,
  onSubmit,
  pageTitle,
  hideDraftAction = false,
  publishLabel = 'Publish →',
}: Props) {
  const router = useRouter();

  const [title, setTitle]             = useState(initialValues?.title   ?? '');
  const [slug, setSlug]               = useState(initialValues?.slug    ?? '');
  const [slugTouched, setSlugTouched] = useState(!!initialValues?.slug);
  const [shortDescription, setShortDescription] = useState(initialValues?.shortDescription ?? '');
  const [coverImage, setCoverImage]   = useState(initialValues?.image   ?? '');
  const [blocks, setBlocks]           = useState<ParagraphBlock[]>(
    initialValues?.blocks?.length ? initialValues.blocks : [newBlock()],
  );
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const updateBlock = useCallback((id: string, updates: Partial<ParagraphBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  }, []);

  const addBlock = useCallback(() => setBlocks((p) => [...p, newBlock()]), []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => (prev.length > 1 ? prev.filter((b) => b.id !== id) : prev));
  }, []);

  const moveBlock = useCallback((id: string, dir: 'up' | 'down') => {
    setBlocks((prev) => {
      const idx  = prev.findIndex((b) => b.id === id);
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      if (idx < 0 || swap < 0 || swap >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }, []);

  const validate = () => {
    const e: Partial<Record<string, string>> = {};
    if (!title.trim()) e.title = 'Required';
    if (!slug.trim())  e.slug  = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const save = async (targetStatus: 'draft' | 'published') => {
    if (!validate()) return;
    setIsSaving(true);
    setSubmitError(null);

    try {
      await onSubmit({
        title:            title.trim(),
        slug:             slug.trim(),
        shortDescription: shortDescription.trim(),
        content: blocks
          .map((b) =>
            [
              b.title ? `<h2>${b.title}</h2>` : '',
              b.body,
              b.image ? `<figure><img src="${b.image}" /></figure>` : '',
            ]
              .filter(Boolean)
              .join('\n'),
          )
          .join('\n\n'),
        blocks,
        image: coverImage,
        status: targetStatus,
      });
      router.push('/dashboard/blog');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to save blog post.');
    } finally {
      setIsSaving(false);
    }
  };

  const input =
    'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#36e17b]';
  const sectionHead =
    'text-[10px] font-bold text-[#36e17b] uppercase tracking-[0.18em] mb-5';

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shrink-0 z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href="/dashboard/blog"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Blog Posts
          </Link>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-medium text-gray-900 truncate">{pageTitle}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          {!hideDraftAction ? (
            <button
              type="button"
              onClick={() => save('draft')}
              disabled={isSaving}
              className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save draft'}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => save('published')}
            disabled={isSaving}
            className="rounded-full bg-[#36e17b] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#00d63b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Publishing...' : publishLabel}
          </button>
        </div>
      </header>

      {/* ── Split body ───────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left — editor */}
        <div className="flex-[3] overflow-y-auto">
          <div className="px-10 py-10 space-y-10 max-w-2xl">

            {/* Cover image */}
            <section>
              <p className={sectionHead}>Cover Image</p>
              <CoverUploadZone value={coverImage} onChange={setCoverImage} />
            </section>

            {/* Post details */}
            <section className="space-y-5">
              <p className={sectionHead}>Post Details</p>

              {submitError ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {submitError}
                </div>
              ) : null}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-900">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Blog post title"
                  className={`${input} text-base ${errors.title ? 'border-red-300' : ''}`}
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-900">
                  URL Slug <span className="text-red-400">*</span>
                </label>
                <div
                  className={`flex items-center rounded-xl border overflow-hidden transition-colors focus-within:border-[#36e17b] ${errors.slug ? 'border-red-300' : 'border-gray-200'}`}
                >
                  <span className="px-4 py-3 text-sm text-gray-400 bg-gray-50 border-r border-gray-200 shrink-0 select-none">
                    /blog/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
                    placeholder="post-url-slug"
                    className="flex-1 px-4 py-3 text-sm text-gray-900 outline-none bg-white"
                  />
                </div>
                {errors.slug && <p className="text-xs text-red-500">{errors.slug}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-900">Short description</label>
                <textarea
                  rows={3}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Short description shown in blog listings…"
                  className="resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#36e17b]"
                />
              </div>
            </section>

            {/* Content — paragraph blocks */}
            <section>
              <p className={sectionHead}>Content</p>
              <div className="space-y-4">
                {blocks.map((block, idx) => (
                  <BlockEditor
                    key={block.id}
                    block={block}
                    index={idx}
                    isFirst={idx === 0}
                    isLast={idx === blocks.length - 1}
                    onChange={updateBlock}
                    onDelete={deleteBlock}
                    onMoveUp={(id) => moveBlock(id, 'up')}
                    onMoveDown={(id) => moveBlock(id, 'down')}
                  />
                ))}

                <button
                  type="button"
                  onClick={addBlock}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-200 py-4 text-sm font-medium text-gray-400 hover:border-[#36e17b] hover:text-[#36e17b] transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add paragraph
                </button>
              </div>
            </section>

          </div>
        </div>

        {/* Right — live preview */}
        <div className="flex-[2] border-l border-gray-100 bg-white overflow-y-auto shrink-0">
          <Preview
            title={title}
            coverImage={coverImage}
            shortDescription={shortDescription}
            blocks={blocks}
          />
        </div>

      </div>
    </div>
  );
}
