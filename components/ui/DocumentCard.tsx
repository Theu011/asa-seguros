import { FileText, Download, Eye } from 'lucide-react';
import { formatDate, documentCategoryLabel } from '@/lib/utils';
import type { Document } from '@/types';

interface DocumentCardProps {
  doc: Document;
  compact?: boolean;
}

const categoryStyle: Record<string, { bg: string; color: string }> = {
  apolice:     { bg: 'rgba(37,99,235,0.08)',   color: '#2563EB' },
  proposta:    { bg: 'rgba(109,40,217,0.08)',   color: '#7C3AED' },
  certificado: { bg: 'rgba(13,148,136,0.08)',   color: '#0D9488' },
  comprovante: { bg: 'rgba(16,185,129,0.08)',   color: '#059669' },
  sinistro:    { bg: 'rgba(234,88,12,0.08)',    color: '#EA580C' },
  renovacao:   { bg: 'rgba(245,158,11,0.08)',   color: '#D97706' },
  outro:       { bg: 'rgba(100,116,139,0.08)',  color: '#64748B' },
};

export function DocumentCard({ doc, compact = false }: DocumentCardProps) {
  const cat = categoryStyle[doc.category] ?? categoryStyle.outro;

  return (
    <div
      className="flex items-center gap-3 rounded-2xl bg-white transition-all duration-150"
      style={{
        border: '1px solid var(--c200)',
        padding: '12px 14px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--c200)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 2px 8px rgba(37,99,235,0.06), 0 1px 2px rgba(0,0,0,0.04)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
      }}
    >
      {/* File icon */}
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: cat.bg }}
      >
        <FileText className="h-4 w-4" style={{ color: cat.color }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate"
          style={{ color: 'var(--c900)', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}
        >
          {doc.name}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{
              background: cat.bg,
              color: cat.color,
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              letterSpacing: '0.04em',
            }}
          >
            {documentCategoryLabel[doc.category]}
          </span>
          {!compact && (
            <span className="text-xs" style={{ color: 'var(--c500)' }}>
              {formatDate(doc.date)}
            </span>
          )}
          <span className="text-xs" style={{ color: 'var(--c500)' }}>
            {doc.sizeKb < 1024
              ? `${doc.sizeKb} KB`
              : `${(doc.sizeKb / 1024).toFixed(1)} MB`}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
          style={{ color: 'var(--c500)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--c100)';
            (e.currentTarget as HTMLElement).style.color = 'var(--c900)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--c500)';
          }}
          title="Visualizar"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
          style={{ color: 'var(--c500)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--asa-ice)';
            (e.currentTarget as HTMLElement).style.color = 'var(--asa)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--c500)';
          }}
          title="Baixar"
        >
          <Download className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
