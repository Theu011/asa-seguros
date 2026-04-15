'use client';

import { useState, useMemo } from 'react';
import {
  Bell, Calendar, FileText, RefreshCw,
  ShieldAlert, Headphones, Settings2,
  CheckCheck, Check, X, Circle,
} from 'lucide-react';
import { mockNotifications } from '@/mock/notifications';
import { formatDate } from '@/lib/utils';
import type { NotificationType, NotificationPriority } from '@/types';

// ── Type config ───────────────────────────────────────────────────
const typeConfig: Record<NotificationType, {
  label: string; icon: React.ElementType; color: string; bg: string; border: string;
}> = {
  vencimento: {
    label: 'Vencimento', icon: Calendar,
    color: '#DC2626', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.18)',
  },
  renovacao: {
    label: 'Renovação', icon: RefreshCw,
    color: '#2563EB', bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.18)',
  },
  sinistro: {
    label: 'Sinistro', icon: ShieldAlert,
    color: '#EA580C', bg: 'rgba(234,88,12,0.08)', border: 'rgba(234,88,12,0.18)',
  },
  documento: {
    label: 'Documento', icon: FileText,
    color: '#0D9488', bg: 'rgba(13,148,136,0.08)', border: 'rgba(13,148,136,0.18)',
  },
  atendimento: {
    label: 'Atendimento', icon: Headphones,
    color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.18)',
  },
  sistema: {
    label: 'Sistema', icon: Settings2,
    color: '#64748B', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.18)',
  },
};

const priorityConfig: Record<NotificationPriority, {
  label: string; color: string; bg: string; border: string; dot: string;
}> = {
  alta:  { label: 'Alta',  color: '#DC2626', bg: 'rgba(239,68,68,0.08)',    border: 'rgba(239,68,68,0.22)',    dot: '#EF4444' },
  media: { label: 'Média', color: '#D97706', bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.22)',   dot: '#F59E0B' },
  baixa: { label: 'Baixa', color: '#64748B', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.18)', dot: '#94A3B8' },
};

// ── Filter pill ───────────────────────────────────────────────────
function FilterPill({ label, active, onClick, dot }: {
  label: string; active: boolean; onClick: () => void; dot?: string;
}) {
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
        display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? 'rgba(255,255,255,0.7)' : dot, flexShrink: 0 }} />}
      {label}
    </button>
  );
}

