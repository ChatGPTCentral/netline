'use client';

import { useState, useMemo } from 'react';
import type { Resource } from '@/lib/parseFeed';

// ─── Constants ───────────────────────────────────────────────────────────────

const TYPE_FILTERS = ['All', 'eBook', 'White Paper', 'Tips and Tricks Guide'];

const TYPE_LABELS: Record<string, string> = {
  'Tips and Tricks Guide': 'Guide',
};

const TYPE_COLORS: Record<string, string> = {
  'eBook': '#046BB1',
  'White Paper': '#2D8879',
  'Tips and Tricks Guide': '#BE593B',
};

const BOOKS_PER_SHELF = 5;

// ─── Book Cover (shelf view) ──────────────────────────────────────────────────

function BookCover({ title, type, imageUrl, linkUrl }: Resource) {
  const [imgError, setImgError] = useState(false);
  const color = TYPE_COLORS[type] ?? '#9C9C9C';
  const label = TYPE_LABELS[type] ?? type;

  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className="group flex flex-col items-center gap-2 focus:outline-none"
      style={{ width: 100 }}
    >
      {/* Book wrapper — perspective for 3D */}
      <div style={{ perspective: 800 }}>
        <div
          className="relative overflow-hidden transition-transform duration-200"
          style={{
            width: 90,
            height: 128,
            borderRadius: '2px 4px 4px 2px',
            transform: 'rotateY(-6deg)',
            transformOrigin: 'left center',
            boxShadow: '6px 6px 20px rgba(0,0,0,0.35), 2px 2px 4px rgba(0,0,0,0.15)',
          }}
        >
          {/* Cover image */}
          {imageUrl && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-end p-2"
              style={{ backgroundColor: color }}
            >
              <span className="text-white text-[9px] font-bold leading-tight line-clamp-4">
                {title}
              </span>
            </div>
          )}

          {/* Spine gradient overlay on left edge */}
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: 10,
              background: 'linear-gradient(to right, rgba(0,0,0,0.45), rgba(0,0,0,0.05))',
            }}
          />

          {/* Shine overlay on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)',
            }}
          />

          {/* Type badge */}
          <div
            className="absolute top-1.5 right-1.5 text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 rounded"
            style={{ backgroundColor: color, color: '#fff', opacity: 0.92 }}
          >
            {label}
          </div>
        </div>
      </div>

      {/* Title below book */}
      <p className="text-[10px] text-[#555] leading-tight text-center line-clamp-2 group-hover:text-[#E48715] transition-colors" style={{ width: 90 }}>
        {title}
      </p>
    </a>
  );
}

// ─── Shelf Row ────────────────────────────────────────────────────────────────

function ShelfRow({ books }: { books: Resource[] }) {
  return (
    <div className="flex flex-col">
      {/* Books sitting on the shelf */}
      <div className="flex items-end gap-5 px-6 pb-0 pt-6">
        {books.map((b) => (
          <BookCover key={b.id} {...b} />
        ))}
      </div>

      {/* Wooden shelf strip */}
      <div
        style={{
          height: 18,
          background: 'linear-gradient(to bottom, #c8944e 0%, #a97035 55%, #8b5c28 100%)',
          boxShadow: '0 5px 14px rgba(0,0,0,0.38)',
          borderRadius: '0 0 3px 3px',
        }}
      />
    </div>
  );
}

// ─── Bookshelf View ───────────────────────────────────────────────────────────

