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

const DISPLAY_NAMES: Record<string, string> = {
  'ai':           'AI',
  'chatgpt':      'ChatGPT',
  'prompts':      'Prompts',
  'tools':        'Tools',
  'gpt':          'GPT',
  'marketers':    'Marketers',
  'content':      'Content',
  'creators':     'Creators',
  'workflow':     'Workflow',
  'engineering':  'Engineering',
  'productivity': 'Productivity',
  'design':       'Design',
  'claude':       'Claude',
  'business':     'Business',
  'sales':        'Sales',
  'automation':   'Automation',
  'linkedin':     'LinkedIn',
  'templates':    'Templates',
  'presentations':'Presentations',
  'research':     'Research',
  'skills':       'Skills',
  'brand':        'Brand',
  'growth':       'Growth',
  'video':        'Video',
};

const STOP = new Set([
  'to','in','by','of','on','at','or','it','is','be','do','an','so','if','as',
  'up','go','my','no','we','me','us','am','pm','vs','re',
  'the','and','for','are','but','not','you','all','can','was','our','out',
  'use','get','has','how','its','may','new','now','see','two','way','who',
  'did','too','what','with','this','that','from','they','have','will','your',
  'when','more','each','most','into','also','been','than','then','them','some',
  'only','make','like','time','just','know','take','good','year','come','over',
  'here','well','need','free','best','help','work','even','back','any','first',
  'these','those','would','there','their','about','which','could','other','after',
  'every','using','being','such','both','should','right','where','much','before',
  'never','today','while','often','still','must','want','find','many','does',
  'done','used','ebook','paper','book','white','based','real','learn','ways',
  'list','things','across','within','below','above','around','own','few',
  'say','per','put','set','got','had','his','him','her','via','non','yet','nor',
  'off','let','due','ago','try','run','end','big','old','lot','far','low','pay',
  'ask','day','sub','pro','pre','tips','guide','guides','report','resource',
  'download','click','read','access','discover','explore','complete','ultimate',
  'essential','powerful','effective','comprehensive','approach','solution',
  'platform','service','one','three','ten','five','top','key','type',
  'value','limited','high','lead','fast','smart','simple','easy','quick',
  'whether','without','including','between','through','during','number','point',
  'areas','fact','part','keep','grow','build','drive','boost','create','improve',
  'turn','ready','unlock','leverage','master','understand','avoid','achieve',
  'develop','show','give','look','step','think','start','begin','along',
  'faster','better','smarter','perfect','proven','powered','practical','results',
  'leading','produce','easily','written','process','four','six','seven','eight',
  'nine','ideas','minutes','hours','steps','outputs','polished','expert',
  'scale','voice','teams','decks','save','professionals','prompt',
]);

function computeTopKeywords(resources: Resource[]): string[] {
  const freq = new Map<string, number>();
  for (const r of resources) {
    const text = `${r.title} ${r.shortDescription}`.toLowerCase();
    const words = new Set((text.match(/\b[a-z]{2,}\b/g) ?? []));
    for (const w of words) {
      if (!STOP.has(w)) freq.set(w, (freq.get(w) ?? 0) + 1);
    }
  }
  const candidates = Array.from(freq.entries())
    .filter(([, c]) => c >= 7)
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w);

  // Remove singular when its plural is also present (e.g. "workflow" if "workflows" exists)
  const candidateSet = new Set(candidates);
  return candidates
    .filter(w => !candidateSet.has(w + 's') && !candidateSet.has(w + 'es'))
    .slice(0, 15);
}

function fmt(word: string): string {
  return DISPLAY_NAMES[word] ?? (word.charAt(0).toUpperCase() + word.slice(1));
}

// ─── Intent detection ─────────────────────────────────────────────────────────

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
  'sale':    'sales enablement',
  'design':  'design resources',
  'video':   'video creation',
  'brand':   'brand building',
};

function detectIntent(q: string): string | null {
  const lower = q.toLowerCase();
  for (const [key, label] of Object.entries(INTENT_MAP)) {
    if (lower.includes(key)) return label;
  }
  return null;
}

// ─── Search Bar ───────────────────────────────────────────────────────────────

function SearchBar({
  query,
  onQueryChange,
  onSaveSearch,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  onSaveSearch: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const intent = query.length > 1 ? detectIntent(query) : null;

  return (
    <div
      className="neon-island relative flex items-center gap-2"
      style={{
        background: '#ffffff',
        borderRadius: 999,
        padding: '9px 14px',
        border: 'none',
      }}
    >
      <svg className="flex-shrink-0 w-3.5 h-3.5" style={{ color: '#aaa' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <circle cx="11" cy="11" r="8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
      </svg>

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && query.trim()) {
            onSaveSearch(query.trim());
            inputRef.current?.blur();
          }
        }}
        placeholder="Search resources…"
        className="flex-1 bg-transparent focus:outline-none text-[13px] placeholder-[#aaa]"
        style={{ color: '#1d1d1f' }}
      />

      {intent && (
        <span
          className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(0,180,255,0.1)', color: '#0090cc', border: '1px solid rgba(0,180,255,0.25)' }}
        >
          {intent}
        </span>
      )}

      {query && (
        <button onClick={() => { onQueryChange(''); inputRef.current?.focus(); }} className="flex-shrink-0" style={{ color: '#bbb' }}>
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
          </svg>
        </button>
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
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('ai_saved_searches') ?? '[]');
      if (Array.isArray(stored)) setSavedSearches(stored);
    } catch {}
  }, []);

  const topKeywords = useMemo(() => computeTopKeywords(resources), [resources]);

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

  function applyChip(label: string) {
    setQuery(label);
    saveSearch(label);
  }

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#F5F5F7' }}>

      {/* Sticky header */}
      <div
        className="sticky top-0 z-20 px-5 pt-4 pb-3 flex flex-col gap-3"
        style={{
          backgroundColor: 'rgba(245,245,247,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {/* Search bar */}
        <SearchBar query={query} onQueryChange={setQuery} onSaveSearch={saveSearch} />

        {/* Keyword chips — below the bar, horizontally scrollable */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
          {/* Saved searches */}
          {savedSearches.map((s) => (
            <div
              key={`saved-${s}`}
              className="flex items-center gap-1 flex-shrink-0 rounded-full px-3 py-1"
              style={{ background: 'rgba(228,135,21,0.12)', border: '1px solid rgba(228,135,21,0.3)' }}
            >
              <button
                onClick={() => applyChip(s)}
                className="text-[11px] font-semibold whitespace-nowrap"
                style={{ color: '#c27010' }}
              >
                {s}
              </button>
              <button
                onClick={() => removeSaved(s)}
                className="flex-shrink-0 ml-0.5"
                style={{ color: '#c2701066' }}
              >
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
          ))}

          {/* Smart keyword suggestions */}
          {topKeywords.map((kw) => {
            const label = fmt(kw);
            return (
              <button
                key={kw}
                onClick={() => applyChip(label)}
                className="flex-shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap transition-colors duration-150"
                style={{
                  background: query.toLowerCase() === kw || query === label
                    ? 'rgba(0,160,255,0.18)'
                    : 'rgba(0,0,0,0.05)',
                  color: query.toLowerCase() === kw || query === label ? '#0080cc' : '#444',
                  border: query.toLowerCase() === kw || query === label
                    ? '1px solid rgba(0,160,255,0.35)'
                    : '1px solid transparent',
                }}
              >
                {label}
              </button>
            );
          })}
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
