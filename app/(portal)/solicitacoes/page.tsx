'use client';

import { useState, useMemo } from 'react';
import {
  FilePen, Send, X, Upload, CheckCircle2,
  Clock, AlertTriangle, XCircle,
  FileText, UserCog, RefreshCw, Copy,
  Layers, Trash2, ChevronRight, CalendarDays,
  Plus, Search,
} from 'lucide-react';
import { mockRequests } from '@/mock/requests';
import { mockPolicies } from '@/mock/policies';
import { formatDate, policyTypeLabel } from '@/lib/utils';
import type { RequestStatus, RequestType } from '@/types';

// ── Status config ─────────────────────────────────────────────────
const statusConfig: Record<RequestStatus, {
  label: string; color: string; bg: string; border: string; dot: string; icon: React.ElementType;
}> = {
  aberto: {
    label: 'Aberto', color: '#D97706', bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.22)', dot: '#F59E0B', icon: Clock,
  },
  em_analise: {
    label: 'Em análise', color: '#2563EB', bg: 'rgba(37,99,235,0.08)',
    border: 'rgba(37,99,235,0.20)', dot: '#3B82F6', icon: AlertTriangle,
  },
  resolvido: {
    label: 'Resolvido', color: '#059669', bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.22)', dot: '#10B981', icon: CheckCircle2,
  },
  cancelado: {
    label: 'Cancelado', color: '#64748B', bg: 'rgba(100,116,139,0.08)',
    border: 'rgba(100,116,139,0.18)', dot: '#94A3B8', icon: XCircle,
  },
};

// ── Request type config ───────────────────────────────────────────
const typeConfig: Record<RequestType, {
  label: string; icon: React.ElementType; color: string; bg: string; border: string;
}> = {
  alteracao_cadastral: {
    label: 'Alteração Cadastral', icon: UserCog,
    color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.18)',
  },
  segunda_via: {
    label: 'Segunda Via', icon: Copy,
    color: '#0D9488', bg: 'rgba(13,148,136,0.08)', border: 'rgba(13,148,136,0.18)',
  },
  atualizacao_item: {
    label: 'Atualização de Item', icon: RefreshCw,
    color: '#D97706', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)',
  },
  endosso: {
    label: 'Endosso', icon: FilePen,
    color: '#2563EB', bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.18)',
  },
  inclusao_exclusao: {
    label: 'Inclusão / Exclusão', icon: Layers,
    color: '#EA580C', bg: 'rgba(234,88,12,0.08)', border: 'rgba(234,88,12,0.18)',
  },
  cancelamento: {
    label: 'Cancelamento', icon: Trash2,
    color: '#DC2626', bg: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.18)',
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

