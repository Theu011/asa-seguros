'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Car, Home, Heart, Building2, Plane,
  Shield, ChevronRight, Calendar, Search,
  CheckCircle2, AlertTriangle, Clock, XCircle,
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

const statusStyle: Record<PolicyStatus, { bg: string; color: string; dot: string; icon: React.ReactNode; label: string }> = {
  ativo:        { bg: 'rgba(16,185,129,0.10)', color: '#059669', dot: '#10B981', icon: <CheckCircle2 className="h-3 w-3" />, label: 'Ativo' },
  vencido:      { bg: 'rgba(239,68,68,0.10)',  color: '#DC2626', dot: '#EF4444', icon: <XCircle className="h-3 w-3" />,       label: 'Vencido' },
  cancelado:    { bg: 'rgba(100,116,139,0.10)',color: '#64748B', dot: '#94A3B8', icon: <XCircle className="h-3 w-3" />,       label: 'Cancelado' },
  em_renovacao: { bg: 'rgba(37,99,235,0.10)',  color: '#2563EB', dot: '#3B82F6', icon: <Clock className="h-3 w-3" />,         label: 'Em Renovação' },
  aguardando:   { bg: 'rgba(245,158,11,0.10)', color: '#D97706', dot: '#F59E0B', icon: <AlertTriangle className="h-3 w-3" />, label: 'Aguardando' },
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
      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 whitespace-nowrap"
      style={{
        background: active ? 'var(--asa)' : '#f8fafc',
        color: active ? '#fff' : 'var(--c600)',
        border: active ? '1px solid var(--asa)' : '1px solid #e2e8f0',
        boxShadow: active ? '0 2px 8px rgba(37,99,235,0.22)' : 'none',
        fontFamily: 'var(--font-sora, Sora, sans-serif)',
      }}
    >
      {label}
    </button>
  );
}

