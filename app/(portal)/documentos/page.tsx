'use client';

import { useState, useMemo } from 'react';
import {
  FileText, Download, Eye, Search, SlidersHorizontal,
  X, FolderOpen, ArrowUpDown, ChevronDown,
} from 'lucide-react';
import { mockDocuments } from '@/mock/documents';
import { mockPolicies } from '@/mock/policies';
import { formatDate, documentCategoryLabel } from '@/lib/utils';
import type { DocumentCategory } from '@/types';

// ── Category config ───────────────────────────────────────────────
const categoryConfig: Record<DocumentCategory, { color: string; bg: string; border: string }> = {
  apolice:     { color: '#2563EB', bg: 'rgba(37,99,235,0.08)',  border: 'rgba(37,99,235,0.18)' },
  proposta:    { color: '#7C3AED', bg: 'rgba(109,40,217,0.08)', border: 'rgba(109,40,217,0.18)' },
  certificado: { color: '#0D9488', bg: 'rgba(13,148,136,0.08)', border: 'rgba(13,148,136,0.18)' },
  comprovante: { color: '#059669', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.18)' },
  sinistro:    { color: '#EA580C', bg: 'rgba(234,88,12,0.08)',  border: 'rgba(234,88,12,0.18)' },
  renovacao:   { color: '#D97706', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)' },
  outro:       { color: '#64748B', bg: 'rgba(100,116,139,0.08)',border: 'rgba(100,116,139,0.18)' },
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

// ── Document row ──────────────────────────────────────────────────
function DocumentRow({ doc }: { doc: typeof mockDocuments[0] }) {
  const cfg = categoryConfig[doc.category];
  const sizeLabel = doc.sizeKb < 1024
    ? `${doc.sizeKb} KB`
    : `${(doc.sizeKb / 1024).toFixed(1)} MB`;

  return (
    <div
      className="group flex items-center gap-4 bg-white transition-all duration-150"
      style={{
        borderRadius: 14,
        padding: '14px 20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(37,99,235,0.20)';
        el.style.boxShadow = '0 4px 16px rgba(37,99,235,0.07), 0 1px 3px rgba(0,0,0,0.04)';
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
      <div style={{
        flexShrink: 0,
        width: 40, height: 40,
        borderRadius: 10,
        background: cfg.bg,
        border: `1.5px solid ${cfg.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <FileText style={{ width: 17, height: 17, color: cfg.color }} />
      </div>

      {/* Name + meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#0f172a',
          fontFamily: 'var(--font-sora, Sora, sans-serif)',
          letterSpacing: '-0.01em',
          marginBottom: 4,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {doc.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Category badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '2px 8px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.03em',
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
            background: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.border}`,
          }}>
            {documentCategoryLabel[doc.category]}
          </span>
          {doc.policyNumber && (
            <>
              <span style={{ color: '#e2e8f0', fontSize: 12 }}>·</span>
              <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                {doc.policyNumber}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Date */}
      <div style={{ flexShrink: 0, textAlign: 'right', minWidth: 90 }}>
        <p style={{ fontSize: 13, color: '#64748b', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          {formatDate(doc.date)}
        </p>
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{sizeLabel}</p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <button
          title="Visualizar"
          style={{
            width: 34, height: 34,
            borderRadius: 9,
            border: '1px solid #e2e8f0',
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer',
            transition: 'all 0.12s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = '#f8fafc';
            el.style.borderColor = '#cbd5e1';
            el.style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = '#fff';
            el.style.borderColor = '#e2e8f0';
            el.style.color = '#64748b';
          }}
        >
          <Eye style={{ width: 15, height: 15 }} />
        </button>
        <button
          title="Baixar"
          style={{
            width: 34, height: 34,
            borderRadius: 9,
            border: '1px solid rgba(37,99,235,0.20)',
            background: 'rgba(37,99,235,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#2563EB',
            cursor: 'pointer',
            transition: 'all 0.12s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'rgba(37,99,235,0.12)';
            el.style.borderColor = 'rgba(37,99,235,0.35)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'rgba(37,99,235,0.05)';
            el.style.borderColor = 'rgba(37,99,235,0.20)';
          }}
        >
          <Download style={{ width: 15, height: 15 }} />
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
type SortOrder = 'newest' | 'oldest' | 'name';

export default function DocumentosPage() {
  const [search, setSearch]               = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | 'todos'>('todos');
  const [policyFilter, setPolicyFilter]   = useState<string>('todos');
  const [sortOrder, setSortOrder]         = useState<SortOrder>('newest');
  const [showFilters, setShowFilters]     = useState(false);
  const [showSort, setShowSort]           = useState(false);

  const policyOptions = useMemo(() => {
    const numbers = Array.from(new Set(
      mockDocuments.filter(d => d.policyNumber).map(d => d.policyNumber!)
    )).sort();
    return [{ value: 'todos', label: 'Todas as apólices' }, ...numbers.map(n => ({ value: n, label: n }))];
  }, []);

  const categoryOptions: { value: DocumentCategory | 'todos'; label: string }[] = [
    { value: 'todos',       label: 'Todos' },
    { value: 'apolice',     label: 'Apólice' },
    { value: 'proposta',    label: 'Proposta' },
    { value: 'certificado', label: 'Certificado' },
    { value: 'comprovante', label: 'Comprovante' },
    { value: 'sinistro',    label: 'Sinistro' },
    { value: 'renovacao',   label: 'Renovação' },
    { value: 'outro',       label: 'Outro' },
  ];

  const sortOptions: { value: SortOrder; label: string }[] = [
    { value: 'newest', label: 'Mais recentes' },
    { value: 'oldest', label: 'Mais antigos' },
    { value: 'name',   label: 'Nome A–Z' },
  ];

  const filtered = useMemo(() => {
    let docs = [...mockDocuments];

    if (categoryFilter !== 'todos') docs = docs.filter(d => d.category === categoryFilter);
    if (policyFilter !== 'todos')   docs = docs.filter(d => d.policyNumber === policyFilter);
    if (search) {
      const q = search.toLowerCase();
      docs = docs.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.policyNumber?.toLowerCase().includes(q) ||
        documentCategoryLabel[d.category].toLowerCase().includes(q)
      );
    }

    docs.sort((a, b) => {
      if (sortOrder === 'newest') return b.date.localeCompare(a.date);
      if (sortOrder === 'oldest') return a.date.localeCompare(b.date);
      return a.name.localeCompare(b.name);
    });

    return docs;
  }, [search, categoryFilter, policyFilter, sortOrder]);

  const stats = useMemo(() => {
    const all = mockDocuments;
    return {
      total:       all.length,
      apolices:    all.filter(d => d.category === 'apolice').length,
      comprovantes: all.filter(d => d.category === 'comprovante').length,
      outros:      all.filter(d => !['apolice', 'comprovante'].includes(d.category)).length,
    };
  }, []);

  const activeFilterCount = [categoryFilter !== 'todos', policyFilter !== 'todos'].filter(Boolean).length;
  const hasActiveFilters  = activeFilterCount > 0 || search !== '';

  function clearFilters() {
    setCategoryFilter('todos');
    setPolicyFilter('todos');
    setSearch('');
  }

  const currentSortLabel = sortOptions.find(s => s.value === sortOrder)?.label ?? 'Mais recentes';

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
            <FolderOpen style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.7)' }} />
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
            }}>
              Central de Documentos
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
                Meus Documentos
              </h1>
              <p style={{
                marginTop: 10, fontSize: 14,
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                lineHeight: 1.6,
              }}>
                {stats.total} arquivo{stats.total !== 1 ? 's' : ''} disponíveis — apólices, comprovantes, certificados e mais.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total de arquivos', value: stats.total,        color: '#0f172a',  bg: '#ffffff',                    border: '#e2e8f0' },
          { label: 'Apólices',          value: stats.apolices,     color: '#2563EB',  bg: 'rgba(37,99,235,0.06)',       border: 'rgba(37,99,235,0.18)' },
          { label: 'Comprovantes',      value: stats.comprovantes, color: '#059669',  bg: 'rgba(16,185,129,0.06)',      border: 'rgba(16,185,129,0.18)' },
          { label: 'Outros',            value: stats.outros,       color: '#64748b',  bg: '#ffffff',                   border: '#e2e8f0' },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} style={{
            flex: 1,
            background: bg,
            border: `1px solid ${border}`,
            borderRadius: 14,
            padding: '14px 18px',
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
              color: '#64748b',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Search + sort + filter bar ────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>

        {/* Unified search + filter */}
        <div
          className="flex items-center bg-white"
          style={{
            flex: 1,
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 10, padding: '13px 18px' }}>
            <Search style={{ width: 16, height: 16, color: '#94a3b8', flexShrink: 0 }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome, apólice ou categoria..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: 14, color: '#0f172a',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: '#f1f5f9', color: '#94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', border: 'none', flexShrink: 0,
                }}
              >
                <X style={{ width: 11, height: 11 }} />
              </button>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 24, background: '#e2e8f0', flexShrink: 0 }} />

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '13px 20px',
              background: showFilters ? 'rgba(37,99,235,0.06)' : 'transparent',
              color: showFilters ? '#2563EB' : '#475569',
              border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s, color 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (!showFilters) {
                (e.currentTarget as HTMLElement).style.background = '#f8fafc';
                (e.currentTarget as HTMLElement).style.color = '#2563EB';
              }
            }}
            onMouseLeave={(e) => {
              if (!showFilters) {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#475569';
              }
            }}
          >
            <SlidersHorizontal style={{ width: 15, height: 15 }} />
            Filtros
            {activeFilterCount > 0 && (
              <span style={{
                width: 16, height: 16, borderRadius: '50%',
                background: '#2563EB', color: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700,
              }}>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Sort dropdown */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setShowSort(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '13px 18px',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              color: '#475569',
              fontSize: 13, fontWeight: 600,
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              whiteSpace: 'nowrap',
              transition: 'border-color 0.12s',
            }}
          >
            <ArrowUpDown style={{ width: 14, height: 14, color: '#94a3b8' }} />
            {currentSortLabel}
            <ChevronDown style={{ width: 13, height: 13, color: '#94a3b8' }} />
          </button>

          {showSort && (
            <>
              {/* backdrop */}
              <div style={{ position: 'fixed', inset: 0, zIndex: 9 }} onClick={() => setShowSort(false)} />
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                boxShadow: '0 8px 24px rgba(15,31,69,0.10)',
                zIndex: 10,
                minWidth: 180,
                padding: 6,
              }}>
                {sortOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => { setSortOrder(value); setShowSort(false); }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '9px 14px',
                      borderRadius: 8,
                      border: 'none',
                      background: sortOrder === value ? 'rgba(37,99,235,0.07)' : 'transparent',
                      color: sortOrder === value ? '#2563EB' : '#334155',
                      fontSize: 13, fontWeight: sortOrder === value ? 600 : 400,
                      fontFamily: 'var(--font-inter, Inter, sans-serif)',
                      cursor: 'pointer',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Filter panel ──────────────────────────────────────────── */}
      {showFilters && (
        <div style={{
          borderRadius: 16,
          padding: '20px 24px 24px',
          marginBottom: 16,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(15,31,69,0.06)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 32px' }}>
            {/* Category */}
            <div>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: '#94a3b8',
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                marginBottom: 10,
              }}>
                Categoria
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {categoryOptions.map(({ value, label }) => (
                  <FilterPill
                    key={value}
                    label={label}
                    active={categoryFilter === value}
                    onClick={() => setCategoryFilter(value as DocumentCategory | 'todos')}
                  />
                ))}
              </div>
            </div>

            {/* Policy */}
            <div>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: '#94a3b8',
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                marginBottom: 10,
              }}>
                Apólice
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {policyOptions.map(({ value, label }) => (
                  <FilterPill
                    key={value}
                    label={label}
                    active={policyFilter === value}
                    onClick={() => setPolicyFilter(value)}
                  />
                ))}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
              <button
                onClick={clearFilters}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 13, fontWeight: 500, color: '#DC2626',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                <X style={{ width: 14, height: 14 }} />
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Results bar ───────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <p style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
          {filtered.length === mockDocuments.length
            ? `${filtered.length} documentos`
            : `${filtered.length} de ${mockDocuments.length} documentos`}
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 12, fontWeight: 500, color: '#94a3b8',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            <X style={{ width: 12, height: 12 }} />
            Limpar
          </button>
        )}
      </div>

      {/* ── Document list ─────────────────────────────────────────── */}
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
            <FolderOpen style={{ width: 24, height: 24, color: '#2563EB' }} />
          </div>
          <p style={{
            fontSize: 15, fontWeight: 700, color: '#0f172a',
            fontFamily: 'var(--font-sora, Sora, sans-serif)', marginBottom: 6,
          }}>
            Nenhum documento encontrado
          </p>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>
            {search ? `Sem resultados para "${search}"` : 'Tente remover os filtros.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(doc => (
            <DocumentRow key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
