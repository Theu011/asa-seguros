import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

type AlertVariant = 'warning' | 'info' | 'success' | 'urgent';

interface AlertCardProps {
  variant?: AlertVariant;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const variantConfig: Record<
  AlertVariant,
  { bg: string; border: string; icon: React.ReactNode; barColor: string }
> = {
  urgent: {
    bg: 'rgba(239,68,68,0.05)',
    border: 'rgba(239,68,68,0.2)',
    barColor: '#ef4444',
    icon: <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#ef4444' }} />,
  },
  warning: {
    bg: 'rgba(245,158,11,0.05)',
    border: 'rgba(245,158,11,0.2)',
    barColor: '#F6A800',
    icon: <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#D97706' }} />,
  },
  info: {
    bg: 'rgba(37,99,235,0.04)',
    border: 'rgba(37,99,235,0.15)',
    barColor: '#2563EB',
    icon: <Info className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#2563EB' }} />,
  },
  success: {
    bg: 'rgba(16,185,129,0.05)',
    border: 'rgba(16,185,129,0.2)',
    barColor: '#10b981',
    icon: <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#10b981' }} />,
  },
};

export function AlertCard({ variant = 'info', title, description, action }: AlertCardProps) {
  const cfg = variantConfig[variant];
  return (
    <div
      className="relative flex gap-3 rounded-2xl overflow-hidden p-4"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: cfg.barColor }}
      />
      <div className="pl-1">{cfg.icon}</div>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold"
          style={{
            color: 'var(--c900)',
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
          }}
        >
          {title}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed" style={{ color: 'var(--c600)' }}>
          {description}
        </p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}
