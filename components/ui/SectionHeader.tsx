import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

export function SectionHeader({
  title,
  viewAllHref,
  viewAllLabel = 'Ver todos',
  className,
}: SectionHeaderProps) {
  return (
    <div className={`mb-5 flex items-center justify-between gap-3 ${className ?? ''}`}>
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="shrink-0 h-3.5 w-[3px] rounded-full"
          style={{ background: 'var(--asa)', opacity: 0.65 }}
        />
        <h2
          className="text-[13px] font-semibold truncate"
          style={{
            color: 'var(--c900)',
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
            letterSpacing: '-0.015em',
          }}
        >
          {title}
        </h2>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="shrink-0 text-[12px] font-medium transition-colors"
          style={{
            color: 'var(--c500)',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--asa)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--c500)')}
        >
          {viewAllLabel} →
        </Link>
      )}
    </div>
  );
}
