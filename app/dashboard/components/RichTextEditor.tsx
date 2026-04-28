'use client';

import { useEffect, useRef } from 'react';

type ToolItem =
  | { kind: 'btn'; label: string; cmd: string; val?: string; title: string; cls?: string }
  | { kind: 'sep' };

const toolbar: ToolItem[] = [
  { kind: 'btn', label: 'B',  cmd: 'bold',                title: 'Bold',           cls: 'font-bold' },
  { kind: 'btn', label: 'I',  cmd: 'italic',              title: 'Italic',         cls: 'italic' },
  { kind: 'btn', label: 'U',  cmd: 'underline',           title: 'Underline',      cls: 'underline' },
  { kind: 'sep' },
  { kind: 'btn', label: 'H2', cmd: 'formatBlock', val: 'h2', title: 'Heading 2',   cls: 'font-semibold' },
  { kind: 'btn', label: 'H3', cmd: 'formatBlock', val: 'h3', title: 'Heading 3' },
  { kind: 'btn', label: 'P',  cmd: 'formatBlock', val: 'p',  title: 'Normal text' },
  { kind: 'sep' },
  { kind: 'btn', label: '• —', cmd: 'insertUnorderedList', title: 'Bullet list' },
  { kind: 'btn', label: '1 —', cmd: 'insertOrderedList',   title: 'Numbered list' },
  { kind: 'sep' },
  { kind: 'btn', label: '❝',  cmd: 'formatBlock', val: 'blockquote', title: 'Quote' },
];

type Props = {
  initialValue?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
};

export default function RichTextEditor({
  initialValue = '',
  onChange,
  placeholder,
  minHeight = '120px',
}: Props) {
  const divRef    = useRef<HTMLDivElement>(null);
  const cbRef     = useRef(onChange);

  // Keep callback ref current without re-running effects
  useEffect(() => { cbRef.current = onChange; });

  // Set initial HTML once — never overwrite while user is editing
  useEffect(() => {
    if (divRef.current) divRef.current.innerHTML = initialValue;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (cmd: string, val?: string) => {
    divRef.current?.focus();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    document.execCommand(cmd, false, val);
  };

  return (
    <div className="rounded-2xl border border-gray-200 focus-within:border-[#36e17b] transition-colors overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-gray-50/80">
        {toolbar.map((t, i) =>
          t.kind === 'sep' ? (
            <span key={i} className="w-px h-4 bg-gray-200 mx-1 shrink-0" />
          ) : (
            <button
              key={i}
              type="button"
              title={t.title}
              onMouseDown={(e) => {
                e.preventDefault(); // keep editor focused
                exec(t.cmd, t.val);
              }}
              className={`px-2 py-1 rounded text-xs text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors select-none ${t.cls ?? ''}`}
            >
              {t.label}
            </button>
          ),
        )}
      </div>

      {/* Editable content */}
      <div
        ref={divRef}
        contentEditable
        suppressContentEditableWarning
        data-rte-placeholder={placeholder}
        onInput={() => cbRef.current(divRef.current?.innerHTML ?? '')}
        className="px-4 py-3 text-sm text-gray-900 outline-none leading-relaxed
          [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-1 [&_h2]:mt-2
          [&_h3]:text-sm  [&_h3]:font-semibold [&_h3]:mb-1 [&_h3]:mt-1.5
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1
          [&_blockquote]:border-l-2 [&_blockquote]:border-[#36e17b] [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-500
          [&_p]:mb-1.5 [&_strong]:font-semibold [&_em]:italic [&_u]:underline"
        style={{ minHeight }}
      />
    </div>
  );
}
