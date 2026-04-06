'use client';

import {
  Shield,
  FileText,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Calendar,
  MessageCircle,
  Clock,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

import { mockClient } from '@/mock/client';
import { mockPolicies } from '@/mock/policies';
import { mockDocuments } from '@/mock/documents';
import { mockNotifications } from '@/mock/notifications';
import { mockBroker } from '@/mock/broker';
import { mockClaims } from '@/mock/claims';
import { mockRenewals } from '@/mock/renewals';

import { StatCard } from '@/components/ui/StatCard';
import { PolicyCard } from '@/components/ui/PolicyCard';
import { DocumentCard } from '@/components/ui/DocumentCard';
import { AlertCard } from '@/components/ui/AlertCard';
import { ContactCard } from '@/components/ui/ContactCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  formatDate,
  daysUntil,
  policyTypeLabel,
  claimStatusLabel,
  claimStatusColor,
  renewalStatusLabel,
  renewalStatusColor,
} from '@/lib/utils';

const activePolicies   = mockPolicies.filter((p) => p.status === 'ativo' || p.status === 'em_renovacao');
const unreadNotifs     = mockNotifications.filter((n) => !n.read);
const upcomingRenewals = mockRenewals.filter((r) => r.status !== 'renovado');
const recentDocs       = [...mockDocuments].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
const highPriorityAlerts = mockNotifications.filter((n) => n.priority === 'alta' && !n.read);
const openClaims       = mockClaims.filter((c) => c.status !== 'encerrado' && c.status !== 'indenizado');

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

// ── Reusable card shell ────────────────────────────────────────────
const card: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 14,
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
};