// ── Policy card (2-col grid item) ─────────────────────────────────
function PolicyCard({ policy }: { policy: Policy }) {
  const Icon = typeIcon[policy.type];
  const accent = typeAccent[policy.type];
  const st = statusStyle[policy.status];
  const days = daysUntil(policy.endDate);
  const expired = isExpired(policy.endDate);
  const expiringSoon = !expired && days <= 45;

  let expiryChipColor = 'var(--c500)';
  let expiryChipBg = '#f8fafc';
  let expiryChipBorder = '#e2e8f0';
  if (expired) {
    expiryChipColor = '#DC2626';
    expiryChipBg = 'rgba(239,68,68,0.07)';
    expiryChipBorder = 'rgba(239,68,68,0.18)';
  } else if (expiringSoon) {
    expiryChipColor = days <= 15 ? '#DC2626' : '#D97706';
    expiryChipBg = days <= 15 ? 'rgba(239,68,68,0.07)' : 'rgba(245,158,11,0.07)';
    expiryChipBorder = days <= 15 ? 'rgba(239,68,68,0.18)' : 'rgba(245,158,11,0.18)';
  }

  return (
    <Link
      href={`/seguros/${policy.id}`}
      className="group relative flex flex-col rounded-2xl bg-white overflow-hidden transition-all duration-200"
      style={{
        border: '1px solid #e8edf4',
        boxShadow: '0 1px 4px rgba(15,31,69,0.06)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(37,99,235,0.22)';
        el.style.boxShadow = '0 8px 24px rgba(37,99,235,0.10), 0 2px 6px rgba(15,31,69,0.06)';
        el.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = '#e8edf4';
        el.style.boxShadow = '0 1px 4px rgba(15,31,69,0.06)';
        el.style.transform = 'translateY(0)';
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: accent.color }}
      />

      <div className="p-5 pl-6 flex flex-col gap-3">
        {/* ── Top: icon + title + status + chevron ── */}
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: accent.bg, border: `1.5px solid ${accent.border}` }}
          >
            <Icon className="h-5 w-5" style={{ color: accent.color }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p
                className="text-[15px] font-bold leading-tight"
                style={{ color: '#0f172a', fontFamily: 'var(--font-sora, Sora, sans-serif)', letterSpacing: '-0.015em' }}
              >
                {policyTypeLabel[policy.type]}
              </p>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{ background: st.bg, color: st.color, fontFamily: 'var(--font-sora, Sora, sans-serif)' }}
              >
                <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: st.dot }} />
                {policyStatusLabel[policy.status]}
              </span>
            </div>
            <p className="text-xs mt-1" style={{ color: '#64748b', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              {policy.insurer} · <span style={{ color: '#94a3b8' }}>#{policy.number}</span>
            </p>
          </div>

          <ChevronRight
            className="h-4 w-4 shrink-0 text-slate-300 transition-transform duration-150 group-hover:translate-x-0.5"
          />
        </div>

        {/* ── Stat chips ── */}
        <div className="flex flex-wrap gap-2">
          {/* Premium */}
          <div
            className="inline-flex flex-col rounded-xl px-3 py-1.5"
            style={{ background: accent.lightBg, border: `1px solid ${accent.border}` }}
          >
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: accent.color, fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
              Prêmio anual
            </span>
            <span className="text-[13px] font-bold mt-0.5" style={{ color: '#0f172a', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
              {formatCurrency(policy.premium)}
            </span>
          </div>

          {/* Expiry */}
          <div
            className="inline-flex flex-col rounded-xl px-3 py-1.5"
            style={{ background: expiryChipBg, border: `1px solid ${expiryChipBorder}` }}
          >
            <span className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: expiryChipColor, fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
              <Calendar className="h-2.5 w-2.5" />
              Vencimento
            </span>
            <span className="text-[12px] font-semibold mt-0.5" style={{ color: expiryChipColor, fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
              {formatDate(policy.endDate)}
              {expiringSoon && !expired && (
                <span className="ml-1 text-[11px] font-bold">· {days}d</span>
              )}
            </span>
          </div>

          {/* Coverages */}
          <div
            className="inline-flex flex-col rounded-xl px-3 py-1.5"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
          >
            <span className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: '#94a3b8', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
              <Shield className="h-2.5 w-2.5" />
              Coberturas
            </span>
            <span className="text-[12px] font-semibold mt-0.5" style={{ color: '#475569', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
              {policy.coverages.length} itens
            </span>
          </div>

          {/* Deductible */}
          {policy.deductible && (
            <div
              className="inline-flex flex-col rounded-xl px-3 py-1.5"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
            >
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                Franquia
              </span>
              <span className="text-[12px] font-semibold mt-0.5" style={{ color: '#475569', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                {formatCurrency(policy.deductible)}
              </span>
            </div>
          )}
        </div>

        {/* ── Insured item preview ── */}
        {policy.insuredItems.length > 0 && (
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}
          >
            <div
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ background: accent.color }}
            />
            <span className="text-xs truncate" style={{ color: '#64748b', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              <span className="font-medium" style={{ color: '#334155' }}>
                {policy.insuredItems[0].label}:
              </span>{' '}
              {policy.insuredItems[0].value}
            </span>
          </div>
        )}
      </div>
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
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>

      {/* ── Hero header ───────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl mb-6"
        style={{
          background: 'linear-gradient(135deg, #0f1f45 0%, #1a3470 45%, #2563EB 100%)',
          boxShadow: '0 4px 24px rgba(15,31,69,0.18)',
        }}
      >
        {/* Decorative rings */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full"
          style={{ border: '36px solid rgba(255,255,255,0.04)' }} />
        <div className="pointer-events-none absolute right-24 -bottom-12 h-36 w-36 rounded-full"
          style={{ border: '22px solid rgba(255,255,255,0.03)' }} />
        <div className="pointer-events-none absolute left-1/3 -bottom-6 h-32 w-32 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)' }} />

        <div className="relative px-10 py-12 sm:px-16 sm:py-14">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {/* Title */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-3"
                style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                Portal do Cliente
              </p>
              <h1
                className="text-3xl sm:text-4xl font-bold leading-none"
                style={{ color: '#fff', fontFamily: 'var(--font-sora, Sora, sans-serif)', letterSpacing: '-0.03em' }}
              >
                Meus Seguros
              </h1>
              <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-inter, Inter, sans-serif)', lineHeight: 1.6 }}>
                {stats.ativos} apólice{stats.ativos !== 1 ? 's' : ''} ativa{stats.ativos !== 1 ? 's' : ''}
                {stats.emRenovacao > 0 && (
                  <span style={{ color: '#fbbf24' }}> · {stats.emRenovacao} em renovação</span>
                )}
              </p>
            </div>

            {/* Inline stats + CTA */}
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { label: 'Total',    value: stats.total,       color: 'rgba(255,255,255,0.9)' },
                { label: 'Ativos',   value: stats.ativos,      color: '#34d399' },
                { label: 'Vencidos', value: stats.vencidos,    color: '#f87171' },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="flex flex-col items-center px-4 py-2 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <span className="text-xl font-bold leading-none" style={{ color, fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                    {value}
                  </span>
                  <span className="text-[10px] mt-0.5 font-semibold uppercase tracking-wider"
                    style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                    {label}
                  </span>
                </div>
              ))}

              <Link
                href="/atendimento"
                className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontFamily: 'var(--font-sora, Sora, sans-serif)',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.22)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <Plus className="h-4 w-4" />
                Solicitar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + filter toggle ─────────────────────────────────── */}
      <div className="flex gap-2.5 mb-3">
        <div
          className="flex flex-1 items-center gap-2.5 rounded-xl px-3.5 py-2.5 bg-white"
          style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Buscar por seguradora, número ou tipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{
              color: '#0f172a',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ color: '#94a3b8' }}>
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className="relative inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150"
          style={{
            background: showFilters ? 'var(--asa)' : 'white',
            color: showFilters ? '#fff' : '#475569',
            border: showFilters ? '1px solid var(--asa)' : '1px solid #e2e8f0',
            boxShadow: showFilters ? '0 2px 8px rgba(37,99,235,0.25)' : '0 1px 3px rgba(0,0,0,0.04)',
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
          }}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filtros</span>
          {activeFilterCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
              style={{ background: showFilters ? '#fff' : 'var(--asa)', color: showFilters ? 'var(--asa)' : '#fff' }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Collapsible filters ───────────────────────────────────── */}
      {showFilters && (
        <div
          className="rounded-2xl bg-white p-4 mb-4"
          style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <div className="flex flex-col gap-4">
            {([
              { label: 'Tipo', options: typeOptions, value: typeFilter, set: setTypeFilter },
              { label: 'Status', options: statusOptions, value: statusFilter, set: setStatusFilter as (v: string) => void },
              { label: 'Seguradora', options: insurerOptions, value: insurerFilter, set: setInsurerFilter },
            ] as const).map(({ label, options, value, set }) => (
              <div key={label}>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: '#94a3b8', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}
                >
                  {label}
                </p>
                <div className="flex flex-wrap gap-1.5">
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
            <button
              onClick={clearFilters}
              className="mt-4 text-xs font-semibold"
              style={{ color: 'var(--asa)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* ── Results bar ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      )}
    </div>
  );
}