// ── Request row ───────────────────────────────────────────────────
function RequestRow({ request }: { request: typeof mockRequests[0] }) {
  const status = statusConfig[request.status];
  const type = typeConfig[request.type];
  const TypeIcon = type.icon;
  const StatusIcon = status.icon;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '44px 1fr auto',
      gap: 16,
      alignItems: 'center',
      padding: '16px 20px',
      borderBottom: '1px solid #f1f5f9',
      transition: 'background 0.1s',
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#fafbfc'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      {/* Type icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: type.bg, border: `1.5px solid ${type.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <TypeIcon style={{ width: 18, height: 18, color: type.color }} />
      </div>

      {/* Content */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
          <p style={{
            fontSize: 14, fontWeight: 600, color: '#0f172a',
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
            letterSpacing: '-0.01em',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {request.subject}
          </p>
          {/* Status badge */}
          <span style={{
            flexShrink: 0,
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '2px 9px', borderRadius: 20,
            fontSize: 11, fontWeight: 600,
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
            background: status.bg, color: status.color,
            border: `1px solid ${status.border}`,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: status.dot, flexShrink: 0 }} />
            {status.label}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Type tag */}
          <span style={{
            fontSize: 11, fontWeight: 600, color: type.color,
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
          }}>
            {type.label}
          </span>

          {request.policyNumber && (
            <>
              <span style={{ color: '#e2e8f0', fontSize: 12 }}>·</span>
              <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                {request.policyNumber}
              </span>
            </>
          )}

          <span style={{ color: '#e2e8f0', fontSize: 12 }}>·</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <CalendarDays style={{ width: 11, height: 11, color: '#cbd5e1' }} />
            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              {formatDate(request.date)}
            </span>
          </div>
        </div>

        {/* Description preview */}
        <p style={{
          fontSize: 12, color: '#64748b', marginTop: 5, lineHeight: 1.5,
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
        }}>
          {request.description}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight style={{ width: 16, height: 16, color: '#cbd5e1', flexShrink: 0 }} />
    </div>
  );
}

// ── Nova Solicitação modal ─────────────────────────────────────────
function NovaSolicitacaoModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'type' | 'form' | 'success'>('type');
  const [selectedType, setSelectedType] = useState<RequestType | null>(null);
  const [form, setForm] = useState({ policy: '', description: '' });

  const typeOptions: { value: RequestType; label: string; desc: string; icon: React.ElementType; color: string; bg: string }[] = [
    { value: 'alteracao_cadastral', label: 'Alteração Cadastral', desc: 'Atualizar dados pessoais ou de contato', icon: UserCog, color: '#7C3AED', bg: 'rgba(124,58,237,0.07)' },
    { value: 'segunda_via', label: 'Segunda Via', desc: 'Solicitar segunda via de documentos', icon: Copy, color: '#0D9488', bg: 'rgba(13,148,136,0.07)' },
    { value: 'atualizacao_item', label: 'Atualização de Item', desc: 'Alterar dados do bem segurado', icon: RefreshCw, color: '#D97706', bg: 'rgba(245,158,11,0.07)' },
    { value: 'endosso', label: 'Pedido de Endosso', desc: 'Alterações contratuais na apólice', icon: FilePen, color: '#2563EB', bg: 'rgba(37,99,235,0.07)' },
    { value: 'inclusao_exclusao', label: 'Inclusão / Exclusão', desc: 'Incluir ou excluir coberturas ou itens', icon: Layers, color: '#EA580C', bg: 'rgba(234,88,12,0.07)' },
    { value: 'cancelamento', label: 'Cancelamento', desc: 'Solicitar cancelamento de apólice', icon: Trash2, color: '#DC2626', bg: 'rgba(239,68,68,0.06)' },
  ];

  const handleTypeSelect = (type: RequestType) => {
    setSelectedType(type);
    setStep('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  const selectedTypeConfig = selectedType ? typeConfig[selectedType] : null;
  const SelectedIcon = selectedTypeConfig?.icon || FileText;

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
        background: '#fff', borderRadius: 20, width: '100%',
        maxWidth: step === 'type' ? 600 : 520,
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
            {step !== 'type' && (
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: selectedTypeConfig?.bg || 'rgba(37,99,235,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <SelectedIcon style={{ width: 18, height: 18, color: selectedTypeConfig?.color || '#2563EB' }} />
              </div>
            )}
            {step === 'type' && (
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FilePen style={{ width: 18, height: 18, color: '#2563EB' }} />
              </div>
            )}
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-sora, Sora, sans-serif)', letterSpacing: '-0.01em' }}>
                {step === 'type' ? 'Nova Solicitação' : step === 'form' ? selectedTypeConfig?.label : 'Solicitação enviada'}
              </p>
              <p style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                {step === 'type' ? 'Selecione o tipo de solicitação' : step === 'form' ? 'Preencha os detalhes' : 'Aguardando análise do corretor'}
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

        {/* ── Step 1: Type selector ── */}
        {step === 'type' && (
          <div style={{ padding: '20px 24px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {typeOptions.map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleTypeSelect(opt.value)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '14px 16px', borderRadius: 12, textAlign: 'left',
                      background: opt.bg, border: `1px solid ${opt.color}18`,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${opt.color}20`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'none';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 1px 4px ${opt.color}20` }}>
                      <Icon style={{ width: 16, height: 16, color: opt.color }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-sora, Sora, sans-serif)', marginBottom: 3, letterSpacing: '-0.01em' }}>
                        {opt.label}
                      </p>
                      <p style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-inter, Inter, sans-serif)', lineHeight: 1.45 }}>
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 2: Form ── */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} style={{ padding: '22px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Back */}
            <button
              type="button"
              onClick={() => setStep('type')}
              style={{
                alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 12, color: '#64748b', background: 'none', border: 'none',
                cursor: 'pointer', padding: 0, fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            >
              ← Voltar
            </button>

            {/* Policy (hide for alteracao_cadastral) */}
            {selectedType !== 'alteracao_cadastral' && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'var(--font-sora, Sora, sans-serif)', display: 'block', marginBottom: 6 }}>
                  Apólice vinculada
                </label>
                <select
                  required
                  value={form.policy}
                  onChange={e => setForm({ ...form, policy: e.target.value })}
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
            )}

            {/* Description */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'var(--font-sora, Sora, sans-serif)', display: 'block', marginBottom: 6 }}>
                Descrição da solicitação
              </label>
              <textarea
                required
                rows={4}
                placeholder="Descreva com detalhes o que você precisa..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
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
                Anexos <span style={{ color: '#94a3b8', fontWeight: 400 }}>(opcional)</span>
              </label>
              <div style={{
                border: '1.5px dashed #cbd5e1', borderRadius: 10,
                padding: '16px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer',
              }}>
                <Upload style={{ width: 18, height: 18, color: '#94a3b8', margin: '0 auto 6px' }} />
                <p style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  <span style={{ color: '#2563EB', fontWeight: 600 }}>Clique para selecionar</span> ou arraste arquivos
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
        )}

        {/* ── Step 3: Success ── */}
        {step === 'success' && (
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 style={{ width: 28, height: 28, color: '#059669' }} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-sora, Sora, sans-serif)', marginBottom: 8, letterSpacing: '-0.02em' }}>
              Solicitação enviada!
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', fontFamily: 'var(--font-inter, Inter, sans-serif)', lineHeight: 1.6, marginBottom: 6 }}>
              Seu corretor analisará e retornará em até <strong>2 dias úteis</strong>.
            </p>
            <p style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)', marginBottom: 24 }}>
              Protocolo: <span style={{ fontWeight: 600, color: '#475569' }}>#SOL-{Date.now().toString().slice(-6)}</span>
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
export default function SolicitacoesPage() {
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'todos'>('todos');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const statusOptions: { value: RequestStatus | 'todos'; label: string }[] = [
    { value: 'todos',       label: 'Todas' },
    { value: 'aberto',      label: 'Aberta' },
    { value: 'em_analise',  label: 'Em análise' },
    { value: 'resolvido',   label: 'Resolvida' },
    { value: 'cancelado',   label: 'Cancelada' },
  ];

  const sorted = useMemo(() =>
    [...mockRequests].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ), []);

  const filtered = useMemo(() => {
    let list = statusFilter === 'todos' ? sorted : sorted.filter(r => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.subject.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.policyNumber?.toLowerCase().includes(q) ?? false)
      );
    }
    return list;
  }, [statusFilter, sorted, search]);

  const stats = useMemo(() => ({
    total:     mockRequests.length,
    abertas:   mockRequests.filter(r => r.status === 'aberto').length,
    analise:   mockRequests.filter(r => r.status === 'em_analise').length,
    resolvidas:mockRequests.filter(r => r.status === 'resolvido').length,
  }), []);

  return (
    <>
      {showModal && <NovaSolicitacaoModal onClose={() => setShowModal(false)} />}

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
              <FilePen style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.7)' }} />
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
              }}>
                Solicitações
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
                  Solicitações e Endossos
                </h1>
                <p style={{
                  marginTop: 10, fontSize: 14,
                  color: 'rgba(255,255,255,0.55)',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  lineHeight: 1.6,
                }}>
                  {stats.analise > 0
                    ? <><span style={{ color: '#fbbf24', fontWeight: 600 }}>{stats.analise} em análise</span> — acompanhe o andamento das suas solicitações.</>
                    : 'Gerencie alterações, endossos e pedidos relacionados às suas apólices.'}
                </p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                style={{
                  flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 8,
                  borderRadius: 12, padding: '10px 20px',
                  fontSize: 13, fontWeight: 700,
                  background: 'rgba(255,255,255,0.95)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#1a3470', cursor: 'pointer',
                  fontFamily: 'var(--font-sora, Sora, sans-serif)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#ffffff'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.95)'; }}
              >
                <Plus style={{ width: 15, height: 15 }} />
                Nova solicitação
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats bar ────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total',       value: stats.total,      color: '#0f172a', bg: '#ffffff',                   border: '#e2e8f0' },
            { label: 'Abertas',     value: stats.abertas,    color: '#D97706', bg: 'rgba(245,158,11,0.06)',     border: 'rgba(245,158,11,0.20)' },
            { label: 'Em análise',  value: stats.analise,    color: '#2563EB', bg: 'rgba(37,99,235,0.06)',      border: 'rgba(37,99,235,0.20)' },
            { label: 'Resolvidas',  value: stats.resolvidas, color: '#059669', bg: 'rgba(16,185,129,0.06)',     border: 'rgba(16,185,129,0.20)' },
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

        {/* ── Search + filter bar ──────────────────────────────── */}
        <div style={{
          background: '#fff', borderRadius: 12,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          marginBottom: 16, overflow: 'hidden',
        }}>
          {/* Search row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid #f1f5f9' }}>
            <Search style={{ width: 16, height: 16, color: '#94a3b8', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Buscar por assunto, apólice ou descrição..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, border: 'none', outline: 'none', fontSize: 13,
                color: '#0f172a', background: 'transparent',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <X style={{ width: 14, height: 14, color: '#94a3b8' }} />
              </button>
            )}
          </div>

          {/* Filter pills row */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '10px 16px' }}>
            {statusOptions.map(opt => (
              <FilterPill
                key={opt.value}
                label={opt.label}
                active={statusFilter === opt.value}
                onClick={() => setStatusFilter(opt.value)}
              />
            ))}
          </div>
        </div>

        {/* ── Request list ─────────────────────────────────────── */}
        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}>
          {/* List header */}
          <div style={{
            padding: '12px 20px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <p style={{
              fontSize: 12, fontWeight: 600, color: '#94a3b8',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              {filtered.length} solicitaç{filtered.length === 1 ? 'ão' : 'ões'}
            </p>
            <p style={{ fontSize: 11, color: '#cbd5e1', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Ordenado por mais recente
            </p>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 24px' }}>
              <FilePen style={{ width: 40, height: 40, color: '#cbd5e1', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', fontFamily: 'var(--font-sora, Sora, sans-serif)', marginBottom: 4 }}>
                Nenhuma solicitação encontrada
              </p>
              <p style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)', marginBottom: 20 }}>
                Tente outro filtro ou crie uma nova solicitação.
              </p>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  fontFamily: 'var(--font-sora, Sora, sans-serif)',
                  background: '#2563EB', color: '#fff', border: 'none', cursor: 'pointer',
                }}
              >
                <Plus style={{ width: 14, height: 14 }} />
                Nova solicitação
              </button>
            </div>
          ) : (
            <div>
              {filtered.map((req, i) => (
                <RequestRow key={req.id} request={req} />
              ))}
              {/* Remove bottom border from last row */}
              <style>{`div[style*="border-bottom: 1px solid rgb(241, 245, 249)"]:last-child { border-bottom: none; }`}</style>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
