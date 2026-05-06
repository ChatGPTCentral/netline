'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
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

const MOST_SEARCHED = [
  'ChatGPT prompts', 'Claude AI', 'Canva AI', 'automation',
  'marketing AI', 'GPT-5', 'productivity', 'cybersecurity',
];

const INTENT_MAP: Record<string, string> = {
  'chatgpt': 'AI assistant guides',
  'claude':  'Anthropic AI resources',
  'canva':   'design & creative AI',
  'market':  'marketing strategy',
  'auto':    'workflow automation',
  'secur':   'cybersecurity resources',
  'produc':  'productivity tools',
  'data':    'data & analytics',
  'prompt':  'prompt engineering',
  'llm':     'large language models',
};

function detectIntent(q: string): string | null {
  const lower = q.toLowerCase();
  for (const [key, label] of Object.entries(INTENT_MAP)) {
    if (lower.includes(key)) return label;
  }
  return null;
}

// ─── Dynamic Island Search ────────────────────────────────────────────────────

function DynamicIslandSearch({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('ai_saved_searches') ?? '[]');
      if (Array.isArray(stored)) setSavedSearches(stored);
    } catch {}
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function saveSearch(term: string) {
    if (!term.trim() || savedSearches.includes(term)) return;
    const updated = [term, ...savedSearches].slice(0, 8);
    setSavedSearches(updated);
    localStorage.setItem('ai_saved_searches', JSON.stringify(updated));
  }

  function removeSaved(term: string) {
    const updated = savedSearches.filter((s) => s !== term);
    setSavedSearches(updated);
    localStorage.setItem('ai_saved_searches', JSON.stringify(updated));
  }

  function applyTerm(term: string) {
    onQueryChange(term);
    saveSearch(term);
    setFocused(false);
    inputRef.current?.blur();
  }

  const intent = query.length > 1 ? detectIntent(query) : null;
  const showDropdown = focused && (savedSearches.length > 0 || MOST_SEARCHED.length > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Island pill */}
      <div
        className={`relative flex items-center transition-all duration-300 ${focused ? 'neon-island' : ''}`}
        style={{
          backgroundColor: '#111',
          borderRadius: 999,
          border: focused ? '1.5px solid rgba(0,210,255,0.7)' : '1.5px solid rgba(255,255,255,0.08)',
          padding: focused ? '10px 16px' : '8px 14px',
        }}
      >
        {/* Search icon */}
        <svg className="flex-shrink-0 w-3.5 h-3.5 mr-2.5" style={{ color: focused ? '#00d2ff' : '#555' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              saveSearch(query.trim());
              setFocused(false);
              inputRef.current?.blur();
            }
          }}
          placeholder="Search resources…"
          className="flex-1 bg-transparent focus:outline-none text-[13px] placeholder-[#444]"
          style={{ color: '#eee' }}
        />

        {/* Intent badge */}
        {intent && (
          <span
            className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: 'rgba(0,210,255,0.15)', color: '#00d2ff', border: '1px solid rgba(0,210,255,0.3)' }}
          >
            {intent}
          </span>
        )}

        {/* Clear */}
        {query && (
          <button
            onClick={() => { onQueryChange(''); inputRef.current?.focus(); }}
            className="ml-2 flex-shrink-0"
            style={{ color: '#555' }}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute left-0 right-0 mt-2 z-50 flex flex-col gap-4 px-4 py-4"
          style={{
            backgroundColor: '#111',
            borderRadius: 20,
            border: '1.5px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          {/* Saved searches */}
          {savedSearches.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#555' }}>Saved</span>
              <div className="flex flex-wrap gap-1.5">
                {savedSearches.map((s) => (
                  <div key={s} className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <button onClick={() => applyTerm(s)} className="text-[11px] font-medium" style={{ color: '#ccc' }}>{s}</button>
                    <button onClick={() => removeSaved(s)} className="ml-0.5" style={{ color: '#444' }}>
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Most searched */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#555' }}>Most Searched</span>
            <div className="flex flex-wrap gap-1.5">
              {MOST_SEARCHED.map((s) => (
                <button
                  key={s}
                  onClick={() => applyTerm(s)}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full transition-all duration-150"
                  style={{ background: 'rgba(0,210,255,0.08)', color: '#00d2ff', border: '1px solid rgba(0,210,255,0.2)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
        {/* Dynamic Island Search */}
        <DynamicIslandSearch query={query} onQueryChange={setQuery} />

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
