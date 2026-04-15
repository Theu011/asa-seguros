'use client';

import { useState, useMemo } from 'react';
import {
  Car, Home, Heart, Building2, Plane,
  RefreshCw, MessageCircle, FileText,
  ChevronRight, TrendingUp, TrendingDown,
  Minus, CheckCircle2, Clock, AlertTriangle,
  X, CalendarDays,
} from 'lucide-react';
import { mockRenewals } from '@/mock/renewals';
import { mockBroker } from '@/mock/broker';
import { formatDate, formatCurrency, policyTypeLabel, renewalStatusLabel } from '@/lib/utils';
import type { RenewalStatus, PolicyType } from '@/types';

// ── WhatsApp SVG ──────────────────────────────────────────────────
const WhatsAppSvg = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, ...style }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.845L.057 23.885a.5.5 0 0 0 .613.613l6.04-1.478A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.795 9.795 0 0 1-5.012-1.376l-.36-.214-3.722.91.927-3.635-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
  </svg>
);

// ── Config maps ───────────────────────────────────────────────────
const typeIcon: Record<PolicyType, React.ElementType> = {
  auto: Car, residencial: Home, vida: Heart, empresarial: Building2, viagem: Plane,
};

const typeAccent: Record<PolicyType, { color: string; bg: string; border: string }> = {
  auto:        { color: '#2563EB', bg: 'rgba(37,99,235,0.08)',  border: 'rgba(37,99,235,0.18)' },
  residencial: { color: '#D97706', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.20)' },
  vida:        { color: '#DC2626', bg: 'rgba(239,68,68,0.07)',  border: 'rgba(239,68,68,0.18)' },
  empresarial: { color: '#7C3AED', bg: 'rgba(109,40,217,0.07)', border: 'rgba(109,40,217,0.18)' },
  viagem:      { color: '#0D9488', bg: 'rgba(13,148,136,0.08)', border: 'rgba(13,148,136,0.20)' },
};

const statusConfig: Record<RenewalStatus, {
  label: string; color: string; bg: string; border: string; dot: string; icon: React.ElementType;
  cardBorder: string; urgency: number;
}> = {
  aguardando_cliente: {
    label: 'Aguardando você', color: '#D97706', bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.20)', dot: '#F59E0B', icon: AlertTriangle,
    cardBorder: 'rgba(245,158,11,0.25)', urgency: 1,
  },
  proposta_recebida: {
    label: 'Proposta recebida', color: '#059669', bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.20)', dot: '#10B981', icon: FileText,
    cardBorder: 'rgba(16,185,129,0.25)', urgency: 2,
  },
  em_analise: {
    label: 'Em análise', color: '#2563EB', bg: 'rgba(37,99,235,0.08)',
    border: 'rgba(37,99,235,0.18)', dot: '#3B82F6', icon: Clock,
    cardBorder: '#e2e8f0', urgency: 3,
  },
  renovado: {
    label: 'Renovado', color: '#64748B', bg: 'rgba(100,116,139,0.08)',
    border: 'rgba(100,116,139,0.18)', dot: '#94A3B8', icon: CheckCircle2,
    cardBorder: '#e2e8f0', urgency: 4,
  },
};

// ── Filter pill ───────────────────────────────────────────────────
function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
        whiteSpace: 'nowrap' as const,
        fontFamily: 'var(--font-inter, Inter, sans-serif)',
        transition: 'all 0.12s',
        background: active ? '#2563EB' : '#ffffff',
        color: active ? '#fff' : '#475569',
        border: active ? '1px solid #2563EB' : '1px solid #e2e8f0',
        boxShadow: active ? '0 1px 4px rgba(37,99,235,0.25)' : '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      {label}
    </button>
  );
}

