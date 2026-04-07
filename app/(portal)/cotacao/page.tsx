'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Car, Home, Heart, Building2, Plane,
  ChevronLeft, ChevronRight, Check,
  Sparkles, Phone, Mail,
  CalendarDays, Clock, FileText, User,
} from 'lucide-react';
import { mockBroker } from '@/mock/broker';

// ── WhatsApp icon (official two-path SVG) ─────────────────────────
const WhatsAppSvg = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, ...style }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.845L.057 23.885a.5.5 0 0 0 .613.613l6.04-1.478A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.795 9.795 0 0 1-5.012-1.376l-.36-.214-3.722.91.927-3.635-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
  </svg>
);

// ── Insurance types ───────────────────────────────────────────────
const insuranceTypes = [
  {
    id: 'auto',
    label: 'Seguro Auto',
    description: 'Proteção completa para seu veículo contra colisão, roubo e danos.',
    icon: Car,
    color: '#2563EB',
    bg: 'rgba(37,99,235,0.08)',
    border: 'rgba(37,99,235,0.18)',
  },
  {
    id: 'residencial',
    label: 'Residencial',
    description: 'Proteja seu lar contra incêndio, roubo, danos elétricos e mais.',
    icon: Home,
    color: '#D97706',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.20)',
  },
  {
    id: 'vida',
    label: 'Seguro de Vida',
    description: 'Garanta tranquilidade para você e sua família em qualquer situação.',
    icon: Heart,
    color: '#DC2626',
    bg: 'rgba(239,68,68,0.07)',
    border: 'rgba(239,68,68,0.18)',
  },
  {
    id: 'empresarial',
    label: 'Empresarial',
    description: 'Cobertura para sua empresa: patrimônio, responsabilidade e mais.',
    icon: Building2,
    color: '#7C3AED',
    bg: 'rgba(109,40,217,0.07)',
    border: 'rgba(109,40,217,0.18)',
  },
  {
    id: 'viagem',
    label: 'Seguro Viagem',
    description: 'Viaje com segurança: assistência médica, extravio de bagagem e cancelamento.',
    icon: Plane,
    color: '#0D9488',
    bg: 'rgba(13,148,136,0.08)',
    border: 'rgba(13,148,136,0.20)',
  },
] as const;

type InsuranceTypeId = typeof insuranceTypes[number]['id'];

// ── Shared form state ─────────────────────────────────────────────
interface FormState {
  type: InsuranceTypeId | '';
  // auto
  autoMake: string;
  autoModel: string;
  autoYear: string;
  autoPlate: string;
  autoUsage: string;
  // residencial
  resCep: string;
  resType: string;
  resOwnership: string;
  resValue: string;
  // vida
  vidaDob: string;
  vidaCoverage: string;
  vidaBeneficiary: string;
  // empresarial
  empName: string;
  empCnpj: string;
  empActivity: string;
  empValue: string;
  // viagem
  viaDestination: string;
  viaStart: string;
  viaEnd: string;
  viaTravelers: string;
  // contact
  contactMethod: string;
  contactTime: string;
  notes: string;
}

const emptyForm: FormState = {
  type: '',
  autoMake: '', autoModel: '', autoYear: '', autoPlate: '', autoUsage: '',
  resCep: '', resType: '', resOwnership: '', resValue: '',
  vidaDob: '', vidaCoverage: '', vidaBeneficiary: '',
  empName: '', empCnpj: '', empActivity: '', empValue: '',
  viaDestination: '', viaStart: '', viaEnd: '', viaTravelers: '',
  contactMethod: 'whatsapp', contactTime: 'manha', notes: '',
};

// ── Field helpers ─────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: 'block',
      fontSize: 12,
      fontWeight: 600,
      color: '#64748b',
      fontFamily: 'var(--font-sora, Sora, sans-serif)',
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
      marginBottom: 6,
    }}>
      {children}
    </label>
  );
}

function Input({
  value, onChange, placeholder, type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '10px 14px',
        borderRadius: 10,
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        fontSize: 14,
        color: '#0f172a',
        fontFamily: 'var(--font-inter, Inter, sans-serif)',
        outline: 'none',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = '#2563EB';
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.10)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
      }}
    />
  );
}

function Select({
  value, onChange, children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 14px',
        borderRadius: 10,
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        fontSize: 14,
        color: value ? '#0f172a' : '#94a3b8',
        fontFamily: 'var(--font-inter, Inter, sans-serif)',
        outline: 'none',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        appearance: 'auto',
      }}
    >
      {children}
    </select>
  );
}

function FieldGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: 16,
    }}>
      {children}
    </div>
  );
}

// ── Step 2 form per type ──────────────────────────────────────────
function AutoForm({ form, set }: { form: FormState; set: (k: keyof FormState, v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FieldGrid>
        <div><Label>Marca</Label><Input value={form.autoMake} onChange={v => set('autoMake', v)} placeholder="Ex: Toyota" /></div>
        <div><Label>Modelo</Label><Input value={form.autoModel} onChange={v => set('autoModel', v)} placeholder="Ex: Corolla" /></div>
      </FieldGrid>
      <FieldGrid>
        <div><Label>Ano</Label><Input value={form.autoYear} onChange={v => set('autoYear', v)} placeholder="Ex: 2022" /></div>
        <div><Label>Placa</Label><Input value={form.autoPlate} onChange={v => set('autoPlate', v)} placeholder="Ex: ABC-1234" /></div>
      </FieldGrid>
      <div>
        <Label>Uso do veículo</Label>
        <Select value={form.autoUsage} onChange={v => set('autoUsage', v)}>
          <option value="">Selecione</option>
          <option value="particular">Particular</option>
          <option value="trabalho">Trabalho / Comercial</option>
          <option value="app">Aplicativo (Uber, 99 etc.)</option>
        </Select>
      </div>
    </div>
  );
}

function ResidencialForm({ form, set }: { form: FormState; set: (k: keyof FormState, v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FieldGrid>
        <div><Label>CEP</Label><Input value={form.resCep} onChange={v => set('resCep', v)} placeholder="00000-000" /></div>
        <div>
          <Label>Tipo de imóvel</Label>
          <Select value={form.resType} onChange={v => set('resType', v)}>
            <option value="">Selecione</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="comercial">Imóvel comercial</option>
          </Select>
        </div>
      </FieldGrid>
      <FieldGrid>
        <div>
          <Label>Situação</Label>
          <Select value={form.resOwnership} onChange={v => set('resOwnership', v)}>
            <option value="">Selecione</option>
            <option value="proprio">Próprio</option>
            <option value="alugado">Alugado</option>
            <option value="financiado">Financiado</option>
          </Select>
        </div>
        <div><Label>Valor aproximado do imóvel</Label><Input value={form.resValue} onChange={v => set('resValue', v)} placeholder="Ex: R$ 450.000" /></div>
      </FieldGrid>
    </div>
  );
}

function VidaForm({ form, set }: { form: FormState; set: (k: keyof FormState, v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FieldGrid>
        <div><Label>Data de nascimento</Label><Input type="date" value={form.vidaDob} onChange={v => set('vidaDob', v)} /></div>
        <div>
          <Label>Cobertura desejada</Label>
          <Select value={form.vidaCoverage} onChange={v => set('vidaCoverage', v)}>
            <option value="">Selecione</option>
            <option value="100k">R$ 100.000</option>
            <option value="300k">R$ 300.000</option>
            <option value="500k">R$ 500.000</option>
            <option value="1m">R$ 1.000.000</option>
            <option value="outro">Outro valor</option>
          </Select>
        </div>
      </FieldGrid>
      <div><Label>Nome do beneficiário principal</Label><Input value={form.vidaBeneficiary} onChange={v => set('vidaBeneficiary', v)} placeholder="Nome completo" /></div>
    </div>
  );
}

function EmpresarialForm({ form, set }: { form: FormState; set: (k: keyof FormState, v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FieldGrid>
        <div><Label>Razão social</Label><Input value={form.empName} onChange={v => set('empName', v)} placeholder="Nome da empresa" /></div>
        <div><Label>CNPJ</Label><Input value={form.empCnpj} onChange={v => set('empCnpj', v)} placeholder="00.000.000/0001-00" /></div>
      </FieldGrid>
      <FieldGrid>
        <div><Label>Ramo de atividade</Label><Input value={form.empActivity} onChange={v => set('empActivity', v)} placeholder="Ex: Comércio varejista" /></div>
        <div><Label>Valor do patrimônio a proteger</Label><Input value={form.empValue} onChange={v => set('empValue', v)} placeholder="Ex: R$ 1.200.000" /></div>
      </FieldGrid>
    </div>
  );
}

function ViagemForm({ form, set }: { form: FormState; set: (k: keyof FormState, v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><Label>Destino</Label><Input value={form.viaDestination} onChange={v => set('viaDestination', v)} placeholder="Ex: Europa, EUA, Brasil" /></div>
      <FieldGrid>
        <div><Label>Data de saída</Label><Input type="date" value={form.viaStart} onChange={v => set('viaStart', v)} /></div>
        <div><Label>Data de retorno</Label><Input type="date" value={form.viaEnd} onChange={v => set('viaEnd', v)} /></div>
      </FieldGrid>
      <div>
        <Label>Número de viajantes</Label>
        <Select value={form.viaTravelers} onChange={v => set('viaTravelers', v)}>
          <option value="">Selecione</option>
          <option value="1">1 viajante</option>
          <option value="2">2 viajantes</option>
          <option value="3">3 viajantes</option>
          <option value="4+">4 ou mais</option>
        </Select>
      </div>
    </div>
  );
}

// ── Step indicator ────────────────────────────────────────────────
function StepBar({ current, total }: { current: number; total: number }) {
  const labels = ['Tipo de seguro', 'Informações', 'Contato'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
      {labels.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < total - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: done ? '#2563EB' : active ? '#2563EB' : '#f1f5f9',
                border: done ? '2px solid #2563EB' : active ? '2px solid #2563EB' : '2px solid #e2e8f0',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}>
                {done
                  ? <Check style={{ width: 14, height: 14, color: '#fff' }} />
                  : <span style={{ fontSize: 12, fontWeight: 700, color: active ? '#fff' : '#94a3b8', fontFamily: 'var(--font-sora)' }}>{step}</span>
                }
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: active || done ? 600 : 400,
                color: active ? '#0f172a' : done ? '#2563EB' : '#94a3b8',
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            </div>
            {i < total - 1 && (
              <div style={{
                flex: 1,
                height: 2,
                background: done ? '#2563EB' : '#e2e8f0',
                margin: '0 8px',
                marginBottom: 22,
                transition: 'background 0.2s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function CotacaoPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  function setField(k: keyof FormState, v: string) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  const selectedType = insuranceTypes.find(t => t.id === form.type);

  function handleSubmit() {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        {/* Success hero */}
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
          <div className="pointer-events-none absolute left-1/3 -bottom-8 h-36 w-36 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />

          <div className="relative" style={{ padding: '40px 40px 44px' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(52,211,153,0.2)',
              border: '2px solid rgba(52,211,153,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 20,
            }}>
              <Check style={{ width: 24, height: 24, color: '#34d399' }} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 10,
            }}>
              Solicitação enviada!
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
              Recebemos seu pedido de cotação de <span style={{ color: '#fff', fontWeight: 600 }}>{selectedType?.label}</span>.
              {' '}Seu corretor entrará em contato em breve.
            </p>
          </div>
        </div>

        {/* Info card */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '28px 32px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          marginBottom: 16,
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#94a3b8', fontFamily: 'var(--font-sora)', marginBottom: 20 }}>
            Próximos passos
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: Clock, text: 'Seu corretor analisará as informações fornecidas e preparará as melhores opções do mercado.', label: '1. Análise' },
              { icon: FileText, text: 'Você receberá propostas personalizadas com coberturas e valores comparados.', label: '2. Proposta' },
              { icon: Phone, text: `${mockBroker.name} entrará em contato pelo canal que você preferiu para tirar dúvidas e fechar.`, label: '3. Contato' },
            ].map(({ icon: Icon, text, label }) => (
              <div key={label} style={{ display: 'flex', gap: 16 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(37,99,235,0.07)',
                  border: '1px solid rgba(37,99,235,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon style={{ width: 16, height: 16, color: '#2563EB' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', fontFamily: 'var(--font-sora)', marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Broker card */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '20px 24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 32,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(37,99,235,0.08)',
            border: '2px solid rgba(37,99,235,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User style={{ width: 20, height: 20, color: '#2563EB' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', fontFamily: 'var(--font-sora)' }}>{mockBroker.name}</p>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{mockBroker.role} · {mockBroker.workingHours}</p>
          </div>
          <a
            href={`https://wa.me/55${mockBroker.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flexShrink: 0,
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 10,
              background: 'rgba(34,197,94,0.10)',
              border: '1px solid rgba(34,197,94,0.30)',
              color: '#16a34a',
              fontSize: 13, fontWeight: 600,
              fontFamily: 'var(--font-sora)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <WhatsAppSvg style={{ width: 15, height: 15 }} />
            WhatsApp
          </a>
        </div>

        <Link
          href="/seguros"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 13, fontWeight: 500, color: '#64748b',
            fontFamily: 'var(--font-inter)',
            textDecoration: 'none',
          }}
        >
          <ChevronLeft style={{ width: 15, height: 15 }} />
          Voltar para Meus Seguros
        </Link>
      </div>
    );
  }

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
            <Sparkles style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.7)' }} />
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
              fontFamily: 'var(--font-sora, Sora, sans-serif)',
            }}>
              Nova cotação
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
                Solicitar seguro
              </h1>
              <p style={{
                marginTop: 10, fontSize: 14,
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                lineHeight: 1.6,
              }}>
                Preencha as informações abaixo e seu corretor preparará as melhores opções.
              </p>
            </div>

            <Link
              href="/seguros"
              style={{
                flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 8,
                borderRadius: 12, padding: '10px 18px',
                fontSize: 13, fontWeight: 600,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                textDecoration: 'none',
              }}
            >
              <ChevronLeft style={{ width: 15, height: 15 }} />
              Meus Seguros
            </Link>
          </div>
        </div>
      </div>

      {/* ── Form card ────────────────────────────────────────────── */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(15,31,69,0.06)',
        overflow: 'hidden',
      }}>
        {/* Step bar */}
        <div style={{ padding: '28px 32px 0' }}>
          <StepBar current={step} total={3} />
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#f1f5f9', margin: '0 0 28px' }} />

        {/* Content */}
        <div style={{ padding: '0 32px 32px' }}>

          {/* ── STEP 1: Type selection ── */}
          {step === 1 && (
            <div>
              <p style={{
                fontSize: 16, fontWeight: 700, color: '#0f172a',
                fontFamily: 'var(--font-sora)', letterSpacing: '-0.01em',
                marginBottom: 6,
              }}>
                Qual tipo de seguro você precisa?
              </p>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
                Selecione uma opção para continuar.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {insuranceTypes.map((t) => {
                  const Icon = t.icon;
                  const active = form.type === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setField('type', t.id)}
                      style={{
                        textAlign: 'left',
                        padding: '18px 20px',
                        borderRadius: 14,
                        border: active ? `2px solid ${t.color}` : '2px solid #e2e8f0',
                        background: active ? t.bg : '#fafbfc',
                        boxShadow: active
                          ? `0 2px 12px ${t.bg}`
                          : '0 1px 2px rgba(0,0,0,0.03)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        width: '100%',
                      }}
                    >
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: active ? t.bg : 'rgba(0,0,0,0.04)',
                        border: `1.5px solid ${active ? t.border : 'rgba(0,0,0,0.06)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 12,
                      }}>
                        <Icon style={{ width: 18, height: 18, color: active ? t.color : '#94a3b8' }} />
                      </div>
                      <p style={{
                        fontSize: 13, fontWeight: 700, color: active ? t.color : '#0f172a',
                        fontFamily: 'var(--font-sora)',
                        marginBottom: 4,
                      }}>
                        {t.label}
                      </p>
                      <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                        {t.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 2: Details ── */}
          {step === 2 && selectedType && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: selectedType.bg,
                  border: `1.5px solid ${selectedType.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <selectedType.icon style={{ width: 18, height: 18, color: selectedType.color }} />
                </div>
                <div>
                  <p style={{
                    fontSize: 16, fontWeight: 700, color: '#0f172a',
                    fontFamily: 'var(--font-sora)', letterSpacing: '-0.01em',
                  }}>
                    {selectedType.label}
                  </p>
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 1 }}>
                    Preencha as informações do que será segurado.
                  </p>
                </div>
              </div>

              {form.type === 'auto'        && <AutoForm form={form} set={setField} />}
              {form.type === 'residencial' && <ResidencialForm form={form} set={setField} />}
              {form.type === 'vida'        && <VidaForm form={form} set={setField} />}
              {form.type === 'empresarial' && <EmpresarialForm form={form} set={setField} />}
              {form.type === 'viagem'      && <ViagemForm form={form} set={setField} />}
            </div>
          )}

          {/* ── STEP 3: Contact ── */}
          {step === 3 && (
            <div>
              <p style={{
                fontSize: 16, fontWeight: 700, color: '#0f172a',
                fontFamily: 'var(--font-sora)', letterSpacing: '-0.01em',
                marginBottom: 6,
              }}>
                Como prefere ser atendido?
              </p>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
                Seu corretor {mockBroker.name} usará esses dados para entrar em contato.
              </p>

              {/* Contact method */}
              <div style={{ marginBottom: 20 }}>
                <Label>Canal de contato preferido</Label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                  {[
                    { id: 'whatsapp', label: 'WhatsApp', icon: WhatsAppSvg, color: '#22c55e' },
                    { id: 'telefone', label: 'Telefone', icon: Phone, color: '#2563EB' },
                    { id: 'email',    label: 'E-mail',   icon: Mail,          color: '#7C3AED' },
                  ].map(({ id, label, icon: Icon, color }) => {
                    const active = form.contactMethod === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setField('contactMethod', id)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 8,
                          padding: '9px 18px', borderRadius: 10,
                          border: active ? `1.5px solid ${color}` : '1.5px solid #e2e8f0',
                          background: active ? `${color}12` : '#fafbfc',
                          color: active ? color : '#475569',
                          fontSize: 13, fontWeight: 600,
                          fontFamily: 'var(--font-inter)',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        <Icon style={{ width: 15, height: 15 }} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Best time */}
              <div style={{ marginBottom: 20 }}>
                <Label>Melhor horário para contato</Label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                  {[
                    { id: 'manha',  label: 'Manhã (9h–12h)',    icon: CalendarDays },
                    { id: 'tarde',  label: 'Tarde (12h–18h)',   icon: CalendarDays },
                    { id: 'qualquer', label: 'Qualquer horário', icon: Clock },
                  ].map(({ id, label, icon: Icon }) => {
                    const active = form.contactTime === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setField('contactTime', id)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 8,
                          padding: '9px 18px', borderRadius: 10,
                          border: active ? '1.5px solid #2563EB' : '1.5px solid #e2e8f0',
                          background: active ? 'rgba(37,99,235,0.07)' : '#fafbfc',
                          color: active ? '#2563EB' : '#475569',
                          fontSize: 13, fontWeight: 600,
                          fontFamily: 'var(--font-inter)',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        <Icon style={{ width: 15, height: 15 }} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label>Informações adicionais (opcional)</Label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setField('notes', e.target.value)}
                  placeholder="Descreva aqui qualquer informação relevante, dúvidas ou preferências de cobertura..."
                  rows={4}
                  style={{
                    width: '100%',
                    marginTop: 6,
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    fontSize: 14,
                    color: '#0f172a',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    outline: 'none',
                    resize: 'vertical',
                    lineHeight: 1.6,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#2563EB';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.10)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
                  }}
                />
              </div>

              {/* Summary strip */}
              {selectedType && (
                <div style={{
                  marginTop: 24,
                  padding: '14px 18px',
                  borderRadius: 12,
                  background: selectedType.bg,
                  border: `1px solid ${selectedType.border}`,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <selectedType.icon style={{ width: 18, height: 18, color: selectedType.color, flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: '#0f172a', fontFamily: 'var(--font-inter)' }}>
                    Cotação para <span style={{ fontWeight: 600, color: selectedType.color }}>{selectedType.label}</span>{' '}
                    · Canal: <span style={{ fontWeight: 600 }}>
                      {{ whatsapp: 'WhatsApp', telefone: 'Telefone', email: 'E-mail' }[form.contactMethod]}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Navigation ───────────────────────────────────────────── */}
        <div style={{
          padding: '20px 32px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fafbfc',
        }}>
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 10,
                border: '1px solid #e2e8f0', background: '#fff',
                fontSize: 14, fontWeight: 600, color: '#475569',
                fontFamily: 'var(--font-sora)',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              <ChevronLeft style={{ width: 16, height: 16 }} />
              Voltar
            </button>
          ) : (
            <span />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !form.type}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 24px', borderRadius: 10,
                background: step === 1 && !form.type
                  ? '#e2e8f0'
                  : 'linear-gradient(135deg, #1a3470 0%, #2563EB 100%)',
                color: step === 1 && !form.type ? '#94a3b8' : '#fff',
                border: 'none',
                fontSize: 14, fontWeight: 600,
                fontFamily: 'var(--font-sora)',
                cursor: step === 1 && !form.type ? 'not-allowed' : 'pointer',
                boxShadow: step === 1 && !form.type
                  ? 'none'
                  : '0 4px 12px rgba(37,99,235,0.30)',
                transition: 'all 0.15s',
              }}
            >
              Continuar
              <ChevronRight style={{ width: 16, height: 16 }} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 28px', borderRadius: 10,
                background: 'linear-gradient(135deg, #1a3470 0%, #2563EB 100%)',
                color: '#fff', border: 'none',
                fontSize: 14, fontWeight: 600,
                fontFamily: 'var(--font-sora)',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37,99,235,0.30)',
              }}
            >
              <Check style={{ width: 16, height: 16 }} />
              Enviar solicitação
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
