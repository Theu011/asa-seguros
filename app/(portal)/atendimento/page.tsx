'use client';

import { useState, useMemo } from 'react';
import {
  Headphones, Mail, Phone, Clock,
  MessageSquarePlus, CheckCircle2, Send,
  X, Upload, ChevronRight, CalendarDays,
  ExternalLink, Circle, Hash,
} from 'lucide-react';
import { mockBroker, mockMessages } from '@/mock/broker';
import { mockPolicies } from '@/mock/policies';
import { formatDate, policyTypeLabel } from '@/lib/utils';
import type { MessageStatus } from '@/types';

// ── WhatsApp SVG ──────────────────────────────────────────────────
const WhatsAppSvg = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, ...style }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.845L.057 23.885a.5.5 0 0 0 .613.613l6.04-1.478A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.795 9.795 0 0 1-5.012-1.376l-.36-.214-3.722.91.927-3.635-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
  </svg>
);

// ── Message status config ─────────────────────────────────────────
const statusConfig: Record<MessageStatus, {
  label: string; color: string; bg: string; border: string; dot: string;
}> = {
  enviado: {
    label: 'Aguardando resposta', color: '#D97706',
    bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.22)', dot: '#F59E0B',
  },
  respondido: {
    label: 'Respondido', color: '#2563EB',
    bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.20)', dot: '#3B82F6',
  },
  encerrado: {
    label: 'Encerrado', color: '#64748B',
    bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.18)', dot: '#94A3B8',
  },
};

// ── Nova mensagem modal ───────────────────────────────────────────
function NovaMensagemModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [form, setForm] = useState({ subject: '', policy: '', message: '' });

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
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 18px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquarePlus style={{ width: 18, height: 18, color: '#2563EB' }} />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-sora, Sora, sans-serif)', letterSpacing: '-0.01em' }}>
                {step === 'form' ? 'Nova mensagem' : 'Mensagem enviada'}
              </p>
              <p style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                {step === 'form' ? `Para: ${mockBroker.name}` : 'Aguardando resposta do corretor'}
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
            {/* Subject */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'var(--font-sora, Sora, sans-serif)', display: 'block', marginBottom: 6 }}>
                Assunto
              </label>
              <input
                required
                type="text"
                placeholder="Ex: Dúvida sobre cobertura do seguro auto"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 13,
                  border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)', outline: 'none',
                }}
              />
            </div>

            {/* Policy (optional) */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'var(--font-sora, Sora, sans-serif)', display: 'block', marginBottom: 6 }}>
                Apólice relacionada <span style={{ color: '#94a3b8', fontWeight: 400 }}>(opcional)</span>
              </label>
              <select
                value={form.policy}
                onChange={e => setForm({ ...form, policy: e.target.value })}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 13,
                  border: '1px solid #e2e8f0', background: '#f8fafc', color: form.policy ? '#0f172a' : '#94a3b8',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)', outline: 'none',
                }}
              >
                <option value="">Nenhuma apólice específica</option>
                {mockPolicies.map(p => (
                  <option key={p.id} value={p.id}>{p.number} — {policyTypeLabel[p.type]}</option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'var(--font-sora, Sora, sans-serif)', display: 'block', marginBottom: 6 }}>
                Mensagem
              </label>
              <textarea
                required
                rows={5}
                placeholder="Escreva sua mensagem aqui..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 13,
                  border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)', outline: 'none',
                  resize: 'vertical', lineHeight: 1.6,
                }}
              />
            </div>

            {/* Attachment mock */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'var(--font-sora, Sora, sans-serif)', display: 'block', marginBottom: 6 }}>
                Anexos <span style={{ color: '#94a3b8', fontWeight: 400 }}>(opcional)</span>
              </label>
              <div style={{
                border: '1.5px dashed #cbd5e1', borderRadius: 10,
                padding: '14px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer',
              }}>
                <Upload style={{ width: 16, height: 16, color: '#94a3b8', margin: '0 auto 4px' }} />
                <p style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  <span style={{ color: '#2563EB', fontWeight: 600 }}>Clique</span> para anexar arquivos
                </p>
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
              Enviar mensagem
            </button>
          </form>
        ) : (
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 style={{ width: 28, height: 28, color: '#059669' }} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-sora, Sora, sans-serif)', marginBottom: 8, letterSpacing: '-0.02em' }}>
              Mensagem enviada!
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', fontFamily: 'var(--font-inter, Inter, sans-serif)', lineHeight: 1.6, marginBottom: 6 }}>
              {mockBroker.name} receberá sua mensagem e responderá em até <strong>1 dia útil</strong>.
            </p>
            <p style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)', marginBottom: 24 }}>
              Protocolo: <span style={{ fontWeight: 600, color: '#475569' }}>ATD-2025-{Date.now().toString().slice(-4)}</span>
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '10px 28px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', cursor: 'pointer',
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

