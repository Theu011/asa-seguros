'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Car, Home, Heart, Building2, Plane,
  Shield, ChevronRight, Calendar, Search,
  SlidersHorizontal, CheckCircle2, AlertTriangle, Clock, XCircle,
  Plus,
} from 'lucide-react';
import {
  formatDate, formatCurrency,
  policyTypeLabel, policyStatusLabel,
  daysUntil, isExpired,
} from '@/lib/utils';
import { mockPolicies } from '@/mock/policies';
import type { Policy, PolicyType, PolicyStatus } from '@/types';

// ── Per-type accent system ────────────────────────────────────────
const typeAccent: Record<PolicyType, { bg: string; color: string; border: string; lightBg: string }> = {
  auto:        { bg: 'rgba(37,99,235,0.10)',  color: '#2563EB', border: 'rgba(37,99,235,0.22)', lightBg: 'rgba(37,99,235,0.04)' },
  residencial: { bg: 'rgba(245,158,11,0.10)', color: '#D97706', border: 'rgba(245,158,11,0.22)', lightBg: 'rgba(245,158,11,0.04)' },
  vida:        { bg: 'rgba(239,68,68,0.08)',  color: '#DC2626', border: 'rgba(239,68,68,0.20)', lightBg: 'rgba(239,68,68,0.03)' },
  empresarial: { bg: 'rgba(109,40,217,0.08)', color: '#7C3AED', border: 'rgba(109,40,217,0.20)', lightBg: 'rgba(109,40,217,0.03)' },
  viagem:      { bg: 'rgba(13,148,136,0.10)', color: '#0D9488', border: 'rgba(13,148,136,0.22)', lightBg: 'rgba(13,148,136,0.04)' },
};

// ── Per-status style ──────────────────────────────────────────────
const statusStyle: Record<PolicyStatus, { bg: string; color: string; icon: React.ReactNode }> = {
  ativo:        { bg: 'rgba(16,185,129,0.10)', color: '#059669', icon: <CheckCircle2 className="h-3 w-3" /> },
  vencido:      { bg: 'rgba(239,68,68,0.10)',  color: '#DC2626', icon: <XCircle className="h-3 w-3" /> },
  cancelado:    { bg: 'rgba(100,116,139,0.10)',color: '#64748B', icon: <XCircle className="h-3 w-3" /> },
  em_renovacao: { bg: 'rgba(37,99,235,0.10)',  color: '#2563EB', icon: <Clock className="h-3 w-3" /> },
  aguardando:   { bg: 'rgba(245,158,11,0.10)', color: '#D97706', icon: <AlertTriangle className="h-3 w-3" /> },
};

const typeIcon: Record<PolicyType, React.ElementType> = {
  auto: Car,
  residencial: Home,
  vida: Heart,
  empresarial: Building2,
  viagem: Plane,
};

// ── Filter pill ───────────────────────────────────────────────────
function FilterPill({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 whitespace-nowrap"
      style={{
        background: active ? 'var(--asa)' : 'white',
        color: active ? '#ffffff' : 'var(--c600)',
        border: active ? '1px solid var(--asa)' : '1px solid var(--c200)',
        boxShadow: active ? '0 2px 6px rgba(37,99,235,0.25)' : '0 1px 2px rgba(0,0,0,0.03)',
        fontFamily: 'var(--font-sora, Sora, sans-serif)',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--asa-mist)';
          (e.currentTarget as HTMLElement).style.color = 'var(--asa)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--c200)';
          (e.currentTarget as HTMLElement).style.color = 'var(--c600)';
        }
      }}
    >
      {label}
    </button>
  );
}

