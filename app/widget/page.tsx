import { parseFeed } from '@/lib/parseFeed';
import ResourceCard from '@/components/ResourceCard';

export const revalidate = 3600;

interface WidgetPageProps {
  searchParams: Promise<{ limit?: string; theme?: string }>;
}

export default async function WidgetPage({ searchParams }: WidgetPageProps) {
  const params = await searchParams;
  const limit = Math.min(parseInt(params.limit ?? '12', 10), 50);
  const theme = params.theme === 'dark' ? 'dark' : 'light';

  let resources = [];
  try {
    const all = await parseFeed();
    resources = all.slice(0, limit);
  } catch {
    // Show empty state on feed error
  }

  const isDark = theme === 'dark';
  const bg = isDark ? '#1a1a2e' : '#FFFDFA';
  const headerText = isDark ? '#FFFDFA' : '#333333';
  const subText = isDark ? '#9C9C9C' : '#9C9C9C';

  return (
    <div
      className="min-h-screen p-5 font-sans"
      style={{ backgroundColor: bg }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E48715]">
        <div className="flex items-center gap-2">
          {/* AI Central logo mark */}
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#E48715" />
            <text x="4" y="23" fontSize="18" fontWeight="900" fill="#FFFDFA" fontFamily="Inter, sans-serif">Ai</text>
          </svg>
          <span className="font-bold text-sm tracking-wide" style={{ color: headerText }}>
            AI Central
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: subText }}>
          Free Resources
        </span>
      </div>

      {/* Grid */}
      {resources.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {resources.map((r) => (
            <ResourceCard key={r.id} {...r} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-40">
          <p className="text-sm" style={{ color: subText }}>
            Unable to load resources. Try again later.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-[#E48715] flex items-center justify-between">
        <span className="text-[10px]" style={{ color: subText }}>
          Powered by AI Central
        </span>
        <a
          href="https://gptcentral.tradepub.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-semibold text-[#E48715] hover:underline"
        >
          View all resources →
        </a>
      </div>
    </div>
  );
}
