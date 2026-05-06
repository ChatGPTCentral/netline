'use client';

import { useState, useMemo } from 'react';
import type { Resource } from '@/lib/parseFeed';

const TYPE_FILTERS = ['All', 'eBook', 'White Paper', 'Tips and Tricks Guide'];

const TYPE_LABELS: Record<string, string> = {
  'Tips and Tricks Guide': 'Guide',
};

const TYPE_COLORS: Record<string, string> = {
  'eBook': '#046BB1',
  'White Paper': '#2D8879',
  'Tips and Tricks Guide': '#BE593B',
};

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
        <span
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color }}
        >
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

export default function ResourceLibrary({ resources }: { resources: Resource[] }) {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('All');

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchesType = activeType === 'All' || r.type === activeType;
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.shortDescription.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [resources, query, activeType]);

  return (
    <div className="min-h-screen bg-[#FFFDFA] font-sans">
      {/* Header */}
      <div className="border-b border-[#E48715] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#E48715" />
            <text x="4" y="23" fontSize="18" fontWeight="900" fill="#FFFDFA" fontFamily="Inter, sans-serif">Ai</text>
          </svg>
          <span className="font-bold text-sm text-[#333333] tracking-wide">AI Central</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest font-semibold text-[#9C9C9C]">
          Free Resource Library
        </span>
      </div>

      <div className="px-5 pt-5 pb-2">
        {/* Search */}
        <div className="relative mb-4">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C9C9C]"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
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

        {/* Type filters */}
        <div className="flex flex-wrap gap-2 mb-3">
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

        {/* Count */}
        <p className="text-[11px] text-[#9C9C9C] mb-1">
          Showing {filtered.length} of {resources.length} resources
        </p>
      </div>

      {/* List */}
      <div className="px-5">
        {filtered.length > 0 ? (
          filtered.map((r) => <ResourceRow key={r.id} {...r} />)
        ) : (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-[#9C9C9C]">No resources match your search.</p>
          </div>
        )}
      </div>

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
