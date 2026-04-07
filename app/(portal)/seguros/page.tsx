'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Car, Home, Heart, Building2, Plane,
  Shield, ChevronRight, Calendar, Search,
  Plus, SlidersHorizontal, X,
} from 'lucide-react';
import {
  formatDate, formatCurrency,
  policyTypeLabel, policyStatusLabel,
  daysUntil, isExpired,
} from '@/lib/utils';
import { mockPolicies } from '@/mock/policies';
import type { Policy, PolicyType, PolicyStatus } from '@/types';

// ── Accent system ─────────────────────────────────────────────────
const typeAccent: Record<PolicyType, { bg: string; color: string; border: string; lightBg: string }> = {
  auto:        { bg: 'rgba(37,99,235,0.10)',  color: '#2563EB', border: 'rgba(37,99,235,0.22)', lightBg: 'rgba(37,99,235,0.05)' },
  residencial: { bg: 'rgba(245,158,11,0.10)', color: '#D97706', border: 'rgba(245,158,11,0.22)', lightBg: 'rgba(245,158,11,0.05)' },
  vida:        { bg: 'rgba(239,68,68,0.08)',  color: '#DC2626', border: 'rgba(239,68,68,0.20)', lightBg: 'rgba(239,68,68,0.04)' },
  empresarial: { bg: 'rgba(109,40,217,0.08)', color: '#7C3AED', border: 'rgba(109,40,217,0.20)', lightBg: 'rgba(109,40,217,0.04)' },
  viagem:      { bg: 'rgba(13,148,136,0.10)', color: '#0D9488', border: 'rgba(13,148,136,0.22)', lightBg: 'rgba(13,148,136,0.05)' },
};

const statusStyle: Record<PolicyStatus, { bg: string; color: string; dot: string }> = {
  ativo:        { bg: 'rgba(16,185,129,0.10)', color: '#059669', dot: '#10B981' },
  vencido:      { bg: 'rgba(239,68,68,0.10)',  color: '#DC2626', dot: '#EF4444' },
  cancelado:    { bg: 'rgba(100,116,139,0.10)',color: '#64748B', dot: '#94A3B8' },
  em_renovacao: { bg: 'rgba(37,99,235,0.10)',  color: '#2563EB', dot: '#3B82F6' },
  aguardando:   { bg: 'rgba(245,158,11,0.10)', color: '#D97706', dot: '#F59E0B' },
};

const typeIcon: Record<PolicyType, React.ElementType> = {
  auto: Car,
  residencial: Home,
  vida: Heart,
  empresarial: Building2,
  viagem: Plane,
};

// ── Filter pill ───────────────────────────────────────────────────
function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        whiteSpace: 'nowrap' as const,
        fontFamily: 'var(--font-inter, Inter, sans-serif)',
        transition: 'background 0.12s, color 0.12s, border-color 0.12s',
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

// ── Policy card ────────────────────────────────────────────────────
function PolicyCard({ policy }: { policy: Policy }) {
  const Icon = typeIcon[policy.type];
  const accent = typeAccent[policy.type];
  const st = statusStyle[policy.status];
  const days = daysUntil(policy.endDate);
  const expired = isExpired(policy.endDate);
  const expiringSoon = !expired && days <= 30;

  const dateColor = expired ? '#DC2626' : expiringSoon && days <= 15 ? '#DC2626' : expiringSoon ? '#D97706' : '#64748b';

  return (
    <Link
      href={`/seguros/${policy.id}`}
      className="group flex items-center gap-4 bg-white transition-all duration-200"
      style={{
        borderRadius: 16,
        padding: '16px 20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--asa-mist)';
        el.style.boxShadow = '0 4px 16px rgba(37,99,235,0.08), 0 1px 3px rgba(0,0,0,0.04)';
        el.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = '#e2e8f0';
        el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        el.style.transform = 'translateY(0)';
      }}
    >
      {/* Icon */}
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ background: accent.bg, border: `1.5px solid ${accent.border}` }}
      >
        <Icon className="h-5 w-5" style={{ color: accent.color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#0f172a',
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
            letterSpacing: '-0.01em',
          }}>
            {policyTypeLabel[policy.type]}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{ background: st.bg, color: st.color }}
          >
            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: st.dot }} />
            {policyStatusLabel[policy.status]}
          </span>
        </div>

        <p className="truncate" style={{ fontSize: 12, marginTop: 3, color: '#64748b' }}>
          {policy.insurer} · <span style={{ color: '#94a3b8' }}>{policy.number}</span>
        </p>

        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: dateColor }}>
            <Calendar className="h-3 w-3 shrink-0" />
            Vence {formatDate(policy.endDate)}
            {expiringSoon && !expired && (
              <span className="font-semibold"> · {days}d</span>
            )}
            {expired && <span className="font-semibold"> · Vencido</span>}
          </span>
          <span style={{ color: '#94a3b8' }}>·</span>
          <span style={{ color: '#64748b', fontWeight: 500 }}>{formatCurrency(policy.premium)}/ano</span>
          {policy.insuredItems.length > 0 && (
            <>
              <span style={{ color: '#94a3b8' }}>·</span>
              <span className="truncate" style={{ color: '#64748b' }}>
                {policy.insuredItems[0].value}
              </span>
            </>
          )}
        </div>
      </div>

      <ChevronRight
        className="h-4 w-4 shrink-0 transition-colors duration-150"
        style={{ color: '#cbd5e1' }}
      />
    </Link>
  );
}