// ── Notification item ─────────────────────────────────────────────
function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: typeof mockNotifications[0];
  onMarkRead: (id: string) => void;
}) {
  const type = typeConfig[notification.type];
  const priority = priorityConfig[notification.priority];
  const TypeIcon = type.icon;
  const isUnread = !notification.read;
  const isHighPriority = notification.priority === 'alta';

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex', gap: 16,
        padding: '16px 20px',
        borderBottom: '1px solid #f1f5f9',
        background: isUnread
          ? isHighPriority
            ? 'rgba(239,68,68,0.025)'
            : 'rgba(37,99,235,0.018)'
          : 'transparent',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = isUnread
          ? isHighPriority ? 'rgba(239,68,68,0.045)' : 'rgba(37,99,235,0.035)'
          : '#fafbfc';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = isUnread
          ? isHighPriority ? 'rgba(239,68,68,0.025)' : 'rgba(37,99,235,0.018)'
          : 'transparent';
      }}
    >
      {/* Left priority bar */}
      {isUnread && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderRadius: '0 2px 2px 0',
          background: isHighPriority ? '#EF4444' : '#3B82F6',
        }} />
      )}

      {/* Type icon */}
      <div style={{
        flexShrink: 0, width: 42, height: 42, borderRadius: 12,
        background: type.bg, border: `1.5px solid ${type.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginLeft: isUnread ? 8 : 0,
      }}>
        <TypeIcon style={{ width: 18, height: 18, color: type.color }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
          <p style={{
            fontSize: 14,
            fontWeight: isUnread ? 700 : 500,
            color: isUnread ? '#0f172a' : '#475569',
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
          }}>
            {notification.title}
          </p>

          {/* Priority badge — only for alta */}
          {isHighPriority && (
            <span style={{
              flexShrink: 0,
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 20,
              fontSize: 10, fontWeight: 700,
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              background: priority.bg, color: priority.color, border: `1px solid ${priority.border}`,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: priority.dot, flexShrink: 0 }} />
              Urgente
            </span>
          )}
        </div>

        {/* Message */}
        <p style={{
          fontSize: 13, color: '#64748b', lineHeight: 1.55,
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
          marginBottom: 8,
        }}>
          {notification.message}
        </p>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Type tag */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '2px 8px', borderRadius: 6,
            fontSize: 11, fontWeight: 600,
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            background: type.bg, color: type.color, border: `1px solid ${type.border}`,
          }}>
            {type.label}
          </span>

          <span style={{ color: '#e2e8f0', fontSize: 12 }}>·</span>

          {/* Date */}
          <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            {formatDate(notification.date.split('T')[0])}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-start', gap: 6, paddingTop: 2 }}>
        {isUnread && (
          <button
            onClick={() => onMarkRead(notification.id)}
            title="Marcar como lida"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 10px', borderRadius: 7, fontSize: 11, fontWeight: 600,
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              background: '#f1f5f9', color: '#475569',
              border: '1px solid #e2e8f0', cursor: 'pointer',
              transition: 'all 0.12s', whiteSpace: 'nowrap' as const,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#f1f5f9';
            }}
          >
            <Check style={{ width: 11, height: 11 }} />
            Marcar lida
          </button>
        )}
        {!isUnread && (
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)',
          }}>
            <Check style={{ width: 13, height: 13, color: '#10B981' }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function NotificacoesPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'todos'>('todos');
  const [readFilter, setReadFilter] = useState<'todas' | 'nao_lidas' | 'lidas'>('todas');

  const typeOptions: { value: NotificationType | 'todos'; label: string }[] = [
    { value: 'todos',       label: 'Todas' },
    { value: 'vencimento',  label: 'Vencimento' },
    { value: 'renovacao',   label: 'Renovação' },
    { value: 'sinistro',    label: 'Sinistro' },
    { value: 'documento',   label: 'Documento' },
    { value: 'atendimento', label: 'Atendimento' },
    { value: 'sistema',     label: 'Sistema' },
  ];

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const sorted = useMemo(() =>
    [...notifications].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [notifications]);

  const filtered = useMemo(() => {
    let list = typeFilter === 'todos' ? sorted : sorted.filter(n => n.type === typeFilter);
    if (readFilter === 'nao_lidas') list = list.filter(n => !n.read);
    if (readFilter === 'lidas') list = list.filter(n => n.read);
    return list;
  }, [typeFilter, readFilter, sorted]);

  const stats = useMemo(() => ({
    total:     notifications.length,
    naoLidas:  notifications.filter(n => !n.read).length,
    urgentes:  notifications.filter(n => !n.read && n.priority === 'alta').length,
    lidas:     notifications.filter(n => n.read).length,
  }), [notifications]);

  return (
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
            <Bell style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.7)' }} />
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
            }}>
              Notificações
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
                Minhas Notificações
              </h1>
              <p style={{
                marginTop: 10, fontSize: 14,
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                lineHeight: 1.6,
              }}>
                {stats.naoLidas > 0
                  ? <><span style={{ color: '#fbbf24', fontWeight: 600 }}>{stats.naoLidas} não lida{stats.naoLidas !== 1 ? 's' : ''}</span>{stats.urgentes > 0 && <> · <span style={{ color: '#fca5a5', fontWeight: 600 }}>{stats.urgentes} urgente{stats.urgentes !== 1 ? 's' : ''}</span></>} — verifique as pendências importantes.</>
                  : 'Você está em dia! Nenhuma notificação pendente.'}
              </p>
            </div>

            {stats.naoLidas > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 8,
                  borderRadius: 12, padding: '10px 18px',
                  fontSize: 13, fontWeight: 600,
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff', cursor: 'pointer',
                  fontFamily: 'var(--font-sora, Sora, sans-serif)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.20)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; }}
              >
                <CheckCheck style={{ width: 15, height: 15 }} />
                Marcar todas como lidas
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats bar ────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total',       value: stats.total,    color: '#0f172a', bg: '#ffffff',                   border: '#e2e8f0' },
          { label: 'Não lidas',   value: stats.naoLidas, color: '#2563EB', bg: 'rgba(37,99,235,0.06)',      border: 'rgba(37,99,235,0.20)' },
          { label: 'Urgentes',    value: stats.urgentes, color: '#DC2626', bg: 'rgba(239,68,68,0.06)',      border: 'rgba(239,68,68,0.20)' },
          { label: 'Lidas',       value: stats.lidas,    color: '#059669', bg: 'rgba(16,185,129,0.06)',     border: 'rgba(16,185,129,0.20)' },
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

      {/* ── Filter bar ──────────────────────────────────────── */}
      <div style={{
        background: '#fff', borderRadius: 12,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        marginBottom: 16, overflow: 'hidden',
      }}>
        {/* Read status toggle */}
        <div style={{
          display: 'flex', gap: 2, padding: '10px 16px',
          borderBottom: '1px solid #f1f5f9',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', gap: 2, background: '#f8fafc', borderRadius: 8, padding: 3, border: '1px solid #f1f5f9' }}>
            {([
              { value: 'todas',     label: 'Todas' },
              { value: 'nao_lidas', label: 'Não lidas' },
              { value: 'lidas',     label: 'Lidas' },
            ] as const).map(opt => (
              <button
                key={opt.value}
                onClick={() => setReadFilter(opt.value)}
                style={{
                  padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  background: readFilter === opt.value ? '#fff' : 'transparent',
                  color: readFilter === opt.value ? '#0f172a' : '#94a3b8',
                  border: 'none', cursor: 'pointer',
                  boxShadow: readFilter === opt.value ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.12s',
                }}
              >
                {opt.label}
                {opt.value === 'nao_lidas' && stats.naoLidas > 0 && (
                  <span style={{
                    marginLeft: 5, fontSize: 10, fontWeight: 700,
                    background: '#2563EB', color: '#fff',
                    padding: '1px 5px', borderRadius: 10,
                  }}>
                    {stats.naoLidas}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Result count */}
          <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Type filter pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '10px 16px' }}>
          {typeOptions.map(opt => (
            <FilterPill
              key={opt.value}
              label={opt.label}
              active={typeFilter === opt.value}
              onClick={() => setTypeFilter(opt.value)}
              dot={opt.value !== 'todos' ? typeConfig[opt.value as NotificationType]?.color : undefined}
            />
          ))}
        </div>
      </div>

      {/* ── Notification list ─────────────────────────────── */}
      <div style={{
        background: '#fff', borderRadius: 16,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <Bell style={{ width: 40, height: 40, color: '#cbd5e1', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', fontFamily: 'var(--font-sora, Sora, sans-serif)', marginBottom: 4 }}>
              Nenhuma notificação encontrada
            </p>
            <p style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
              Tente outro filtro ou volte mais tarde.
            </p>
          </div>
        ) : (
          <>
            {/* List header */}
            <div style={{
              padding: '11px 20px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', fontFamily: 'var(--font-sora, Sora, sans-serif)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {filtered.length} notificaç{filtered.length === 1 ? 'ão' : 'ões'}
              </p>
              <p style={{ fontSize: 11, color: '#cbd5e1', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                Mais recentes primeiro
              </p>
            </div>

            <div>
              {filtered.map(n => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onMarkRead={handleMarkRead}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