export default function DashboardPage() {
  const firstName = mockClient.name.split(' ')[0];

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto' }}>

      {/* ── Hero greeting ──────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          marginBottom: 32,
          background: 'linear-gradient(135deg, #0f1f45 0%, #1a3470 40%, #2563EB 100%)',
          boxShadow: '0 4px 24px rgba(15,31,69,0.18)',
        }}
      >
        {/* decorative rings */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full"
          style={{ border: '32px solid rgba(255,255,255,0.04)' }} />
        <div className="pointer-events-none absolute -right-3 top-1/2 -translate-y-1/2 h-32 w-32 rounded-full"
          style={{ border: '20px solid rgba(255,255,255,0.03)' }} />
        <div className="pointer-events-none absolute left-1/3 -bottom-8 h-36 w-36 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />

        <div className="relative" style={{ padding: '36px 40px' }}>
          <div
            style={{
              marginBottom: 16,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              borderRadius: 100,
              padding: '5px 12px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <Sparkles style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.7)' }} />
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.07em',
              textTransform: 'uppercase' as const,
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
            }}>
              Área do Cliente
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap' as const, alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                lineHeight: 1.1,
              }}>
                {getGreeting()}, {firstName}.
              </h1>
              <p style={{
                marginTop: 10,
                fontSize: 14,
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                lineHeight: 1.6,
              }}>
                Você tem{' '}
                <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                  {activePolicies.length} seguros ativos
                </span>
                {unreadNotifs.length > 0 && (
                  <> e{' '}
                    <span style={{ color: '#fbbf24', fontWeight: 600 }}>
                      {unreadNotifs.length} notificações não lidas
                    </span>
                  </>
                )}.
              </p>
            </div>

            <Link
              href="/atendimento"
              style={{
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                borderRadius: 12,
                padding: '10px 18px',
                fontSize: 13,
                fontWeight: 600,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                backdropFilter: 'blur(8px)',
                textDecoration: 'none',
                transition: 'background 0.15s, transform 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <MessageCircle style={{ width: 15, height: 15 }} />
              Falar com corretor
            </Link>
          </div>
        </div>
      </div>

      {/* ── Priority alerts ─────────────────────────────────────────── */}
      {highPriorityAlerts.length > 0 && (
        <div style={{ marginBottom: 40, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {highPriorityAlerts.map((n) => (
            <AlertCard
              key={n.id}
              variant="urgent"
              title={n.title}
              description={n.message}
              action={
                n.policyId ? (
                  <Link
                    href={n.type === 'renovacao' ? '/renovacoes' : `/seguros/${n.policyId}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--asa)' }}
                  >
                    Ver detalhes <ChevronRight style={{ width: 12, height: 12 }} />
                  </Link>
                ) : undefined
              }
            />
          ))}
        </div>
      )}

      {/* ── Stat cards — strict 4-col grid ──────────────────────────── */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4"
        style={{ gap: 14, marginBottom: 48 }}
      >
        <StatCard
          title="Seguros Ativos"
          value={activePolicies.length}
          description="apólices em vigor"
          icon={Shield}
          accentColor="#2563EB"
          accentBg="rgba(37,99,235,0.08)"
          featured
        />
        <StatCard
          title="Documentos"
          value={mockDocuments.length}
          description="disponíveis"
          icon={FileText}
          accentColor="#0D9488"
          accentBg="rgba(13,148,136,0.08)"
        />
        <StatCard
          title="Renovações"
          value={upcomingRenewals.length}
          description="pendentes"
          icon={RefreshCw}
          accentColor="#D97706"
          accentBg="rgba(217,119,6,0.08)"
        />
        <StatCard
          title="Alertas"
          value={unreadNotifs.length}
          description="não lidos"
          icon={AlertTriangle}
          accentColor="#DC2626"
          accentBg="rgba(220,38,38,0.07)"
        />
      </div>

      {/* ── Main two-column grid ─────────────────────────────────────── */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}
        className="lg:grid-cols-[1fr_288px]"
      >

        {/* ═══ Left column ════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

          {/* Próximos Vencimentos ──────────────────────────────────── */}
          <section>
            <SectionHeader title="Próximos Vencimentos" viewAllHref="/renovacoes" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcomingRenewals.length > 0 ? (
                upcomingRenewals.map((renewal) => {
                  const days      = daysUntil(renewal.expirationDate);
                  const isUrgent  = days <= 30;
                  const isExpired = days < 0;
                  const calColor  = isExpired ? '#DC2626' : isUrgent ? '#D97706' : '#2563EB';
                  const calBg     = isExpired ? 'rgba(220,38,38,0.07)' : isUrgent ? 'rgba(217,119,6,0.07)' : 'rgba(37,99,235,0.07)';

                  return (
                    <div
                      key={renewal.id}
                      style={{ ...card, display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: calBg, border: `1px solid ${calColor}22`, flexShrink: 0,
                      }}>
                        <Calendar style={{ width: 18, height: 18, color: calColor }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: 14, fontWeight: 600, color: '#0f172a',
                          fontFamily: 'var(--font-sora, Sora, sans-serif)',
                          letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {policyTypeLabel[renewal.type]} · {renewal.insurer}
                        </p>
                        <p style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                          {renewal.policyNumber} · Vence {formatDate(renewal.expirationDate)}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <StatusBadge label={renewalStatusLabel[renewal.status]} colorClass={renewalStatusColor[renewal.status]} />
                        <span style={{
                          fontSize: 13, fontWeight: 700, minWidth: 40, textAlign: 'right' as const,
                          color: isExpired ? '#DC2626' : isUrgent ? '#D97706' : '#94a3b8',
                          fontFamily: 'var(--font-sora, Sora, sans-serif)',
                        }}>
                          {isExpired ? 'Vencido' : `${days}d`}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{
                  borderRadius: 12, border: '1.5px dashed var(--c200)', background: 'var(--c50)',
                  padding: '24px 16px', textAlign: 'center' as const, fontSize: 13, color: 'var(--c500)',
                }}>
                  Nenhuma renovação pendente.
                </div>
              )}
            </div>
          </section>

          {/* Meus Seguros ─────────────────────────────────────────── */}
          <section>
            <SectionHeader title="Meus Seguros" viewAllHref="/seguros" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {mockPolicies.map((policy) => (
                <PolicyCard key={policy.id} policy={policy} />
              ))}
            </div>
          </section>

          {/* Sinistros ─────────────────────────────────────────────── */}
          {openClaims.length > 0 && (
            <section>
              <SectionHeader title="Sinistros em Andamento" viewAllHref="/sinistros" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {openClaims.map((claim) => (
                  <div key={claim.id} style={{ ...card, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
                          <span style={{
                            fontSize: 13, fontWeight: 600, color: 'var(--c900)',
                            fontFamily: 'var(--font-sora, Sora, sans-serif)', letterSpacing: '-0.01em',
                          }}>
                            {claim.type}
                          </span>
                          <StatusBadge label={claimStatusLabel[claim.status]} colorClass={claimStatusColor[claim.status]} />
                        </div>
                        <p style={{ fontSize: 11, color: 'var(--c500)', marginTop: 3, fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                          {claim.policyNumber} · Aberto em {formatDate(claim.openDate)}
                        </p>
                        {claim.nextAction && (
                          <div style={{
                            marginTop: 8, fontSize: 12, color: 'var(--c600)',
                            background: '#f8fafc', borderRadius: 8, padding: '7px 10px',
                            border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 5,
                          }}>
                            <Clock style={{ width: 11, height: 11, color: 'var(--c500)', flexShrink: 0 }} />
                            <span style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
                              <strong>Próxima ação:</strong> {claim.nextAction}
                            </span>
                          </div>
                        )}
                      </div>
                      <Link href="/sinistros" style={{
                        fontSize: 12, fontWeight: 600, color: 'var(--asa)',
                        fontFamily: 'var(--font-sora, Sora, sans-serif)', flexShrink: 0,
                      }}>
                        Detalhes →
                      </Link>
                    </div>
                    {claim.pendingDocuments.length > 0 && (
                      <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
                        {claim.pendingDocuments.map((doc) => (
                          <span key={doc} style={{
                            fontSize: 11, fontWeight: 600, background: 'rgba(234,88,12,0.06)',
                            color: '#EA580C', border: '1px solid rgba(234,88,12,0.14)',
                            borderRadius: 100, padding: '3px 9px',
                            fontFamily: 'var(--font-sora, Sora, sans-serif)',
                          }}>
                            ⚠ {doc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Documentos Recentes ──────────────────────────────────── */}
          <section>
            <SectionHeader title="Documentos Recentes" viewAllHref="/documentos" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentDocs.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          </section>
        </div>

        {/* ═══ Right column — sticky ══════════════════════════════════ */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 32 }}
          className="lg:sticky lg:top-[72px] lg:self-start"
        >

          {/* Corretor ──────────────────────────────────────────────── */}
          <section>
            <SectionHeader title="Seu Corretor" viewAllHref="/atendimento" />
            <ContactCard broker={mockBroker} />
          </section>

          {/* Ações Rápidas ─────────────────────────────────────────── */}
          <section>
            <SectionHeader title="Ações Rápidas" />
            <div style={{ ...card, padding: 4 }}>
              {([
                { label: 'Ver apólices',          href: '/seguros',    icon: Shield },
                { label: 'Central de documentos', href: '/documentos', icon: FileText },
                { label: 'Falar com corretor',    href: '/atendimento', icon: MessageCircle },
                { label: 'Renovações',            href: '/renovacoes', icon: RefreshCw },
              ] as const).map((action, i, arr) => (
                <Link
                  key={action.href}
                  href={action.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    borderRadius: 10, fontSize: 13, fontWeight: 500,
                    color: 'var(--c600)', fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    textDecoration: 'none', transition: 'all 0.12s ease',
                    borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = '#f0f6ff';
                    el.style.color = 'var(--asa)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'transparent';
                    el.style.color = 'var(--c600)';
                  }}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(37,99,235,0.07)',
                  }}>
                    <action.icon style={{ width: 14, height: 14, color: 'var(--asa)' }} />
                  </div>
                  {action.label}
                  <ChevronRight style={{ width: 13, height: 13, color: '#cbd5e1', marginLeft: 'auto' }} />
                </Link>
              ))}
            </div>
          </section>

          {/* Notificações ──────────────────────────────────────────── */}
          <section>
            <SectionHeader title="Notificações" viewAllHref="/notificacoes" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mockNotifications.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  style={{
                    borderRadius: 12,
                    border: n.read ? '1px solid #e2e8f0' : '1px solid rgba(37,99,235,0.18)',
                    background: n.read ? '#fff' : 'rgba(239,246,255,0.6)',
                    padding: '11px 13px',
                    display: 'flex', alignItems: 'flex-start', gap: 9,
                    boxShadow: n.read ? 'none' : '0 1px 4px rgba(37,99,235,0.06)',
                  }}
                >
                  <span style={{
                    marginTop: 4, width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                    background: n.read ? '#cbd5e1' : 'var(--asa)',
                    boxShadow: n.read ? 'none' : '0 0 0 3px rgba(37,99,235,0.1)',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 12, fontWeight: n.read ? 500 : 600, lineHeight: 1.4,
                      color: n.read ? 'var(--c600)' : 'var(--c900)',
                      fontFamily: 'var(--font-sora, Sora, sans-serif)', letterSpacing: '-0.005em',
                    }}>
                      {n.title}
                    </p>
                    <p style={{
                      fontSize: 11, color: 'var(--c500)', lineHeight: 1.5, marginTop: 2,
                      fontFamily: 'var(--font-inter, Inter, sans-serif)',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                    }}>
                      {n.message}
                    </p>
                  </div>
                </div>
              ))}
              <Link
                href="/notificacoes"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 10, border: '1.5px dashed #e2e8f0', padding: '9px 0',
                  fontSize: 12, fontWeight: 600, color: 'var(--c500)',
                  fontFamily: 'var(--font-sora, Sora, sans-serif)', transition: 'all 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,99,235,0.25)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--asa)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(239,246,255,0.5)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                  (e.currentTarget as HTMLElement).style.color = 'var(--c500)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                Ver todas →
              </Link>
            </div>
          </section>

          {/* Portfolio summary ─────────────────────────────────────── */}
          <section>
            <div style={{
              borderRadius: 14,
              border: '1px solid rgba(37,99,235,0.12)',
              background: 'linear-gradient(135deg, #f0f6ff 0%, #f8fafc 100%)',
              padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                <TrendingUp style={{ width: 14, height: 14, color: '#0D9488' }} />
                <span style={{
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const,
                  letterSpacing: '0.07em', color: '#0D9488',
                  fontFamily: 'var(--font-sora, Sora, sans-serif)',
                }}>
                  Resumo da Carteira
                </span>
              </div>
              <p style={{
                fontSize: 12, color: 'var(--c600)', lineHeight: 1.6,
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}>
                {activePolicies.length} seguros protegem você e sua família.{' '}
                {upcomingRenewals.length > 0 ? (
                  <>
                    Próxima renovação em{' '}
                    <span style={{ fontWeight: 600, color: 'var(--c900)' }}>
                      {Math.min(
                        ...upcomingRenewals
                          .map((r) => daysUntil(r.expirationDate))
                          .filter((d) => d >= 0)
                      )} dias
                    </span>.
                  </>
                ) : (
                  'Nenhuma renovação pendente.'
                )}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