// ── Renewal card ─────────────────────────────────────────────────
function RenewalCard({ renewal }: { renewal: typeof mockRenewals[0] }) {
  const Icon    = typeIcon[renewal.type];
  const accent  = typeAccent[renewal.type];
  const status  = statusConfig[renewal.status];
  const StatusIcon = status.icon;

  const diff = renewal.proposedPremium && renewal.currentPremium
    ? renewal.proposedPremium - renewal.currentPremium : null;
  const pct = diff && renewal.currentPremium
    ? ((diff / renewal.currentPremium) * 100).toFixed(1) : null;

  const waLink = `https://wa.me/55${mockBroker.whatsapp.replace(/\D/g, '')}`;

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      border: `1px solid ${status.cardBorder}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>
      {/* ── Header row ── */}
      <div style={{ padding: '18px 22px 16px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* Type icon */}
        <div style={{
          flexShrink: 0, width: 44, height: 44, borderRadius: 12,
          background: accent.bg, border: `1.5px solid ${accent.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon style={{ width: 20, height: 20, color: accent.color }} />
        </div>

        {/* Title + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
            <p style={{
              fontSize: 15, fontWeight: 700, color: '#0f172a',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              letterSpacing: '-0.015em',
            }}>
              {policyTypeLabel[renewal.type]}
            </p>
            {/* Status badge */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 20,
              fontSize: 11, fontWeight: 600,
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              background: status.bg, color: status.color,
              border: `1px solid ${status.border}`,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.dot, flexShrink: 0 }} />
              {status.label}
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            {renewal.insurer}
            <span style={{ color: '#cbd5e1', margin: '0 6px' }}>·</span>
            <span style={{ color: '#94a3b8' }}>{renewal.policyNumber}</span>
          </p>
        </div>

        {/* Expiration */}
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end', marginBottom: 2 }}>
            <CalendarDays style={{ width: 13, height: 13, color: '#94a3b8' }} />
            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-sora)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Vencimento
            </span>
          </div>
          <p style={{
            fontSize: 14, fontWeight: 700, color: '#0f172a',
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
          }}>
            {formatDate(renewal.expirationDate)}
          </p>
        </div>
      </div>

      {/* ── Premium comparison ── */}
      {renewal.currentPremium && (
        <div style={{
          margin: '0 22px',
          padding: '14px 16px',
          borderRadius: 12,
          background: '#f8fafc',
          border: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', gap: 0,
          marginBottom: 14,
        }}>
          {/* Current */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8', fontFamily: 'var(--font-sora)', marginBottom: 4 }}>
              Prêmio atual
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-sora)', letterSpacing: '-0.02em' }}>
              {formatCurrency(renewal.currentPremium)}
            </p>
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>por ano</p>
          </div>

          {/* Arrow */}
          <ChevronRight style={{ width: 18, height: 18, color: '#cbd5e1', flexShrink: 0, margin: '0 12px' }} />

          {/* Proposed */}
          {renewal.proposedPremium ? (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8', fontFamily: 'var(--font-sora)', marginBottom: 4 }}>
                Nova proposta
              </p>
              <p style={{ fontSize: 18, fontWeight: 700, color: diff! > 0 ? '#D97706' : diff! < 0 ? '#059669' : '#0f172a', fontFamily: 'var(--font-sora)', letterSpacing: '-0.02em' }}>
                {formatCurrency(renewal.proposedPremium)}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                {diff! > 0 && <TrendingUp style={{ width: 12, height: 12, color: '#D97706' }} />}
                {diff! < 0 && <TrendingDown style={{ width: 12, height: 12, color: '#059669' }} />}
                {diff === 0 && <Minus style={{ width: 12, height: 12, color: '#94a3b8' }} />}
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: diff! > 0 ? '#D97706' : diff! < 0 ? '#059669' : '#94a3b8',
                }}>
                  {diff! > 0 ? '+' : ''}{pct}% {diff! > 0 ? 'de reajuste' : diff! < 0 ? 'de redução' : 'sem alteração'}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8', fontFamily: 'var(--font-sora)', marginBottom: 4 }}>
                Nova proposta
              </p>
              <p style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'var(--font-inter)', fontStyle: 'italic' }}>
                Em preparação...
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Notes ── */}
      {renewal.notes && (
        <div style={{ margin: '0 22px', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <StatusIcon style={{ width: 14, height: 14, color: status.color, flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              {renewal.notes}
            </p>
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div style={{
        padding: '14px 22px',
        borderTop: '1px solid #f1f5f9',
        background: '#fafbfc',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '8px 16px', borderRadius: 10,
            background: 'rgba(34,197,94,0.10)',
            border: '1px solid rgba(34,197,94,0.30)',
            color: '#16a34a', fontSize: 13, fontWeight: 600,
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
            textDecoration: 'none', whiteSpace: 'nowrap',
            transition: 'all 0.12s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.18)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.10)'; }}
        >
          <WhatsAppSvg style={{ width: 14, height: 14 }} />
          Falar com corretor
        </a>

        {renewal.hasProposal && renewal.status !== 'renovado' && (
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '8px 16px', borderRadius: 10,
            background: 'linear-gradient(135deg, #1a3470 0%, #2563EB 100%)',
            border: 'none', color: '#fff',
            fontSize: 13, fontWeight: 600,
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
            cursor: 'pointer', whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(37,99,235,0.28)',
            transition: 'all 0.12s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(37,99,235,0.40)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(37,99,235,0.28)'; }}
          >
            <FileText style={{ width: 14, height: 14 }} />
            Ver proposta
          </button>
        )}

        {renewal.status === 'renovado' && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: '#64748b',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
          }}>
            <CheckCircle2 style={{ width: 14, height: 14, color: '#10B981' }} />
            Renovação concluída
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function RenovacoesPage() {
  const [statusFilter, setStatusFilter] = useState<RenewalStatus | 'todos'>('todos');

  const statusOptions: { value: RenewalStatus | 'todos'; label: string }[] = [
    { value: 'todos',              label: 'Todas' },
    { value: 'aguardando_cliente', label: 'Aguardando você' },
    { value: 'proposta_recebida',  label: 'Proposta recebida' },
    { value: 'em_analise',         label: 'Em análise' },
    { value: 'renovado',           label: 'Renovado' },
  ];

  const sorted = useMemo(() =>
    [...mockRenewals].sort((a, b) =>
      statusConfig[a.status].urgency - statusConfig[b.status].urgency
    ), []);

  const filtered = useMemo(() =>
    statusFilter === 'todos' ? sorted : sorted.filter(r => r.status === statusFilter),
    [statusFilter, sorted]);

  const stats = useMemo(() => ({
    total:      mockRenewals.length,
    pendentes:  mockRenewals.filter(r => r.status === 'aguardando_cliente').length,
    propostas:  mockRenewals.filter(r => r.status === 'proposta_recebida').length,
    renovados:  mockRenewals.filter(r => r.status === 'renovado').length,
  }), []);

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto' }}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          marginBottom: 32,
          background: 'linear-gradient(135deg, #0f1f45 0%, #1a3470 40%, #2563EB 100%)',
          boxShadow: '0 4px 24px rgba(15,31,69,0.18)',
        }}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full"
          style={{ border: '32px solid rgba(255,255,255,0.04)' }} />
        <div className="pointer-events-none absolute -right-3 top-1/2 -translate-y-1/2 h-32 w-32 rounded-full"
          style={{ border: '20px solid rgba(255,255,255,0.03)' }} />
        <div className="pointer-events-none absolute left-1/3 -bottom-8 h-36 w-36 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />

        <div className="relative" style={{ padding: '36px 40px' }}>
          <div style={{
            marginBottom: 16,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            borderRadius: 100, padding: '5px 12px',
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <RefreshCw style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.7)' }} />
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
            }}>
              Renovações
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
                fontWeight: 700, letterSpacing: '-0.03em',
                color: '#ffffff', lineHeight: 1.1,
              }}>
                Minhas Renovações
              </h1>
              <p style={{
                marginTop: 10, fontSize: 14,
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                lineHeight: 1.6,
              }}>
                {stats.pendentes > 0
                  ? <><span style={{ color: '#fbbf24', fontWeight: 600 }}>{stats.pendentes} aguardando sua confirmação</span> — verifique as propostas.</>
                  : 'Acompanhe o status das renovações dos seus seguros.'}
              </p>
            </div>

            <a
              href={`https://wa.me/55${mockBroker.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 8,
                borderRadius: 12, padding: '10px 18px',
                fontSize: 13, fontWeight: 600,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.20)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; }}
            >
              <MessageCircle style={{ width: 15, height: 15 }} />
              Falar com corretor
            </a>
          </div>
        </div>
      </div>

      {/* ── Stats bar ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total',             value: stats.total,     color: '#0f172a', bg: '#ffffff',                    border: '#e2e8f0' },
          { label: 'Aguardando você',   value: stats.pendentes, color: '#D97706', bg: 'rgba(245,158,11,0.06)',      border: 'rgba(245,158,11,0.20)' },
          { label: 'Proposta recebida', value: stats.propostas, color: '#059669', bg: 'rgba(16,185,129,0.06)',      border: 'rgba(16,185,129,0.20)' },
          { label: 'Renovados',         value: stats.renovados, color: '#64748b', bg: '#ffffff',                   border: '#e2e8f0' },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} style={{
            flex: 1, background: bg, border: `1px solid ${border}`,
            borderRadius: 14, padding: '14px 18px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}>
            <span style={{
              display: 'block', fontSize: 24, fontWeight: 700,
              lineHeight: 1, color,
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              letterSpacing: '-0.02em',
            }}>
              {value}
            </span>
            <span style={{
              display: 'block', marginTop: 4, fontSize: 12,
              color: '#64748b', fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Status filter bar ─────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 20, flexWrap: 'wrap',
      }}>
        {statusOptions.map(({ value, label }) => (
          <FilterPill
            key={value}
            label={label}
            active={statusFilter === value}
            onClick={() => setStatusFilter(value)}
          />
        ))}
        {statusFilter !== 'todos' && (
          <button
            onClick={() => setStatusFilter('todos')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', borderRadius: 8,
              border: 'none', background: 'none',
              fontSize: 12, color: '#94a3b8', cursor: 'pointer',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            <X style={{ width: 12, height: 12 }} />
            Limpar
          </button>
        )}
      </div>

      {/* ── Results label ─────────────────────────────────────────── */}
      <p style={{
        fontSize: 13, color: '#94a3b8', marginBottom: 14,
        fontFamily: 'var(--font-sora, Sora, sans-serif)',
      }}>
        {filtered.length === mockRenewals.length
          ? `${filtered.length} renovações`
          : `${filtered.length} de ${mockRenewals.length} renovações`}
      </p>

      {/* ── Renewal cards ─────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '60px 20px', textAlign: 'center',
          background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'rgba(37,99,235,0.07)',
            border: '1.5px solid rgba(37,99,235,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <RefreshCw style={{ width: 24, height: 24, color: '#2563EB' }} />
          </div>
          <p style={{
            fontSize: 15, fontWeight: 700, color: '#0f172a',
            fontFamily: 'var(--font-sora, Sora, sans-serif)', marginBottom: 6,
          }}>
            Nenhuma renovação nessa categoria
          </p>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>
            Tente remover o filtro ou entre em contato com seu corretor.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(520px, 1fr))', gap: 16 }}>
          {filtered.map(renewal => (
            <RenewalCard key={renewal.id} renewal={renewal} />
          ))}
        </div>
      )}
    </div>
  );
}
