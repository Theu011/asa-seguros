import { Mail, Phone, MessageCircle, Clock } from 'lucide-react';
import type { Broker } from '@/types';

interface ContactCardProps {
  broker: Broker;
}

export function ContactCard({ broker }: ContactCardProps) {
  const waLink = `https://wa.me/55${broker.whatsapp.replace(/\D/g, '')}`;
  const initials = broker.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  return (
    <div
      style={{
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* ── Avatar + name ─────────────────────────────────── */}
      <div
        style={{
          padding: '20px 20px 18px',
          background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Avatar */}
          <div
            style={{
              width: 52,
              height: 52,
              flexShrink: 0,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 700,
              color: '#ffffff',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563EB 100%)',
              boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              letterSpacing: '-0.01em',
              userSelect: 'none',
            }}
          >
            {initials}
          </div>

          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#0f172a',
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {broker.name}
            </p>
            <p
              style={{
                fontSize: 12,
                marginTop: 4,
                color: '#2563EB',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                fontWeight: 500,
              }}
            >
              {broker.role}
            </p>
          </div>
        </div>
      </div>

      {/* ── Contact rows ──────────────────────────────────── */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Email */}
        <a
          href={`mailto:${broker.email}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid #f1f5f9',
            background: '#f8fafc',
            textDecoration: 'none',
            transition: 'border-color 0.12s, background 0.12s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = '#bfdbfe';
            (e.currentTarget as HTMLElement).style.background = '#eff6ff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = '#f1f5f9';
            (e.currentTarget as HTMLElement).style.background = '#f8fafc';
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(37,99,235,0.08)',
          }}>
            <Mail style={{ width: 15, height: 15, color: '#2563EB' }} />
          </div>
          <span style={{
            fontSize: 13,
            color: '#334155',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {broker.email}
          </span>
        </a>

        {/* Phone */}
        <a
          href={`tel:${broker.phone}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid #f1f5f9',
            background: '#f8fafc',
            textDecoration: 'none',
            transition: 'border-color 0.12s, background 0.12s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = '#bfdbfe';
            (e.currentTarget as HTMLElement).style.background = '#eff6ff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = '#f1f5f9';
            (e.currentTarget as HTMLElement).style.background = '#f8fafc';
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(37,99,235,0.08)',
          }}>
            <Phone style={{ width: 15, height: 15, color: '#2563EB' }} />
          </div>
          <span style={{
            fontSize: 13,
            color: '#334155',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
          }}>
            {broker.phone}
          </span>
        </a>

        {/* Working hours */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid #f1f5f9',
            background: '#f8fafc',
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(37,99,235,0.08)',
          }}>
            <Clock style={{ width: 15, height: 15, color: '#2563EB' }} />
          </div>
          <span style={{
            fontSize: 13,
            color: '#64748b',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
          }}>
            {broker.workingHours}
          </span>
        </div>
      </div>

      {/* ── WhatsApp CTA ──────────────────────────────────── */}
      <div style={{ padding: '0 20px 20px' }}>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
            padding: '13px 20px',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 700,
            color: '#ffffff',
            textDecoration: 'none',
            fontFamily: 'var(--font-sora, Sora, sans-serif)',
            letterSpacing: '-0.01em',
            background: '#16a34a',
            boxShadow: '0 2px 8px rgba(22,163,74,0.28)',
            transition: 'background 0.12s, transform 0.12s, box-shadow 0.12s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = '#15803d';
            el.style.transform = 'translateY(-1px)';
            el.style.boxShadow = '0 6px 16px rgba(22,163,74,0.32)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = '#16a34a';
            el.style.transform = 'translateY(0)';
            el.style.boxShadow = '0 2px 8px rgba(22,163,74,0.28)';
          }}
        >
          {/* WhatsApp SVG icon */}
          <svg
            viewBox="0 0 24 24"
            style={{ width: 18, height: 18, fill: '#ffffff', flexShrink: 0 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.845L.057 23.885a.5.5 0 0 0 .613.613l6.04-1.478A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.795 9.795 0 0 1-5.012-1.376l-.36-.214-3.722.91.927-3.635-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
          </svg>
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
