'use client';

import { useState, useMemo } from 'react';
import {
  Car, Home, Heart, Building2, Plane,
  ShieldAlert, FileText, Clock, CheckCircle2,
  AlertTriangle, ChevronDown, ChevronUp,
  CalendarDays, X, Upload, Send,
  AlertCircle, Info,
} from 'lucide-react';
import { mockClaims } from '@/mock/claims';
import { mockBroker } from '@/mock/broker';
import { mockPolicies } from '@/mock/policies';
import { formatDate, policyTypeLabel } from '@/lib/utils';
import type { ClaimStatus, PolicyType } from '@/types';

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

const statusConfig: Record<ClaimStatus, {
  label: string; color: string; bg: string; border: string; dot: string;
  icon: React.ElementType; cardBorder: string; urgency: number;
}> = {
  aberto: {
    label: 'Aberto', color: '#D97706', bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.20)', dot: '#F59E0B', icon: AlertTriangle,
    cardBorder: 'rgba(245,158,11,0.25)', urgency: 1,
  },
  aguardando_documentos: {
    label: 'Aguardando Docs', color: '#EA580C', bg: 'rgba(234,88,12,0.08)',
    border: 'rgba(234,88,12,0.20)', dot: '#F97316', icon: FileText,
    cardBorder: 'rgba(234,88,12,0.25)', urgency: 2,
  },
  em_analise: {
    label: 'Em Análise', color: '#2563EB', bg: 'rgba(37,99,235,0.08)',
    border: 'rgba(37,99,235,0.18)', dot: '#3B82F6', icon: Clock,
    cardBorder: '#e2e8f0', urgency: 3,
  },
  indenizado: {
    label: 'Indenizado', color: '#059669', bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.20)', dot: '#10B981', icon: CheckCircle2,
    cardBorder: '#e2e8f0', urgency: 4,
  },
  encerrado: {
    label: 'Encerrado', color: '#64748B', bg: 'rgba(100,116,139,0.08)',
    border: 'rgba(100,116,139,0.18)', dot: '#94A3B8', icon: CheckCircle2,
    cardBorder: '#e2e8f0', urgency: 5,
  },
};

const timelineTypeStyle: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  info:    { color: '#2563EB', bg: 'rgba(37,99,235,0.10)',   icon: Info },
  success: { color: '#059669', bg: 'rgba(16,185,129,0.10)',  icon: CheckCircle2 },
  warning: { color: '#D97706', bg: 'rgba(245,158,11,0.10)',  icon: AlertTriangle },
  pending: { color: '#64748B', bg: 'rgba(100,116,139,0.10)', icon: Clock },
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

