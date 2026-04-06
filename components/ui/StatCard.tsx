import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  accentColor?: string;
  accentBg?: string;
  featured?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  accentColor = '#2563EB',
  accentBg = 'rgba(37,99,235,0.08)',
  featured = false,
}: StatCardProps) {
  if (featured) {
    return (
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          padding: '20px',
          background: `linear-gradient(135deg, #0f1f45 0%, ${accentColor} 100%)`,
          boxShadow: `0 4px 16px ${accentColor}30, 0 1px 3px rgba(0,0,0,0.06)`,
        }}
      >
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20"
          style={{ background: 'white' }}
        />

        <div className="relative flex items-start justify-between gap-2">
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.65)',
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
              }}
            >
              {title}
            </p>
            <p
              style={{
                marginTop: 10,
                fontSize: 30,
                fontWeight: 700,
                lineHeight: 1,
                color: '#ffffff',
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                letterSpacing: '-0.02em',
              }}
            >
              {value}
            </p>
            {description && (
              <p style={{ marginTop: 6, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                {description}
              </p>
            )}
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.18)',
            }}
          >
            <Icon style={{ width: 18, height: 18, color: '#fff' }} />
          </div>
        </div>

        {/* Same bottom bar as regular for equal height */}
        <div style={{ marginTop: 16, height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl bg-white"
      style={{
        padding: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--c500)',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
            }}
          >
            {title}
          </p>
          <p
            style={{
              marginTop: 10,
              fontSize: 30,
              fontWeight: 700,
              lineHeight: 1,
              color: 'var(--c900)',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              letterSpacing: '-0.02em',
            }}
          >
            {value}
          </p>
          {description && (
            <p style={{ marginTop: 6, fontSize: 12, color: 'var(--c500)' }}>
              {description}
            </p>
          )}
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: accentBg,
          }}
        >
          <Icon style={{ width: 18, height: 18, color: accentColor }} />
        </div>
      </div>

      <div style={{ marginTop: 16, height: 2, borderRadius: 2, background: accentColor, opacity: 0.18 }} />
    </div>
  );
}