// ── Empty state ───────────────────────────────────────────────────
function EmptyState({ query }: { query: string }) {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center py-20 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-3xl mb-5"
        style={{ background: 'rgba(37,99,235,0.07)', border: '1.5px solid rgba(37,99,235,0.12)' }}
      >
        <Shield className="h-8 w-8" style={{ color: 'var(--asa)' }} />
      </div>
      <p className="text-sm font-bold" style={{ color: '#1e293b', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
        {query ? 'Nenhum seguro encontrado' : 'Sem seguros nesta categoria'}
      </p>
      <p className="text-xs mt-1.5" style={{ color: '#94a3b8' }}>
        {query ? `Sem resultados para "${query}"` : 'Tente remover os filtros ou entre em contato.'}
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function SegurosPage() {
  const [typeFilter, setTypeFilter]       = useState<PolicyType | 'todos'>('todos');
  const [statusFilter, setStatusFilter]   = useState<PolicyStatus | 'todos'>('todos');
  const [insurerFilter, setInsurerFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery]     = useState('');
  const [showFilters, setShowFilters]     = useState(false);

  const insurerOptions = useMemo(() => {
    const unique = Array.from(new Set(mockPolicies.map((p) => p.insurer))).sort();
    return [{ value: 'todos', label: 'Todas' }, ...unique.map((v) => ({ value: v, label: v }))];
  }, []);

  const typeOptions: { value: PolicyType | 'todos'; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'auto', label: 'Auto' },
    { value: 'residencial', label: 'Residencial' },
    { value: 'vida', label: 'Vida' },
    { value: 'empresarial', label: 'Empresarial' },
    { value: 'viagem', label: 'Viagem' },
  ];

  const statusOptions: { value: PolicyStatus | 'todos'; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'ativo', label: 'Ativo' },
    { value: 'em_renovacao', label: 'Em Renovação' },
    { value: 'vencido', label: 'Vencido' },
    { value: 'cancelado', label: 'Cancelado' },
    { value: 'aguardando', label: 'Aguardando' },
  ];

  const filtered = useMemo(() => {
    return mockPolicies.filter((p) => {
      if (typeFilter !== 'todos' && p.type !== typeFilter) return false;
      if (statusFilter !== 'todos' && p.status !== statusFilter) return false;
      if (insurerFilter !== 'todos' && p.insurer !== insurerFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !p.number.toLowerCase().includes(q) &&
          !p.insurer.toLowerCase().includes(q) &&
          !policyTypeLabel[p.type].toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [typeFilter, statusFilter, insurerFilter, searchQuery]);

  const stats = useMemo(() => {
    const all = mockPolicies;
    return {
      total:       all.length,
      ativos:      all.filter((p) => p.status === 'ativo').length,
      emRenovacao: all.filter((p) => p.status === 'em_renovacao').length,
      vencidos:    all.filter((p) => isExpired(p.endDate)).length,
    };
  }, []);

  const activeFilterCount = [
    typeFilter !== 'todos',
    statusFilter !== 'todos',
    insurerFilter !== 'todos',
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0 || searchQuery !== '';

  function clearFilters() {
    setTypeFilter('todos');
    setStatusFilter('todos');
    setInsurerFilter('todos');
    setSearchQuery('');
  }

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto' }}>

      {/* ── Hero header ───────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          marginBottom: 32,
          background: 'linear-gradient(135deg, #0f1f45 0%, #1a3470 40%, #2563EB 100%)',
          boxShadow: '0 4px 24px rgba(15,31,69,0.18)',
        }}
      >
        {/* Decorative rings */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full"
          style={{ border: '32px solid rgba(255,255,255,0.04)' }} />
        <div className="pointer-events-none absolute -right-3 top-1/2 -translate-y-1/2 h-32 w-32 rounded-full"
          style={{ border: '20px solid rgba(255,255,255,0.03)' }} />
        <div className="pointer-events-none absolute left-1/3 -bottom-8 h-36 w-36 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />

        <div className="relative" style={{ padding: '36px 40px' }}>
          {/* Eyebrow */}
          <div style={{
            marginBottom: 16,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            borderRadius: 100,
            padding: '5px 12px',
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <Shield style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.7)' }} />
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
            }}>
              Área do Cliente
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
            {/* Title */}
            <div>
              <h1 style={{
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                lineHeight: 1.1,
              }}>
                Meus Seguros
              </h1>
              <p style={{
                marginTop: 10,
                fontSize: 14,
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                lineHeight: 1.6,
              }}>
                {stats.ativos} apólice{stats.ativos !== 1 ? 's' : ''} ativa{stats.ativos !== 1 ? 's' : ''}
                {stats.emRenovacao > 0 && (
                  <span style={{ color: '#fbbf24', fontWeight: 600 }}> · {stats.emRenovacao} em renovação</span>
                )}
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/cotacao"
              style={{
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                borderRadius: 12,
                padding: '10px 18px',
                fontSize: 13,
                fontWeight: 600,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                backdropFilter: 'blur(8px)',
                textDecoration: 'none',
                transition: 'background 0.15s, transform 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <Plus style={{ width: 15, height: 15 }} />
              Solicitar seguro
            </Link>

          </div>
        </div>
      </div>

      {/* ── Quick stats bar ───────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total de apólices', value: stats.total,       color: '#0f172a',  bg: '#ffffff',                    border: '#e2e8f0' },
          { label: 'Apólices ativas',   value: stats.ativos,      color: '#059669',  bg: 'rgba(16,185,129,0.06)',      border: 'rgba(16,185,129,0.18)' },
          { label: 'Em renovação',       value: stats.emRenovacao, color: '#2563EB',  bg: 'rgba(37,99,235,0.06)',       border: 'rgba(37,99,235,0.18)' },
          { label: 'Vencidas',           value: stats.vencidos,    color: '#DC2626',  bg: 'rgba(239,68,68,0.06)',       border: 'rgba(239,68,68,0.18)' },
        ].map(({ label, value, color, bg, border }) => (
          <div
            key={label}
            style={{
              flex: 1,
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: 14,
              padding: '14px 18px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            <span style={{
              display: 'block',
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 1,
              color,
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              letterSpacing: '-0.02em',
            }}>
              {value}
            </span>
            <span style={{
              display: 'block',
              marginTop: 4,
              fontSize: 12,
              color: '#64748b',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Search + filter toggle ─────────────────────────────────── */}
      <div
        className="flex items-center bg-white"
        style={{
          marginBottom: 16,
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Search */}
        <div className="flex flex-1 items-center gap-3" style={{ padding: '13px 18px' }}>
          <Search className="h-[17px] w-[17px] shrink-0" style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Buscar por seguradora, número ou tipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            style={{
              fontSize: 14,
              color: '#0f172a',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{ background: '#f1f5f9', color: '#94a3b8' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#e2e8f0'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#f1f5f9'; }}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: '#e2e8f0', flexShrink: 0 }} />

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-2 font-semibold"
          style={{
            fontSize: 13,
            padding: '13px 20px',
            background: showFilters ? 'rgba(37,99,235,0.06)' : 'transparent',
            color: showFilters ? 'var(--asa)' : '#475569',
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.01em',
            transition: 'background 0.15s, color 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (!showFilters) {
              (e.currentTarget as HTMLElement).style.background = '#f8fafc';
              (e.currentTarget as HTMLElement).style.color = 'var(--asa)';
            }
          }}
          onMouseLeave={(e) => {
            if (!showFilters) {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = '#475569';
            }
          }}
        >
          <SlidersHorizontal className="h-4 w-4 shrink-0" />
          Filtros
          {activeFilterCount > 0 && (
            <span
              className="inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
              style={{
                background: 'var(--asa)',
                color: '#fff',
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Collapsible filters ───────────────────────────────────── */}
      {showFilters && (
        <div
          style={{
            borderRadius: 16,
            padding: '20px 24px 24px',
            marginBottom: 16,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(15,31,69,0.06)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px 32px' }}>
            {([
              { label: 'Tipo', options: typeOptions, value: typeFilter, set: setTypeFilter },
              { label: 'Status', options: statusOptions, value: statusFilter, set: setStatusFilter as (v: string) => void },
              { label: 'Seguradora', options: insurerOptions, value: insurerFilter, set: setInsurerFilter },
            ] as const).map(({ label, options, value, set }) => (
              <div key={label}>
                <p style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#94a3b8',
                  fontFamily: 'var(--font-sora, Sora, sans-serif)',
                  marginBottom: 10,
                }}>
                  {label}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {options.map(({ value: v, label: l }) => (
                    <FilterPill
                      key={v}
                      label={l}
                      active={value === v}
                      onClick={() => set(v as never)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {hasActiveFilters && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
              <button
                onClick={clearFilters}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#DC2626',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <X className="h-3.5 w-3.5" />
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Results bar ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <p className="text-xs font-medium" style={{ color: '#94a3b8', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
          {filtered.length === mockPolicies.length
            ? `${filtered.length} apólices`
            : `${filtered.length} de ${mockPolicies.length} apólices`}
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-semibold flex items-center gap-1"
            style={{ color: '#94a3b8', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}
          >
            <X className="h-3 w-3" />
            Limpar
          </button>
        )}
      </div>

      {/* ── Policy grid ───────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <EmptyState query={searchQuery} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      )}
    </div>
  );
}