// ── Rich Policy Row ───────────────────────────────────────────────
function PolicyRow({ policy }: { policy: Policy }) {
  const Icon = typeIcon[policy.type];
  const accent = typeAccent[policy.type];
  const st = statusStyle[policy.status];
  const days = daysUntil(policy.endDate);
  const expired = isExpired(policy.endDate);
  const expiringSoon = !expired && days <= 45;

  let expiryColor = 'var(--c500)';
  let expiryLabel = `Vence ${formatDate(policy.endDate)}`;
  if (expired) {
    expiryColor = '#DC2626';
    expiryLabel = `Venceu ${formatDate(policy.endDate)}`;
  } else if (expiringSoon) {
    expiryColor = days <= 15 ? '#DC2626' : '#D97706';
    expiryLabel = `Vence em ${days} dias`;
  }

  return (
    <Link
      href={`/seguros/${policy.id}`}
      className="group block rounded-2xl bg-white transition-all duration-200"
      style={{
        border: '1px solid var(--c200)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--asa-mist)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(37,99,235,0.08), 0 1px 3px rgba(0,0,0,0.04)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--c200)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Top accent strip */}
      <div
        className="h-1 rounded-t-2xl"
        style={{ background: accent.color, opacity: 0.6 }}
      />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: accent.bg, border: `1.5px solid ${accent.border}` }}
          >
            <Icon className="h-6 w-6" style={{ color: accent.color }} />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className="text-base font-bold"
                style={{
                  color: 'var(--c900)',
                  fontFamily: 'var(--font-sora, Sora, sans-serif)',
                }}
              >
                {policyTypeLabel[policy.type]}
              </span>
              {/* Status badge */}
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                style={{
                  background: st.bg,
                  color: st.color,
                  fontFamily: 'var(--font-sora, Sora, sans-serif)',
                }}
              >
                {st.icon}
                {policyStatusLabel[policy.status]}
              </span>
            </div>

            {/* Meta */}
            <p className="mt-0.5 text-sm" style={{ color: 'var(--c600)' }}>
              {policy.insurer}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--c400, var(--c500))' }}>
              #{policy.number}
            </p>

            {/* Stats row */}
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--c500)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                  Prêmio anual
                </p>
                <p className="text-sm font-bold" style={{ color: 'var(--c900)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                  {formatCurrency(policy.premium)}
                </p>
              </div>

              <div
                className="w-px h-7 self-center"
                style={{ background: 'var(--c200)' }}
              />

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--c500)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                  Vigência
                </p>
                <p className="text-sm font-medium flex items-center gap-1.5" style={{ color: expiryColor }}>
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  {expiryLabel}
                </p>
              </div>

              {policy.deductible && (
                <>
                  <div
                    className="w-px h-7 self-center"
                    style={{ background: 'var(--c200)' }}
                  />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--c500)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                      Franquia
                    </p>
                    <p className="text-sm font-medium" style={{ color: 'var(--c700, var(--c600))' }}>
                      {formatCurrency(policy.deductible)}
                    </p>
                  </div>
                </>
              )}

              <div
                className="w-px h-7 self-center"
                style={{ background: 'var(--c200)' }}
              />

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--c500)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                  Coberturas
                </p>
                <p className="text-sm font-medium" style={{ color: 'var(--c600)' }}>
                  {policy.coverages.length} itens
                </p>
              </div>
            </div>

            {/* Insured item preview */}
            {policy.insuredItems.length > 0 && (
              <div
                className="mt-3 rounded-xl px-3 py-2 flex items-center gap-2"
                style={{ background: accent.lightBg }}
              >
                <Shield className="h-3.5 w-3.5 shrink-0" style={{ color: accent.color }} />
                <span className="text-xs" style={{ color: 'var(--c600)' }}>
                  <span className="font-medium" style={{ color: 'var(--c700, var(--c600))' }}>
                    {policy.insuredItems[0].label}:
                  </span>{' '}
                  {policy.insuredItems[0].value}
                </span>
              </div>
            )}
          </div>

          {/* Arrow */}
          <ChevronRight
            className="h-5 w-5 shrink-0 mt-1 transition-transform duration-150 group-hover:translate-x-0.5"
            style={{ color: 'var(--c300, var(--c200))' }}
          />
        </div>
      </div>
    </Link>
  );
}

