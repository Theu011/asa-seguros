'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shield,
  FileText,
  RefreshCw,
  AlertOctagon,
  ClipboardList,
  HeadphonesIcon,
  Bell,
  User,
  HelpCircle,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockClient } from '@/mock/client';
import { unreadCount } from '@/mock/notifications';

const navItems = [
  { label: 'Dashboard',    href: '/dashboard',    icon: LayoutDashboard },
  { label: 'Meus Seguros', href: '/seguros',       icon: Shield },
  { label: 'Documentos',   href: '/documentos',   icon: FileText },
  { label: 'Renovações',   href: '/renovacoes',   icon: RefreshCw },
  { label: 'Sinistros',    href: '/sinistros',    icon: AlertOctagon },
  { label: 'Solicitações', href: '/solicitacoes', icon: ClipboardList },
  { label: 'Atendimento',  href: '/atendimento',  icon: HeadphonesIcon },
];

const secondaryItems = [
  { label: 'Notificações', href: '/notificacoes', icon: Bell, badge: unreadCount },
  { label: 'Meus Dados',   href: '/meus-dados',   icon: User },
  { label: 'Ajuda',        href: '/ajuda',        icon: HelpCircle },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  const firstName = mockClient.name.split(' ')[0];
  const initials  = mockClient.name.split(' ').slice(0, 2).map((n) => n[0]).join('');

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Mobile overlay */}
      {open && onClose && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col',
          'transition-transform duration-300 ease-in-out',
          'lg:relative lg:inset-y-auto lg:h-full lg:translate-x-0 lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{
          background: '#111827',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Faint top glow */}
        <div
          className="pointer-events-none absolute top-0 inset-x-0 h-32 opacity-40"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(37,99,235,0.35) 0%, transparent 70%)',
          }}
        />

        {/* ── Logo row — matches Header h-[60px] ─────────────────── */}
        <div
          style={{ height: 68, padding: '0 28px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'relative' }}
        >
          <Link href="/dashboard">
            <img
              src="/brand_assets/asa_seguros_logo_white_transparent.png"
              alt="Asa Seguros"
              className="h-8 w-auto"
            />
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
              style={{ color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)';
              }}
              aria-label="Fechar menu"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ── User mini-profile ──────────────────────────────────── */}
        <div className="relative flex items-center gap-3 rounded-xl"
          style={{
            margin: '16px 20px 8px',
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white select-none"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563EB 100%)',
              boxShadow: '0 0 0 2px rgba(37,99,235,0.35)',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
            }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p
              className="text-[13px] font-semibold leading-none truncate"
              style={{
                color: '#ffffff',
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                letterSpacing: '-0.015em',
              }}
            >
              {firstName}
            </p>
            <p
              className="text-[11px] leading-none mt-1.5 truncate"
              style={{
                color: 'rgba(255,255,255,0.38)',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            >
              {mockClient.email}
            </p>
          </div>
        </div>

        {/* ── Navigation ─────────────────────────────────────────── */}
        <nav className="relative flex-1 overflow-y-auto py-5 flex flex-col gap-6" style={{ padding: '20px 20px 0' }}>

          {/* Primary group */}
          <div>
            <p
              style={{
                paddingLeft: 12,
                marginBottom: 6,
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.25)',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            >
              Menu
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '11px 14px',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 500,
                      fontFamily: 'var(--font-inter, Inter, sans-serif)',
                      textDecoration: 'none',
                      transition: 'background 0.12s, color 0.12s',
                      ...(active
                        ? {
                            background: 'rgba(37,99,235,0.22)',
                            color: '#ffffff',
                            boxShadow: 'inset 0 0 0 1px rgba(37,99,235,0.35)',
                          }
                        : { color: 'rgba(255,255,255,0.5)' }),
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
                      }
                    }}
                  >
                    {active && (
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 3,
                          height: 18,
                          borderRadius: '0 3px 3px 0',
                          background: '#60a5fa',
                        }}
                      />
                    )}
                    <item.icon
                      style={{
                        width: 17,
                        height: 17,
                        flexShrink: 0,
                        color: active ? '#93c5fd' : 'rgba(255,255,255,0.35)',
                      }}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Secondary group */}
          <div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: 12 }} />
            <p
              style={{
                paddingLeft: 12,
                marginBottom: 6,
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.25)',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            >
              Conta
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {secondaryItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '11px 14px',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 500,
                      fontFamily: 'var(--font-inter, Inter, sans-serif)',
                      textDecoration: 'none',
                      transition: 'background 0.12s, color 0.12s',
                      ...(active
                        ? {
                            background: 'rgba(37,99,235,0.22)',
                            color: '#ffffff',
                            boxShadow: 'inset 0 0 0 1px rgba(37,99,235,0.35)',
                          }
                        : { color: 'rgba(255,255,255,0.5)' }),
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
                      }
                    }}
                  >
                    {active && (
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 3,
                          height: 18,
                          borderRadius: '0 3px 3px 0',
                          background: '#60a5fa',
                        }}
                      />
                    )}
                    <item.icon
                      style={{
                        width: 17,
                        height: 17,
                        flexShrink: 0,
                        color: active ? '#93c5fd' : 'rgba(255,255,255,0.35)',
                      }}
                    />
                    {item.label}
                    {item.badge != null && item.badge > 0 && (
                      <span
                        style={{
                          marginLeft: 'auto',
                          minWidth: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 10,
                          padding: '0 5px',
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#fff',
                          background: '#ef4444',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* ── Logout ─────────────────────────────────────────────── */}
        <div
          style={{
            flexShrink: 0,
            padding: '12px 20px 20px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '11px 14px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.3)',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              textDecoration: 'none',
              transition: 'background 0.12s, color 0.12s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.12)';
              (e.currentTarget as HTMLElement).style.color = '#fca5a5';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)';
            }}
          >
            <LogOut style={{ width: 17, height: 17, flexShrink: 0 }} />
            Sair da conta
          </Link>
        </div>
      </aside>
    </>
  );
}