// ── Timeline ──────────────────────────────────────────────────────
function Timeline({ events }: { events: { date: string; title: string; description: string; type: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, paddingLeft: 4 }}>
      {events.map((ev, i) => {
        const s = timelineTypeStyle[ev.type] || timelineTypeStyle.info;
        const Icon = s.icon;
        const isLast = i === events.length - 1;
        return (
          <div key={i} style={{ display: 'flex', gap: 14, position: 'relative' }}>
            {/* Vertical line */}
            {!isLast && (
              <div style={{
                position: 'absolute', left: 15, top: 32, bottom: 0,
                width: 1, background: '#e2e8f0',
              }} />
            )}
            {/* Icon bubble */}
            <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
              <Icon style={{ width: 14, height: 14, color: s.color }} />
            </div>
            {/* Content */}
            <div style={{ flex: 1, paddingBottom: isLast ? 0 : 20, paddingTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                  {ev.title}
                </p>
                <p style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  {formatDate(ev.date.split('T')[0])}
                </p>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.55, fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                {ev.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Claim card ────────────────────────────────────────────────────
function ClaimCard({ claim }: { claim: typeof mockClaims[0] }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[claim.status];
  const StatusIcon = status.icon;
  const waLink = `https://wa.me/55${mockBroker.whatsapp.replace(/\D/g, '')}`;

  // Determine policy type icon from policyNumber prefix
  const policyPrefix = claim.policyNumber.split('-')[0];
  const policyTypeMap: Record<string, PolicyType> = {
    AUTO: 'auto', RES: 'residencial', VID: 'vida', EMP: 'empresarial', VIA: 'viagem',
  };
  const pType = policyTypeMap[policyPrefix] || 'auto';
  const TypeIcon = typeIcon[pType];

  const typeAccentColor: Record<string, string> = {
    auto: '#2563EB', residencial: '#D97706', vida: '#DC2626', empresarial: '#7C3AED', viagem: '#0D9488',
  };
  const typeAccentBg: Record<string, string> = {
    auto: 'rgba(37,99,235,0.08)', residencial: 'rgba(245,158,11,0.08)',
    vida: 'rgba(239,68,68,0.07)', empresarial: 'rgba(109,40,217,0.07)', viagem: 'rgba(13,148,136,0.08)',
  };
  const accent = { color: typeAccentColor[pType], bg: typeAccentBg[pType] };

  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      border: `1px solid ${status.cardBorder}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>
      {/* ── Header ── */}
      <div style={{ padding: '18px 22px 16px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* Type icon */}
        <div style={{
          flexShrink: 0, width: 44, height: 44, borderRadius: 12,
          background: accent.bg, border: `1.5px solid ${accent.color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <TypeIcon style={{ width: 20, height: 20, color: accent.color }} />
        </div>

        {/* Title + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
            <p style={{
              fontSize: 15, fontWeight: 700, color: '#0f172a',
              fontFamily: 'var(--font-sora, Sora, sans-serif)', letterSpacing: '-0.015em',
            }}>
              {claim.type}
            </p>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 20,
              fontSize: 11, fontWeight: 600,
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              background: status.bg, color: status.color, border: `1px solid ${status.border}`,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.dot, flexShrink: 0 }} />
              {status.label}
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            {policyTypeLabel[pType]}
            <span style={{ color: '#cbd5e1', margin: '0 6px' }}>·</span>
            <span style={{ color: '#94a3b8' }}>{claim.policyNumber}</span>
          </p>
        </div>

        {/* Date */}
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end', marginBottom: 2 }}>
            <CalendarDays style={{ width: 13, height: 13, color: '#94a3b8' }} />
            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-sora)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Abertura
            </span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
            {formatDate(claim.openDate)}
          </p>
        </div>
      </div>

      {/* ── Description ── */}
      <div style={{ margin: '0 22px 14px' }}>
        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          {claim.description}
        </p>
      </div>

      {/* ── Pending docs ── */}
      {claim.pendingDocuments.length > 0 && (
        <div style={{ margin: '0 22px 14px', padding: '12px 14px', borderRadius: 10, background: 'rgba(234,88,12,0.05)', border: '1px solid rgba(234,88,12,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <AlertCircle style={{ width: 13, height: 13, color: '#EA580C', flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#EA580C', fontFamily: 'var(--font-sora)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Documentos pendentes
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {claim.pendingDocuments.map((doc, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#EA580C', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Next action ── */}
      {claim.nextAction && (
        <div style={{ margin: '0 22px 14px', padding: '10px 14px', borderRadius: 10, background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <StatusIcon style={{ width: 14, height: 14, color: status.color, flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.55, fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>Próxima ação: </span>
            {claim.nextAction}
          </p>
        </div>
      )}

      {/* ── Timeline toggle ── */}
      {claim.timeline.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '11px 22px', background: 'transparent',
              borderTop: '1px solid #f1f5f9', borderBottom: expanded ? '1px solid #f1f5f9' : 'none',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: '#475569', fontFamily: 'var(--font-sora, Sora, sans-serif)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock style={{ width: 13, height: 13, color: '#94a3b8' }} />
              Histórico do processo
              <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>
                {claim.timeline.length}
              </span>
            </span>
            {expanded
              ? <ChevronUp style={{ width: 16, height: 16, color: '#94a3b8' }} />
              : <ChevronDown style={{ width: 16, height: 16, color: '#94a3b8' }} />
            }
          </button>

          {expanded && (
            <div style={{ padding: '18px 22px 20px' }}>
              <Timeline events={claim.timeline} />
            </div>
          )}
        </>
      )}

      {/* ── Footer actions ── */}
      <div style={{
        padding: '13px 22px', display: 'flex', alignItems: 'center', gap: 10,
        borderTop: expanded ? 'none' : '1px solid #f1f5f9', flexWrap: 'wrap',
      }}>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
            background: 'rgba(34,197,94,0.10)', color: '#16a34a',
            border: '1px solid rgba(34,197,94,0.20)', textDecoration: 'none',
            transition: 'background 0.15s', flexShrink: 0,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.18)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.10)'; }}
        >
          <WhatsAppSvg style={{ width: 13, height: 13 }} />
          Falar com corretor
        </a>

        {claim.pendingDocuments.length > 0 && (
          <button
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              background: 'rgba(234,88,12,0.08)', color: '#EA580C',
              border: '1px solid rgba(234,88,12,0.20)', cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(234,88,12,0.15)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(234,88,12,0.08)'; }}
          >
            <Upload style={{ width: 12, height: 12 }} />
            Enviar documentos
          </button>
        )}
      </div>
    </div>
  );
}

// ── New claim modal ───────────────────────────────────────────────
function NovoSinistroModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [form, setForm] = useState({ apoliceSel: '', tipo: '', descricao: '', arquivo: '' });

  const claimTypes = ['Colisão', 'Roubo/Furto', 'Danos por Água', 'Incêndio', 'Quebra de Vidros', 'Danos Elétricos', 'Danos a Terceiros', 'Outro'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: 20, width: '100%', maxWidth: 520,
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        overflow: 'hidden',
      }}>
        {/* Modal header */}
        <div style={{
          padding: '20px 24px 18px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert style={{ width: 18, height: 18, color: '#DC2626' }} />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-sora, Sora, sans-serif)', letterSpacing: '-0.01em' }}>
                Abrir Sinistro
              </p>
              <p style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                Preencha os dados do ocorrido
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X style={{ width: 16, height: 16, color: '#64748b' }} />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} style={{ padding: '22px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Apólice */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'var(--font-sora, Sora, sans-serif)', display: 'block', marginBottom: 6 }}>
                Apólice vinculada
              </label>
              <select
                required
                value={form.apoliceSel}
                onChange={e => setForm({ ...form, apoliceSel: e.target.value })}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 13,
                  border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)', outline: 'none',
                }}
              >
                <option value="">Selecione a apólice</option>
                {mockPolicies.map(p => (
                  <option key={p.id} value={p.id}>{p.number} — {policyTypeLabel[p.type]}</option>
                ))}
              </select>
            </div>

            {/* Tipo */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'var(--font-sora, Sora, sans-serif)', display: 'block', marginBottom: 6 }}>
                Tipo de sinistro
              </label>
              <select
                required
                value={form.tipo}
                onChange={e => setForm({ ...form, tipo: e.target.value })}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 13,
                  border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)', outline: 'none',
                }}
              >
                <option value="">Selecione o tipo</option>
                {claimTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Descrição */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'var(--font-sora, Sora, sans-serif)', display: 'block', marginBottom: 6 }}>
                Descrição do ocorrido
              </label>
              <textarea
                required
                rows={4}
                placeholder="Descreva o que aconteceu, quando e onde..."
                value={form.descricao}
                onChange={e => setForm({ ...form, descricao: e.target.value })}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 13,
                  border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)', outline: 'none',
                  resize: 'vertical', lineHeight: 1.6,
                }}
              />
            </div>

            {/* Upload mock */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'var(--font-sora, Sora, sans-serif)', display: 'block', marginBottom: 6 }}>
                Documentos e fotos <span style={{ color: '#94a3b8', fontWeight: 400 }}>(opcional)</span>
              </label>
              <div style={{
                border: '1.5px dashed #cbd5e1', borderRadius: 10,
                padding: '18px 16px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer',
              }}>
                <Upload style={{ width: 20, height: 20, color: '#94a3b8', margin: '0 auto 6px' }} />
                <p style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  Arraste arquivos ou <span style={{ color: '#2563EB', fontWeight: 600 }}>clique para selecionar</span>
                </p>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>PDF, JPG, PNG até 10 MB</p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                width: '100%', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                background: 'linear-gradient(135deg, #1a3470, #2563EB)',
                color: '#fff', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 2px 8px rgba(37,99,235,0.30)',
              }}
            >
              <Send style={{ width: 15, height: 15 }} />
              Enviar solicitação
            </button>
          </form>
        ) : (
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 style={{ width: 28, height: 28, color: '#059669' }} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-sora, Sora, sans-serif)', marginBottom: 8, letterSpacing: '-0.02em' }}>
              Sinistro registrado!
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', fontFamily: 'var(--font-inter, Inter, sans-serif)', lineHeight: 1.6, marginBottom: 6 }}>
              Seu corretor foi notificado e entrará em contato em até <strong>1 dia útil</strong>.
            </p>
            <p style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)', marginBottom: 24 }}>
              Protocolo: <span style={{ fontWeight: 600, color: '#475569' }}>#SIN-{Date.now().toString().slice(-6)}</span>
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '10px 28px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0',
                cursor: 'pointer',
              }}
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function SinistrosPage() {
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | 'todos'>('todos');
  const [showModal, setShowModal] = useState(false);

  const statusOptions: { value: ClaimStatus | 'todos'; label: string }[] = [
    { value: 'todos',                label: 'Todos' },
    { value: 'aberto',               label: 'Aberto' },
    { value: 'aguardando_documentos',label: 'Aguardando Docs' },
    { value: 'em_analise',           label: 'Em Análise' },
    { value: 'indenizado',           label: 'Indenizado' },
    { value: 'encerrado',            label: 'Encerrado' },
  ];

  const sorted = useMemo(() =>
    [...mockClaims].sort((a, b) =>
      statusConfig[a.status].urgency - statusConfig[b.status].urgency
    ), []);

  const filtered = useMemo(() =>
    statusFilter === 'todos' ? sorted : sorted.filter(c => c.status === statusFilter),
    [statusFilter, sorted]);

  const stats = useMemo(() => ({
    total:      mockClaims.length,
    abertos:    mockClaims.filter(c => c.status === 'aberto').length,
    pendentes:  mockClaims.filter(c => c.status === 'aguardando_documentos').length,
    emAnalise:  mockClaims.filter(c => c.status === 'em_analise').length,
    encerrados: mockClaims.filter(c => ['indenizado', 'encerrado'].includes(c.status)).length,
  }), []);

  const waLink = `https://wa.me/55${mockBroker.whatsapp.replace(/\D/g, '')}`;

  return (
    <>
      {showModal && <NovoSinistroModal onClose={() => setShowModal(false)} />}

      <div style={{ maxWidth: 1160, margin: '0 auto' }}>

        {/* ── Hero ─────────────────────────────────────────────── */}
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
              <ShieldAlert style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.7)' }} />
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
              }}>
                Sinistros
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
                  Meus Sinistros
                </h1>
                <p style={{
                  marginTop: 10, fontSize: 14,
                  color: 'rgba(255,255,255,0.55)',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  lineHeight: 1.6,
                }}>
                  {stats.pendentes > 0
                    ? <><span style={{ color: '#fbbf24', fontWeight: 600 }}>{stats.pendentes} com documentos pendentes</span> — envie para agilizar a análise.</>
                    : 'Acompanhe o andamento dos seus sinistros em tempo real.'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 8,
                    borderRadius: 12, padding: '10px 18px',
                    fontSize: 13, fontWeight: 600,
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#1a3470', cursor: 'pointer',
                    fontFamily: 'var(--font-sora, Sora, sans-serif)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#ffffff'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.95)'; }}
                >
                  <ShieldAlert style={{ width: 15, height: 15 }} />
                  Abrir sinistro
                </button>

                <a
                  href={waLink}
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
                  <WhatsAppSvg style={{ width: 15, height: 15 }} />
                  Falar com corretor
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats bar ────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total',               value: stats.total,      color: '#0f172a', bg: '#ffffff',                    border: '#e2e8f0' },
            { label: 'Abertos',             value: stats.abertos,    color: '#D97706', bg: 'rgba(245,158,11,0.06)',      border: 'rgba(245,158,11,0.20)' },
            { label: 'Aguardando docs',     value: stats.pendentes,  color: '#EA580C', bg: 'rgba(234,88,12,0.06)',      border: 'rgba(234,88,12,0.20)' },
            { label: 'Em análise',          value: stats.emAnalise,  color: '#2563EB', bg: 'rgba(37,99,235,0.06)',      border: 'rgba(37,99,235,0.20)' },
          ].map(({ label, value, color, bg, border }) => (
            <div key={label} style={{
              flex: 1, background: bg, border: `1px solid ${border}`,
              borderRadius: 14, padding: '14px 18px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}>
              <p style={{ fontSize: 22, fontWeight: 800, color, fontFamily: 'var(--font-sora, Sora, sans-serif)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {value}
              </p>
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, fontFamily: 'var(--font-inter, Inter, sans-serif)', fontWeight: 500 }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Status filter pills ──────────────────────────────── */}
        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24,
          padding: '12px 16px',
          background: '#fff', borderRadius: 12,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}>
          {statusOptions.map(opt => (
            <FilterPill
              key={opt.value}
              label={opt.label}
              active={statusFilter === opt.value}
              onClick={() => setStatusFilter(opt.value)}
            />
          ))}
        </div>

        {/* ── Cards grid ──────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '64px 24px',
            background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
          }}>
            <ShieldAlert style={{ width: 40, height: 40, color: '#cbd5e1', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', fontFamily: 'var(--font-sora, Sora, sans-serif)', marginBottom: 4 }}>
              Nenhum sinistro encontrado
            </p>
            <p style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Tente outro filtro ou abra um novo sinistro.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
            gap: 20,
          }}>
            {filtered.map(claim => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
