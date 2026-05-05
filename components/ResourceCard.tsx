interface ResourceCardProps {
  id: string;
  title: string;
  shortDescription: string;
  type: string;
  imageUrl: string;
  linkUrl: string;
}

const BADGE_STYLES: Record<string, string> = {
  'eBook': 'bg-[#046BB1] text-white',
  'White Paper': 'bg-[#2D8879] text-white',
  'Tips and Tricks Guide': 'bg-[#BE593B] text-white',
  'Guide': 'bg-[#BE593B] text-white',
};

export default function ResourceCard({
  title,
  shortDescription,
  type,
  imageUrl,
  linkUrl,
}: ResourceCardProps) {
  const badgeStyle = BADGE_STYLES[type] ?? 'bg-[#9C9C9C] text-white';

  return (
    <div className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-[#E8E8E8] hover:shadow-md transition-shadow duration-200">
      {/* Cover image */}
      <div className="relative w-full aspect-[4/3] bg-[#F5F5F5] flex-shrink-0 overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#9C9C9C] text-sm">No image</span>
          </div>
        )}
        {/* Type badge */}
        <span
          className={`absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeStyle}`}
        >
          {type}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <h3 className="text-[#333333] font-bold text-sm leading-snug line-clamp-2">
          {title}
        </h3>
        <p className="text-[#9C9C9C] text-xs leading-relaxed line-clamp-3 flex-1">
          {shortDescription}
        </p>
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-1 bg-[#E48715] hover:bg-[#c97610] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors duration-150"
        >
          Get It Free
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
