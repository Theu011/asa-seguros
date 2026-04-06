'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search, ChevronRight, Settings } from 'lucide-react';
import { mockClient } from '@/mock/client';
import { unreadCount } from '@/mock/notifications';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen?: boolean;
}

const pageMeta: Record<string, { label: string; parent?: string }> = {
  '/dashboard':    { label: 'Dashboard' },
  '/seguros':      { label: 'Meus Seguros',   parent: 'Dashboard' },
  '/documentos':   { label: 'Documentos',     parent: 'Dashboard' },
  '/renovacoes':   { label: 'Renovações',     parent: 'Dashboard' },
  '/sinistros':    { label: 'Sinistros',      parent: 'Dashboard' },
  '/solicitacoes': { label: 'Solicitações',   parent: 'Dashboard' },
  '/atendimento':  { label: 'Atendimento',    parent: 'Dashboard' },
  '/notificacoes': { label: 'Notificações',   parent: 'Dashboard' },
  '/meus-dados':   { label: 'Meus Dados',     parent: 'Dashboard' },
  '/ajuda':        { label: 'Ajuda',          parent: 'Dashboard' },
};

export function Header({ onMenuClick, sidebarOpen = true }: HeaderProps) {
  const pathname = usePathname();
  const meta = pageMeta[pathname] ?? { label: 'Portal' };

  const initials = mockClient.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        gap: 12,
      }}
    >
      {/* ── Burger / close toggle — all screen sizes ───────── */}
      <button
        onClick={onMenuClick}
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          background: '#f8fafc',
          cursor: 'pointer',
          padding: 0,
        }}
        aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
      >
        <span style={{
          display: 'block',
          width: 16,
          height: 1.5,
          background: '#64748b',
          borderRadius: 2,
          transformOrigin: 'center',
          transition: 'transform 0.22s ease, opacity 0.22s ease',
          transform: sidebarOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
        }} />
        <span style={{
          display: 'block',
          width: 16,
          height: 1.5,
          background: '#64748b',
          borderRadius: 2,
          transition: 'opacity 0.22s ease, transform 0.22s ease',
          opacity: sidebarOpen ? 0 : 1,
          transform: sidebarOpen ? 'scaleX(0)' : 'none',
        }} />
        <span style={{
          display: 'block',
          width: 16,
          height: 1.5,
          background: '#64748b',
          borderRadius: 2,
          transformOrigin: 'center',
          transition: 'transform 0.22s ease, opacity 0.22s ease',
          transform: sidebarOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
        }} />
      </button>

      {/* ── Breadcrumb (desktop) ────────────────────────────── */}
      <nav
        className="hidden lg:flex"
        style={{ flexShrink: 0, alignItems: 'center', gap: 6 }}
      >
        {meta.parent && (
          <>
            <Link
              href="/dashboard"
              style={{
                fontSize: 13,
                color: '#94a3b8',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                transition: 'color 0.12s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#2563EB')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#94a3b8')}
            >
              {meta.parent}
            </Link>
            <ChevronRight style={{ width: 13, height: 13, color: '#cbd5e1', flexShrink: 0 }} />
          </>
        )}
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#0f172a',
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
            letterSpacing: '-0.015em',
          }}
        >
          {meta.label}
        </span>
      </nav>

      {/* ── Search (grows, capped) ──────────────────────────── */}
      <div
        className="hidden sm:flex"
        style={{
          position: 'relative',
          flex: '1 1 auto',
          maxWidth: 280,
          marginLeft: 8,
        }}
      >
        <Search
          style={{
            position: 'absolute',
            left: 11,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 14,
            height: 14,
            color: '#94a3b8',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Buscar apólice, documento..."
          style={{
            width: '100%',
            height: 36,
            paddingLeft: 34,
            paddingRight: 14,
            fontSize: 13,
            border: '1.5px solid #e2e8f0',
            borderRadius: 10,
            background: '#f8fafc',
            color: '#0f172a',
            outline: 'none',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#2563EB';
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* ── Right rail ─────────────────────────────────────── */}
      <div
        style={{
          marginLeft: 'auto',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {/* Settings icon */}
        <Link
          href="/meus-dados"
          className="hidden lg:flex"
          style={{
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            color: '#94a3b8',
            transition: 'background 0.12s, color 0.12s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#f1f5f9';
            (e.currentTarget as HTMLElement).style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#94a3b8';
          }}
          aria-label="Configurações"
        >
          <Settings style={{ width: 16, height: 16 }} />
        </Link>

        {/* Bell */}
        <Link
          href="/notificacoes"
          style={{
            position: 'relative',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            color: '#64748b',
            transition: 'background 0.12s, color 0.12s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#f1f5f9';
            (e.currentTarget as HTMLElement).style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#64748b';
          }}
          aria-label="Notificações"
        >
          <Bell style={{ width: 16, height: 16 }} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#ef4444',
                border: '1.5px solid #ffffff',
              }}
            />
          )}
        </Link>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: '#e2e8f0', margin: '0 6px', flexShrink: 0 }} />

        {/* User chip */}
        <Link
          href="/meus-dados"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 36,
            paddingLeft: 6,
            paddingRight: 10,
            borderRadius: 10,
            border: '1px solid transparent',
            transition: 'background 0.12s, border-color 0.12s',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#f8fafc';
            (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563EB 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 700,
              color: '#ffffff',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              flexShrink: 0,
              boxShadow: '0 0 0 2px #fff, 0 0 0 3.5px rgba(37,99,235,0.2)',
            }}
          >
            {initials}
          </div>

          {/* Name */}
          <div className="hidden sm:block">
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1.1,
                color: '#0f172a',
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                letterSpacing: '-0.01em',
              }}
            >
              {mockClient.name.split(' ')[0]}
            </p>
            <p
              style={{
                fontSize: 10,
                lineHeight: 1.1,
                marginTop: 2,
                color: '#94a3b8',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            >
              Minha conta
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
