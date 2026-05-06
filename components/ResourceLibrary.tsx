'use client';

import { useState, useMemo } from 'react';
import type { Resource } from '@/lib/parseFeed';

const TYPE_FILTERS = ['All', 'eBook', 'White Paper'];

const TYPE_COLORS: Record<string, string> = {
  'eBook':       '#046BB1',
  'White Paper': '#2D8879',
};

const SECTIONS = [
  { label: 'eBooks',       type: 'eBook' },
  { label: 'White Papers', type: 'White Paper' },
];

// ─── Book Card ────────────────────────────────────────────────────────────────

function BookCard({ title, type, imageUrl, linkUrl }: Resource) {
  const [imgError, setImgError] = useState(false);
  const color = TYPE_COLORS[type] ?? '#9C9C9C';

  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2"
    >
      <div
        className="w-full overflow-hidden transition-all duration-300 ease-out"
        style={{
          aspectRatio: '2 / 3',
          borderRadius: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)',
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

      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          <span className="text-[10px] font-medium" style={{ color }}>{type}</span>
        </div>
        <p className="text-[11px] text-[#1d1d1f] font-medium leading-tight line-clamp-2">{title}</p>
      </div>
    </a>
  );
}

// ─── 4-column Grid Section ────────────────────────────────────────────────────

function Section({ label, books, onSeeAll }: { label: string; books: Resource[]; onSeeAll: () => void }) {
  if (books.length === 0) return null;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between px-5">
        <h2 className="text-[15px] font-bold text-[#1d1d1f] tracking-tight">{label}</h2>
        <button onClick={onSeeAll} className="text-[13px] font-medium text-[#E48715] hover:opacity-70 transition-opacity">
          See All
        </button>
      </div>
      <div className="px-5 grid grid-cols-4 gap-x-4 gap-y-6">
        {books.map((b) => <BookCard key={b.id} {...b} />)}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ResourceLibrary({ resources }: { resources: Resource[] }) {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('All');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return resources.filter((r) => {
      if (r.type === 'Tips and Tricks Guide') return false;
      const matchesType = activeType === 'All' || r.type === activeType;
      const matchesQuery = !q || r.title.toLowerCase().includes(q) || r.shortDescription.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [resources, query, activeType]);

  const isFiltering = query.length > 0 || activeType !== 'All';

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#F5F5F7' }}>

      {/* Sticky header */}
      <div
        className="sticky top-0 z-20 px-5 pt-4 pb-3 flex flex-col gap-3"
        style={{
          backgroundColor: 'rgba(245,245,247,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="7" fill="#E48715" />
            <text x="4" y="23" fontSize="18" fontWeight="900" fill="white" fontFamily="Inter, sans-serif">Ai</text>
          </svg>
          <span className="font-bold text-[15px] text-[#1d1d1f] tracking-tight">AI Central</span>
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
            className="w-full pl-8 pr-8 py-2 text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none"
            style={{ borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.06)', border: 'none' }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
              </svg>
            </button>
          )}
        </div>

        {/* Type pills */}
        <div className="flex gap-2">
          {TYPE_FILTERS.map((type) => {
            const isActive = activeType === type;
            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className="flex-shrink-0 text-[12px] font-semibold px-3.5 py-1.5 rounded-full transition-all duration-150"
                style={{ backgroundColor: isActive ? '#E48715' : 'rgba(0,0,0,0.06)', color: isActive ? '#fff' : '#1d1d1f' }}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="py-6">
        {isFiltering ? (
          <div className="flex flex-col gap-2">
            <p className="px-5 text-[12px] text-[#86868b]">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </p>
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-sm text-[#86868b]">No resources match your search.</p>
              </div>
            ) : (
              <div className="px-5 grid grid-cols-4 gap-x-4 gap-y-6">
                {filtered.map((b) => <BookCard key={b.id} {...b} />)}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-10">
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

      {/* Footer */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <span className="text-[11px] text-[#86868b]">Powered by AI Central</span>
        <a href="https://gptcentral.tradepub.com" target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-[#E48715] hover:opacity-70 transition-opacity">
          Browse all →
        </a>
      </div>
    </div>
  );
}