function BookshelfView({ resources }: { resources: Resource[] }) {
  const shelves: Resource[][] = [];
  for (let i = 0; i < resources.length; i += BOOKS_PER_SHELF) {
    shelves.push(resources.slice(i, i + BOOKS_PER_SHELF));
  }

  if (resources.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[#9C9C9C]">No resources match your search.</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-8 px-4 py-4"
      style={{ background: 'linear-gradient(to bottom, #F5EFE4, #EDE5D5)' }}
    >
      {shelves.map((shelf, i) => (
        <ShelfRow key={i} books={shelf} />
      ))}
    </div>
  );
}

// ─── List Row (list view) ─────────────────────────────────────────────────────

function ResourceRow({ title, shortDescription, type, imageUrl, linkUrl, startDate }: Resource) {
  const [imgError, setImgError] = useState(false);
  const label = TYPE_LABELS[type] ?? type;
  const color = TYPE_COLORS[type] ?? '#9C9C9C';

  const formattedDate = startDate
    ? new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 py-5 border-b border-[#EBEBEB] hover:bg-[#FEF7E7] transition-colors duration-150 px-1 group"
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-[100px] h-[120px] bg-[#F0F0F0] overflow-hidden rounded">
        {imageUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#CCCCCC]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
              <path d="M14 2v6h6" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
          {label}
        </span>
        <h3 className="text-[#333333] font-bold text-sm leading-snug line-clamp-2 group-hover:text-[#E48715] transition-colors">
          {title}
        </h3>
        <p className="text-[#666666] text-xs leading-relaxed line-clamp-2 flex-1">
          {shortDescription}
        </p>
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-[11px] font-semibold text-[#333333]">AI Central</span>
          {formattedDate && (
            <>
              <span className="text-[#CCCCCC]">·</span>
              <span className="text-[11px] text-[#9C9C9C] uppercase tracking-wide">{formattedDate}</span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ResourceLibrary({ resources }: { resources: Resource[] }) {
  const [view, setView] = useState<'shelf' | 'list'>('shelf');
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('All');

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchesType = activeType === 'All' || r.type === activeType;
      const q = query.toLowerCase();
      const matchesQuery =
        !q || r.title.toLowerCase().includes(q) || r.shortDescription.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [resources, query, activeType]);

  return (
    <div className="min-h-screen bg-[#FFFDFA] font-sans">
      {/* Header */}
      <div className="border-b border-[#E48715] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#E48715" />
            <text x="4" y="23" fontSize="18" fontWeight="900" fill="#FFFDFA" fontFamily="Inter, sans-serif">Ai</text>
          </svg>
          <span className="font-bold text-sm text-[#333333] tracking-wide">AI Central</span>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-[#F0F0F0] rounded-lg p-1">
          <button
            onClick={() => setView('shelf')}
            title="Bookshelf view"
            className={`p-1.5 rounded-md transition-colors ${view === 'shelf' ? 'bg-white shadow-sm text-[#E48715]' : 'text-[#9C9C9C] hover:text-[#333]'}`}
          >
            {/* Bookshelf icon */}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="3" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
              <rect x="9" y="6" width="4" height="11" rx="1" fill="currentColor" stroke="none" />
              <rect x="15" y="4" width="4" height="13" rx="1" fill="currentColor" stroke="none" />
              <line x1="2" y1="19" x2="22" y2="19" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={() => setView('list')}
            title="List view"
            className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-white shadow-sm text-[#E48715]' : 'text-[#9C9C9C] hover:text-[#333]'}`}
          >
            {/* List icon */}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
              <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
              <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="px-5 pt-4 pb-2">
        <div className="relative mb-3">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C9C9C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or description..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#E0E0E0] rounded-lg bg-white text-[#333333] placeholder-[#BBBBBB] focus:outline-none focus:border-[#E48715] transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {TYPE_FILTERS.map((type) => {
            const isActive = activeType === type;
            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`text-xs px-3 py-1 rounded-full font-semibold border transition-colors ${
                  isActive
                    ? 'bg-[#E48715] text-white border-[#E48715]'
                    : 'bg-white text-[#666666] border-[#E0E0E0] hover:border-[#E48715] hover:text-[#E48715]'
                }`}
              >
                {TYPE_LABELS[type] ?? type}
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-[#9C9C9C]">
          Showing {filtered.length} of {resources.length} resources
        </p>
      </div>

      {/* Content area */}
      {view === 'shelf' ? (
        <BookshelfView resources={filtered} />
      ) : (
        <div className="px-5">
          {filtered.length > 0 ? (
            filtered.map((r) => <ResourceRow key={r.id} {...r} />)
          ) : (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-[#9C9C9C]">No resources match your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#EBEBEB] flex items-center justify-between mt-2">
        <span className="text-[10px] text-[#9C9C9C]">Powered by AI Central</span>
        <a
          href="https://gptcentral.tradepub.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-semibold text-[#E48715] hover:underline"
        >
          View all →
        </a>
      </div>
    </div>
  );
}
