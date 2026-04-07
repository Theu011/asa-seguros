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
  { iconBg: string; iconBorder: string; iconColor: string; icon: React.ElementType; dotColor: string }
> = {
  urgent: {
    iconBg: 'rgba(239,68,68,0.08)',
    iconBorder: 'rgba(239,68,68,0.20)',
    iconColor: '#ef4444',
    icon: AlertTriangle,
    dotColor: '#ef4444',
  },
  warning: {
    iconBg: 'rgba(245,158,11,0.08)',
    iconBorder: 'rgba(245,158,11,0.20)',
    iconColor: '#D97706',
    icon: AlertTriangle,
    dotColor: '#F6A800',
  },
  info: {
    iconBg: 'rgba(37,99,235,0.08)',
    iconBorder: 'rgba(37,99,235,0.18)',
    iconColor: '#2563EB',
    icon: Info,
    dotColor: '#2563EB',
  },
  success: {
    iconBg: 'rgba(16,185,129,0.08)',
    iconBorder: 'rgba(16,185,129,0.20)',
    iconColor: '#059669',
    icon: CheckCircle2,
    dotColor: '#10b981',
  },
};

export function AlertCard({ variant = 'info', title, description, action }: AlertCardProps) {
  const cfg = variantConfig[variant];
  const Icon = cfg.icon;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        background: variant === 'urgent' ? 'rgba(239,68,68,0.05)' : variant === 'warning' ? 'rgba(245,158,11,0.05)' : '#ffffff',
        border: variant === 'urgent' ? '1px solid rgba(239,68,68,0.18)' : variant === 'warning' ? '1px solid rgba(245,158,11,0.18)' : '1px solid #e2e8f0',
        borderRadius: 14,
        padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* Icon box — same pattern as PolicyCard / StatCard */}
      <div style={{
        flexShrink: 0,
        width: 38,
        height: 38,
        borderRadius: 10,
        background: cfg.iconBg,
        border: `1.5px solid ${cfg.iconBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon style={{ width: 17, height: 17, color: cfg.iconColor }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <p style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#0f172a',
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
            letterSpacing: '-0.01em',
          }}>
            {title}
          </p>
          {/* Status dot */}
          <span style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: cfg.dotColor,
            flexShrink: 0,
          }} />
        </div>
        <p style={{
          fontSize: 13,
          color: '#64748b',
          lineHeight: 1.6,
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
        }}>
          {description}
        </p>
        {action && <div style={{ marginTop: 10 }}>{action}</div>}
      </div>
    </div>
  );
}