// ── Empty state ───────────────────────────────────────────────────
function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-3xl mb-4"
        style={{ background: 'rgba(37,99,235,0.07)' }}
      >
        <Shield className="h-8 w-8" style={{ color: 'var(--asa)' }} />
      </div>
      <p className="text-sm font-semibold" style={{ color: 'var(--c700, var(--c600))', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
        {query ? 'Nenhum seguro encontrado' : 'Sem seguros nesta categoria'}
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--c500)' }}>
        {query ? `Nenhum resultado para "${query}"` : 'Tente outro filtro ou entre em contato.'}
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function SegurosPage() {
  const [typeFilter, setTypeFilter] = useState<PolicyType | 'todos'>('todos');
  const [statusFilter, setStatusFilter] = useState<PolicyStatus | 'todos'>('todos');
  const [insurerFilter, setInsurerFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const insurerOptions = useMemo(() => {
    const unique = Array.from(new Set(mockPolicies.map((p) => p.insurer))).sort();
    return [{ value: 'todos', label: 'Todas' }, ...unique.map((v) => ({ value: v, label: v }))];
  }, []);

  const typeOptions: { value: PolicyType | 'todos'; label: string }[] = [
    { value: 'todos', label: 'Todos os tipos' },
    { value: 'auto', label: 'Auto' },
    { value: 'residencial', label: 'Residencial' },
    { value: 'vida', label: 'Vida' },
    { value: 'empresarial', label: 'Empresarial' },
    { value: 'viagem', label: 'Viagem' },
  ];

  const statusOptions: { value: PolicyStatus | 'todos'; label: string }[] = [
    { value: 'todos', label: 'Todos os status' },
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
        )
          return false;
      }
      return true;
    });
  }, [typeFilter, statusFilter, searchQuery]);

  // Summary stats
  const stats = useMemo(() => {
    const all = mockPolicies;
    return {
      total: all.length,
      ativos: all.filter((p) => p.status === 'ativo').length,
      emRenovacao: all.filter((p) => p.status === 'em_renovacao').length,
      vencidos: all.filter((p) => isExpired(p.endDate)).length,
    };
  }, []);

  const hasActiveFilters =
    typeFilter !== 'todos' || statusFilter !== 'todos' || insurerFilter !== 'todos' || searchQuery !== '';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{
              color: 'var(--c900)',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
            }}
          >
            Meus Seguros
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--c500)' }}>
            Gerencie todas as suas apólices em um só lugar.
          </p>
        </div>
        <a
          href="/atendimento"
          className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150 shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--asa) 0%, var(--asa-deep) 100%)',
            boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(37,99,235,0.38)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(37,99,235,0.3)';
          }}
        >
          <Plus className="h-4 w-4" />
          Solicitar seguro
        </a>
      </div>

      {/* Summary cards */}
      <div
        className="grid gap-3 mb-6"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}
      >
        {[
          { label: 'Total', value: stats.total, color: '#2563EB', bg: 'rgba(37,99,235,0.08)' },
          { label: 'Ativos', value: stats.ativos, color: '#059669', bg: 'rgba(16,185,129,0.08)' },
          { label: 'Em Renovação', value: stats.emRenovacao, color: '#2563EB', bg: 'rgba(37,99,235,0.08)' },
          { label: 'Vencidos', value: stats.vencidos, color: '#DC2626', bg: 'rgba(239,68,68,0.08)' },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl bg-white px-4 py-3"
            style={{
              border: '1px solid var(--c200)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-1"
              style={{ color: 'var(--c500)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}
            >
              {label}
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color, fontFamily: 'var(--font-sora, Sora, sans-serif)' }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="rounded-2xl bg-white p-4 mb-4"
        style={{
          border: '1px solid var(--c200)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        {/* Search */}
        <div
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 mb-3"
          style={{ background: 'var(--c50)', border: '1px solid var(--c200)' }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--c400, var(--c500))' }} />
          <input
            type="text"
            placeholder="Buscar por seguradora, número ou tipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            style={{ color: 'var(--c900)', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs"
              style={{ color: 'var(--c500)' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Type filters */}
        <div className="mb-2.5">
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: 'var(--c500)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}
          >
            Tipo
          </p>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map(({ value, label }) => (
              <FilterPill
                key={value}
                label={label}
                active={typeFilter === value}
                onClick={() => setTypeFilter(value)}
              />
            ))}
          </div>
        </div>

        {/* Status filters */}
        <div className="mb-2.5">
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: 'var(--c500)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}
          >
            Status
          </p>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(({ value, label }) => (
              <FilterPill
                key={value}
                label={label}
                active={statusFilter === value}
                onClick={() => setStatusFilter(value as PolicyStatus | 'todos')}
              />
            ))}
          </div>
        </div>

        {/* Insurer filters */}
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: 'var(--c500)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}
          >
            Seguradora
          </p>
          <div className="flex flex-wrap gap-2">
            {insurerOptions.map(({ value, label }) => (
              <FilterPill
                key={value}
                label={label}
                active={insurerFilter === value}
                onClick={() => setInsurerFilter(value)}
              />
            ))}
          </div>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              setTypeFilter('todos');
              setStatusFilter('todos');
              setInsurerFilter('todos');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-semibold transition-colors"
            style={{ color: 'var(--asa)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--asa-deep)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--asa)')}
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs" style={{ color: 'var(--c500)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
          {filtered.length === mockPolicies.length
            ? `${filtered.length} apólices`
            : `${filtered.length} de ${mockPolicies.length} apólices`}
        </p>
        {filtered.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--c500)' }}>
            <SlidersHorizontal className="h-3 w-3" />
            Ordenado por vencimento
          </div>
        )}
      </div>

      {/* Policy list */}
      {filtered.length === 0 ? (
        <EmptyState query={searchQuery} />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((policy) => (
            <PolicyRow key={policy.id} policy={policy} />
          ))}
        </div>
      )}
    </div>
  );
}
