'use client';

import { useState, useMemo } from 'react';
import type { Resource } from '@/lib/parseFeed';

// ─── Constants ───────────────────────────────────────────────────────────────

const TYPE_FILTERS = ['All', 'eBook', 'White Paper', 'Tips and Tricks Guide'];

const TYPE_LABELS: Record<string, string> = {
  'Tips and Tricks Guide': 'Guide',
};

const TYPE_COLORS: Record<string, string> = {
  'eBook':              '#046BB1',
  'White Paper':        '#2D8879',
  'Tips and Tricks Guide': '#BE593B',
};

const SECTIONS = [
  { label: 'eBooks',       type: 'eBook' },
  { label: 'White Papers', type: 'White Paper' },
  { label: 'Guides',       type: 'Tips and Tricks Guide' },
];

// ─── Apple-style Book Card ────────────────────────────────────────────────────

function BookCard({ title, type, imageUrl, linkUrl }: Resource) {
  const [imgError, setImgError] = useState(false);
  const color = TYPE_COLORS[type] ?? '#9C9C9C';
  const label = TYPE_LABELS[type] ?? type;

  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 flex-shrink-0"
      style={{ width: 104 }}
    >
      {/* Cover */}
      <div
        className="w-full overflow-hidden transition-all duration-300 ease-out"
        style={{
          aspectRatio: '2 / 3',
          borderRadius: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)',
          transform: 'scale(1)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)';
        }}
      >
        {imageUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-end p-2"
            style={{ background: `linear-gradient(160deg, ${color}cc, ${color})` }}
          >
            <span className="text-white text-[9px] font-semibold leading-tight line-clamp-4">{title}</span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-[10px] font-medium" style={{ color }}>
            {label}
          </span>
        </div>
        <p className="text-[11px] text-[#1d1d1f] font-medium leading-tight line-clamp-2">
          {title}
        </p>
      </div>
    </a>
  );
}

// ─── Horizontal Scroll Section ────────────────────────────────────────────────

function Section({
  label,
  books,
  onSeeAll,
}: {
  label: string;
  books: Resource[];
  onSeeAll: () => void;
}) {
  if (books.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-baseline justify-between px-5">
        <h2 className="text-[15px] font-bold text-[#1d1d1f] tracking-tight">{label}</h2>
        <button
          onClick={onSeeAll}
          className="text-[13px] font-medium text-[#E48715] hover:opacity-70 transition-opacity"
        >
          See All
        </button>
      </div>

      {/* Horizontal scroll row */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-1">
        {books.map((b) => (
          <BookCard key={b.id} {...b} />
        ))}
      </div>
    </div>
  );
}

// ─── Flat Grid (search / filter results) ─────────────────────────────────────

function FlatGrid({ books }: { books: Resource[] }) {
  if (books.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[#86868b]">No resources match your search.</p>
      </div>
    );
  }

  return (
    <div className="px-5 grid gap-x-4 gap-y-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))' }}>
      {books.map((b) => (
        <BookCard key={b.id} {...b} />
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
      className="flex gap-4 py-4 border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors duration-150 px-1 group"
    >
      <div
        className="flex-shrink-0 overflow-hidden"
        style={{ width: 72, height: 96, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
      >
        {imageUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#f5f5f7]">
            <svg className="w-6 h-6 text-[#CCCCCC]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
              <path d="M14 2v6h6" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>{label}</span>
        </div>
        <h3 className="text-[#1d1d1f] font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#E48715] transition-colors">
          {title}
        </h3>
        <p className="text-[#86868b] text-[11px] leading-relaxed line-clamp-2 flex-1">
          {shortDescription}
        </p>
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-[11px] font-medium text-[#1d1d1f]">AI Central</span>
          {formattedDate && (
            <>
              <span className="text-[#d0d0d0]">·</span>
              <span className="text-[11px] text-[#86868b]">{formattedDate}</span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ResourceLibrary({ resources }: { resources: Resource[] }) {
  const [view, setView] = useState<'shelf' | 'list'>('shelf');
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('All');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return resources.filter((r) => {
      const matchesType = activeType === 'All' || r.type === activeType;
      const matchesQuery = !q || r.title.toLowerCase().includes(q) || r.shortDescription.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [resources, query, activeType]);

  const isFiltering = query.length > 0 || activeType !== 'All';

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#F5F5F7' }}>

      {/* ── Sticky header ── */}
      <div
        className="sticky top-0 z-20 px-5 pt-4 pb-3 flex flex-col gap-3"
        style={{
          backgroundColor: 'rgba(245,245,247,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {/* Logo + toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="7" fill="#E48715" />
              <text x="4" y="23" fontSize="18" fontWeight="900" fill="white" fontFamily="Inter, sans-serif">Ai</text>
            </svg>
            <span className="font-bold text-[15px] text-[#1d1d1f] tracking-tight">AI Central</span>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-0.5 rounded-lg p-0.5" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
            <button
              onClick={() => setView('shelf')}
              title="Shelf view"
              className={`p-1.5 rounded-md transition-all duration-150 ${view === 'shelf' ? 'bg-white shadow-sm text-[#E48715]' : 'text-[#86868b]'}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="3" width="5" height="13" rx="1.5" />
                <rect x="9.5" y="5" width="5" height="11" rx="1.5" />
                <rect x="17" y="4" width="5" height="12" rx="1.5" />
                <rect x="1" y="17.5" width="22" height="2" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setView('list')}
              title="List view"
              className={`p-1.5 rounded-md transition-all duration-150 ${view === 'list' ? 'bg-white shadow-sm text-[#E48715]' : 'text-[#86868b]'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
                <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full pl-8 pr-4 py-2 text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none transition-all"
            style={{
              borderRadius: 10,
              backgroundColor: 'rgba(0,0,0,0.06)',
              border: 'none',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
              </svg>
            </button>
          )}
        </div>

        {/* Type pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {TYPE_FILTERS.map((type) => {
            const isActive = activeType === type;
            const label = TYPE_LABELS[type] ?? type;
            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className="flex-shrink-0 text-[12px] font-semibold px-3.5 py-1.5 rounded-full transition-all duration-150"
                style={{
                  backgroundColor: isActive ? '#E48715' : 'rgba(0,0,0,0.06)',
                  color: isActive ? '#fff' : '#1d1d1f',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="py-6">
        {view === 'list' ? (
          /* List view */
          <div className="px-5">
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-sm text-[#86868b]">No resources match your search.</p>
              </div>
            ) : (
              filtered.map((r) => <ResourceRow key={r.id} {...r} />)
            )}
          </div>
        ) : isFiltering ? (
          /* Shelf view — filtered flat grid */
          <>
            <p className="px-5 mb-4 text-[12px] text-[#86868b]">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </p>
            <FlatGrid books={filtered} />
          </>
        ) : (
          /* Shelf view — grouped sections */
          <div className="flex flex-col gap-8">
            {SECTIONS.map(({ label, type }) => (
              <Section
                key={type}
                label={label}
                books={resources.filter((r) => r.type === type)}
                onSeeAll={() => setActiveType(type)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
      >
        <span className="text-[11px] text-[#86868b]">Powered by AI Central</span>
        <a
          href="https://gptcentral.tradepub.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-semibold text-[#E48715] hover:opacity-70 transition-opacity"
        >
          Browse all →
        </a>
      </div>
    </div>
  );
}
