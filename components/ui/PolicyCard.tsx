import Link from 'next/link';
import { Car, Home, Heart, Building2, Plane, ChevronRight, Calendar } from 'lucide-react';
import { cn, formatDate, policyTypeLabel, policyStatusLabel, policyStatusColor, daysUntil } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import type { Policy } from '@/types';

const typeIcon = {
  auto: Car,
  residencial: Home,
  vida: Heart,
  empresarial: Building2,
  viagem: Plane,
};

const typeAccent: Record<string, { bg: string; color: string; border: string }> = {
  auto:        { bg: 'rgba(37,99,235,0.08)',  color: '#2563EB', border: 'rgba(37,99,235,0.2)' },
  residencial: { bg: 'rgba(245,158,11,0.08)', color: '#D97706', border: 'rgba(245,158,11,0.2)' },
  vida:        { bg: 'rgba(239,68,68,0.07)',  color: '#DC2626', border: 'rgba(239,68,68,0.18)' },
  empresarial: { bg: 'rgba(109,40,217,0.07)', color: '#7C3AED', border: 'rgba(109,40,217,0.18)' },
  viagem:      { bg: 'rgba(13,148,136,0.08)', color: '#0D9488', border: 'rgba(13,148,136,0.2)' },
};

interface PolicyCardProps {
  policy: Policy;
  compact?: boolean;
}

export function PolicyCard({ policy, compact = false }: PolicyCardProps) {
  const Icon = typeIcon[policy.type];
  const accent = typeAccent[policy.type];
  const days = daysUntil(policy.endDate);
  const expiringSoon = days >= 0 && days <= 30;
  const expired = days < 0;

  return (
    <Link
      href={`/seguros/${policy.id}`}
      className="group flex items-center gap-4 rounded-2xl bg-white transition-all duration-200"
      style={{
        border: '1px solid var(--c200)',
        padding: compact ? '12px 16px' : '16px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--asa-mist)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 4px 16px rgba(37,99,235,0.08), 0 1px 3px rgba(0,0,0,0.04)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--c200)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Icon */}
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{
          background: accent.bg,
          border: `1.5px solid ${accent.border}`,
        }}
      >
        <Icon className="h-5 w-5" style={{ color: accent.color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-semibold truncate"
            style={{
              fontSize: 14,
              color: '#0f172a',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              letterSpacing: '-0.01em',
            }}
          >
            {policyTypeLabel[policy.type]}
          </span>
          <StatusBadge
            label={policyStatusLabel[policy.status]}
            colorClass={policyStatusColor[policy.status]}
          />
        </div>
        <p className="truncate" style={{ fontSize: 12, marginTop: 4, color: '#64748b' }}>
          {policy.insurer} · {policy.number}
        </p>
        {!compact && (
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
            <Calendar className="h-3 w-3 shrink-0" />
            <span>Vence em {formatDate(policy.endDate)}</span>
            {expiringSoon && !expired && (
              <span className="font-semibold" style={{ color: '#D97706' }}>
                · {days} dias
              </span>
            )}
            {expired && (
              <span className="font-semibold" style={{ color: '#DC2626' }}>
                · Vencido
              </span>
            )}
          </div>
        )}
      </div>

      <ChevronRight
        className="h-4 w-4 shrink-0 transition-colors duration-150"
        style={{ color: 'var(--c200)' }}
      />
    </Link>
  );
}