// ── Message row ───────────────────────────────────────────────────
function MessageRow({ message }: { message: typeof mockMessages[0] }) {
  const status = statusConfig[message.status];
  const isUnread = message.status === 'respondido';

  return (
    <div
      style={{
        display: 'flex', gap: 16, padding: '16px 22px',
        borderBottom: '1px solid #f1f5f9',
        transition: 'background 0.1s',
        position: 'relative',
        background: isUnread ? 'rgba(37,99,235,0.015)' : 'transparent',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#fafbfc'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = isUnread ? 'rgba(37,99,235,0.015)' : 'transparent'; }}
    >
      {/* Unread dot */}
      {isUnread && (
        <div style={{
          position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
          width: 6, height: 6, borderRadius: '50%', background: '#2563EB',
        }} />
      )}

      {/* Broker avatar */}
      <div style={{
        flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
        background: 'linear-gradient(135deg, #1a3470, #2563EB)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
          TA
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <p style={{
              fontSize: 14, fontWeight: isUnread ? 700 : 600, color: '#0f172a',
              fontFamily: 'var(--font-sora, Sora, sans-serif)', letterSpacing: '-0.01em',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {message.subject}
            </p>
            <span style={{
              flexShrink: 0,
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              background: status.bg, color: status.color, border: `1px solid ${status.border}`,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: status.dot, flexShrink: 0 }} />
              {status.label}
            </span>
          </div>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CalendarDays style={{ width: 11, height: 11, color: '#cbd5e1' }} />
            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              {formatDate(message.date.split('T')[0])}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Hash style={{ width: 10, height: 10, color: '#cbd5e1' }} />
            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)', fontWeight: 500 }}>
              {message.protocol}
            </span>
          </div>
          {message.policyId && mockPolicies.find(p => p.id === message.policyId) && (
            <>
              <span style={{ color: '#e2e8f0' }}>·</span>
              <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                {mockPolicies.find(p => p.id === message.policyId)?.number}
              </span>
            </>
          )}
        </div>

        <p style={{
          fontSize: 12, color: '#64748b', lineHeight: 1.5,
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
        }}>
          {message.preview}
        </p>
      </div>

      <ChevronRight style={{ width: 15, height: 15, color: '#cbd5e1', flexShrink: 0, alignSelf: 'center' }} />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function AtendimentoPage() {
  const [showModal, setShowModal] = useState(false);

  const waLink = `https://wa.me/55${mockBroker.whatsapp.replace(/\D/g, '')}`;

  const stats = useMemo(() => ({
    total:      mockMessages.length,
    respondido: mockMessages.filter(m => m.status === 'respondido').length,
    aguardando: mockMessages.filter(m => m.status === 'enviado').length,
    encerrado:  mockMessages.filter(m => m.status === 'encerrado').length,
  }), []);

  const sorted = useMemo(() =>
    [...mockMessages].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    []);

  // Is broker available right now? (weekday 9–18h BRT)
  const isAvailable = (() => {
    const now = new Date();
    const day = now.getDay(); // 0=sun,6=sat
    const hour = now.getHours();
    return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
  })();

  return (
    <>
      {showModal && <NovaMensagemModal onClose={() => setShowModal(false)} />}

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
              <Headphones style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.7)' }} />
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
              }}>
                Atendimento
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
                  Fale com seu Corretor
                </h1>
                <p style={{
                  marginTop: 10, fontSize: 14,
                  color: 'rgba(255,255,255,0.55)',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  lineHeight: 1.6,
                }}>
                  {stats.respondido > 0
                    ? <><span style={{ color: '#fbbf24', fontWeight: 600 }}>{stats.respondido} mensage{stats.respondido > 1 ? 'ns' : 'm'} respondida{stats.respondido > 1 ? 's' : ''}</span> — verifique as respostas do seu corretor.</>
                    : 'Envie mensagens e acompanhe os protocolos de atendimento.'}
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
                <MessageSquarePlus style={{ width: 15, height: 15 }} />
                Nova mensagem
              </button>
            </div>
          </div>
        </div>

        {/* ── Two-column layout ─────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>

          {/* ── LEFT: Broker card ──────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Broker profile */}
            <div style={{
              background: '#fff', borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              overflow: 'hidden',
            }}>
              {/* Header band */}
              <div style={{
                height: 56,
                background: 'linear-gradient(135deg, #0f1f45 0%, #2563EB 100%)',
              }} />

              {/* Avatar + info */}
              <div style={{ padding: '0 22px 22px', marginTop: -28 }}>
                {/* Avatar */}
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1a3470, #2563EB)',
                  border: '3px solid #fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
                  marginBottom: 10,
                }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-sora, Sora, sans-serif)', letterSpacing: '-0.02em' }}>
                    TA
                  </span>
                </div>

                {/* Name + role */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-sora, Sora, sans-serif)', letterSpacing: '-0.02em' }}>
                      {mockBroker.name}
                    </p>
                    {/* Online indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, background: isAvailable ? 'rgba(16,185,129,0.10)' : 'rgba(100,116,139,0.08)', border: `1px solid ${isAvailable ? 'rgba(16,185,129,0.25)' : 'rgba(100,116,139,0.18)'}` }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: isAvailable ? '#10B981' : '#94A3B8' }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: isAvailable ? '#059669' : '#64748B', fontFamily: 'var(--font-sora)', letterSpacing: '0.04em' }}>
                        {isAvailable ? 'Disponível' : 'Ausente'}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                    {mockBroker.role}
                  </p>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: '#f1f5f9', marginBottom: 14 }} />

                {/* Contact channels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {/* WhatsApp */}
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
                      background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.18)',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.14)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.07)'; }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <WhatsAppSvg style={{ width: 15, height: 15, color: '#16a34a' }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', fontFamily: 'var(--font-sora)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 1 }}>
                        WhatsApp
                      </p>
                      <p style={{ fontSize: 12, color: '#374151', fontFamily: 'var(--font-inter, Inter, sans-serif)', fontWeight: 500 }}>
                        {mockBroker.whatsapp}
                      </p>
                    </div>
                    <ExternalLink style={{ width: 12, height: 12, color: '#94a3b8', marginLeft: 'auto', flexShrink: 0 }} />
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${mockBroker.email}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
                      background: '#f8fafc', border: '1px solid #f1f5f9',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f1f5f9'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#f8fafc'; }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail style={{ width: 14, height: 14, color: '#2563EB' }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#64748b', fontFamily: 'var(--font-sora)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 1 }}>
                        E-mail
                      </p>
                      <p style={{ fontSize: 11, color: '#374151', fontFamily: 'var(--font-inter, Inter, sans-serif)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {mockBroker.email}
                      </p>
                    </div>
                  </a>

                  {/* Phone */}
                  <a
                    href={`tel:${mockBroker.phone}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
                      background: '#f8fafc', border: '1px solid #f1f5f9',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f1f5f9'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#f8fafc'; }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone style={{ width: 14, height: 14, color: '#2563EB' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#64748b', fontFamily: 'var(--font-sora)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 1 }}>
                        Telefone
                      </p>
                      <p style={{ fontSize: 12, color: '#374151', fontFamily: 'var(--font-inter, Inter, sans-serif)', fontWeight: 500 }}>
                        {mockBroker.phone}
                      </p>
                    </div>
                  </a>

                  {/* Working hours */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 10,
                    background: '#f8fafc', border: '1px solid #f1f5f9',
                  }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(100,116,139,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Clock style={{ width: 14, height: 14, color: '#64748b' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#64748b', fontFamily: 'var(--font-sora)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 1 }}>
                        Horário
                      </p>
                      <p style={{ fontSize: 12, color: '#374151', fontFamily: 'var(--font-inter, Inter, sans-serif)', fontWeight: 500 }}>
                        {mockBroker.workingHours}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: '#f1f5f9', margin: '16px 0 14px' }} />

                {/* CTA button */}
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    width: '100%', padding: '11px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                    fontFamily: 'var(--font-sora, Sora, sans-serif)',
                    background: 'linear-gradient(135deg, #1a3470, #2563EB)',
                    color: '#fff', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
                  }}
                >
                  <MessageSquarePlus style={{ width: 14, height: 14 }} />
                  Enviar mensagem
                </button>
              </div>
            </div>

            {/* Stats mini card */}
            <div style={{
              background: '#fff', borderRadius: 14,
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              padding: '16px 20px',
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', fontFamily: 'var(--font-sora)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>
                Resumo
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Protocolos totais',  value: stats.total,      color: '#0f172a' },
                  { label: 'Respondidos',         value: stats.respondido, color: '#2563EB' },
                  { label: 'Aguardando resposta', value: stats.aguardando, color: '#D97706' },
                  { label: 'Encerrados',          value: stats.encerrado,  color: '#64748B' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>{label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color, fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Inbox ────────────────────────────────────── */}
          <div style={{
            background: '#fff', borderRadius: 16,
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden',
          }}>
            {/* Inbox header */}
            <div style={{
              padding: '16px 22px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-sora, Sora, sans-serif)', letterSpacing: '-0.01em', marginBottom: 2 }}>
                  Histórico de mensagens
                </p>
                <p style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  {stats.total} protocolo{stats.total !== 1 ? 's' : ''} · {stats.respondido} não lido{stats.respondido !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  fontFamily: 'var(--font-sora, Sora, sans-serif)',
                  background: 'rgba(37,99,235,0.07)', color: '#2563EB',
                  border: '1px solid rgba(37,99,235,0.18)', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.13)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.07)'; }}
              >
                <MessageSquarePlus style={{ width: 13, height: 13 }} />
                Nova
              </button>
            </div>

            {/* Message list */}
            {sorted.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 24px' }}>
                <Headphones style={{ width: 40, height: 40, color: '#cbd5e1', margin: '0 auto 12px' }} />
                <p style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', fontFamily: 'var(--font-sora, Sora, sans-serif)', marginBottom: 4 }}>
                  Nenhuma mensagem ainda
                </p>
                <p style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                  Envie uma mensagem para seu corretor.
                </p>
              </div>
            ) : (
              <div>
                {sorted.map(msg => (
                  <MessageRow key={msg.id} message={msg} />
                ))}
              </div>
            )}

            {/* Footer note */}
            <div style={{
              padding: '12px 22px',
              borderTop: '1px solid #f8fafc',
              background: '#fafbfc',
            }}>
              <p style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)', textAlign: 'center' }}>
                Tempo médio de resposta: <span style={{ fontWeight: 600, color: '#64748b' }}>até 1 dia útil</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
