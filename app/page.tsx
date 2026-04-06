'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const WA_LINK = 'https://wa.link/td61yl';
const WA_NUMBER = 'https://wa.me/5500000000000';

const insuranceTypes = ['Auto', 'Vida', 'Residencial', 'Empresarial'] as const;
type InsuranceType = (typeof insuranceTypes)[number];

const typeIcons: Record<InsuranceType, JSX.Element> = {
  Auto: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1h3.586a1 1 0 00.707-.293l2.414-2.414a1 1 0 00.293-.707V11l-3-4H9v4a1 1 0 001 1h1z" />
    </svg>
  ),
  Vida: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Residencial: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Empresarial: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
};

const faqItems = [
  {
    q: 'Como funciona a cotação?',
    a: 'Você preenche o formulário com seus dados e o tipo de seguro que precisa. Nossa equipe analisa seu perfil e entra em contato pelo WhatsApp com as melhores opções — explicadas de forma clara, sem jargão.',
  },
  {
    q: 'Quanto tempo leva para receber as opções?',
    a: 'Em média, nosso retorno acontece em até 6 horas úteis. Para seguros auto, frequentemente no mesmo dia. Você pode também acionar pelo WhatsApp e obter resposta mais rápida.',
  },
  {
    q: 'Preciso fechar logo após pedir a cotação?',
    a: 'Não. A cotação é gratuita e sem compromisso. Você tem todo o tempo para comparar, tirar dúvidas e decidir com calma. Nossa equipe não aplica pressão — queremos que você contrate com segurança.',
  },
  {
    q: 'Meus dados ficam seguros?',
    a: 'Sim. Seguimos a LGPD integralmente. Seus dados são usados exclusivamente para o retorno da sua cotação e não são compartilhados com terceiros sem seu consentimento.',
  },
  {
    q: 'Vocês ajudam em caso de sinistro?',
    a: 'Sim. Acompanhamos todo o processo junto com a seguradora. Você nos aciona pelo WhatsApp e orientamos sobre documentação, prazos e andamento — você não fica sozinho.',
  },
  {
    q: 'Posso falar com alguém antes de contratar?',
    a: 'Claro. Nossa equipe está disponível pelo WhatsApp para responder perguntas, explicar coberturas e te ajudar a escolher sem pressa. É exatamente para isso que existimos.',
  },
];

const seguradoras = [
  { src: '/seguradoras-logo/portologo.png', alt: 'Porto Seguro' },
  { src: '/seguradoras-logo/bradescologo.png', alt: 'Bradesco Seguros' },
  { src: '/seguradoras-logo/allianzlogo.png', alt: 'Allianz' },
  { src: '/seguradoras-logo/itau.png', alt: 'Itaú Seguros' },
  { src: '/seguradoras-logo/hdilogo.png', alt: 'HDI Seguros' },
  { src: '/seguradoras-logo/tokiologo.png', alt: 'Tokio Marine', className: 'logo-tokio' },
  { src: '/seguradoras-logo/azullogo.png', alt: 'Azul Seguros' },
  { src: '/seguradoras-logo/suhailogo.png', alt: 'Suhai Seguros' },
];

const CheckIcon = () => (
  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowRight = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const WaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export default function HomePage() {
  const [activeType, setActiveType] = useState<InsuranceType>('Auto');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      {/* ════════ NAV ════════ */}
      <header className="nav">
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo" aria-label="Asa Seguros">
              <img src="/brand_assets/asa_seguros_logo.svg" alt="Asa Seguros" />
            </Link>

            <nav>
              <ul className="nav-links">
                <li><a href="#como-funciona">Como Funciona</a></li>
                <li className={`nav-dropdown-wrap${dropdownOpen ? ' open' : ''}`} ref={dropdownRef}>
                  <button
                    className="nav-dropdown-trigger"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    Seguros
                    <svg className="nav-dropdown-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <div className="nav-dropdown" role="menu">
                    {['Seguro Auto', 'Seguro de Vida', 'Residencial', 'Empresarial', 'Viagem', 'Outro Seguro'].map((item) => (
                      <a key={item} href="#seguros" role="menuitem">{item}</a>
                    ))}
                  </div>
                </li>
                <li><a href="#avaliacoes">Avaliações</a></li>
                <li><a href="#duvidas">Dúvidas</a></li>
              </ul>
            </nav>

            <div className="nav-actions">
              <Link href="/area-do-cliente/login" className="nav-enter">Área do Cliente</Link>
              <a href="#cotacao" className="btn btn-primary nav-cta" style={{ fontSize: '13px', padding: '10px 20px' }}>
                Solicitar Cotação
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ════════ HERO ════════ */}
      <section className="hero" id="cotacao">
        <div className="hero-bg">
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M200 20 C 310 20, 380 90, 380 200 C 380 310, 310 380, 200 380 C 90 380, 20 310, 20 200 C 20 90, 90 20, 200 20 Z" stroke="#2563EB" strokeWidth="40" fill="none" />
            <path d="M40 260 Q 200 120, 360 260" stroke="#2563EB" strokeWidth="24" fill="none" strokeLinecap="round" />
          </svg>
          <div className="hero-bg-dot" style={{ width: '480px', height: '480px', top: '-120px', right: '-120px', background: 'radial-gradient(circle,rgba(37,99,235,.05),transparent 70%)' }} />
          <div className="hero-bg-dot" style={{ width: '360px', height: '360px', bottom: '-80px', left: '-80px', background: 'radial-gradient(circle,rgba(37,99,235,.04),transparent 70%)' }} />
        </div>

        <div className="container">
          <div className="hero-inner">
            {/* Left: copy */}
            <div>
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                <span>Cotação Simples e Atendimento Humano</span>
              </div>

              <h1 className="h1 hero-title">
                Seguro sob medida,<br />
                <em>sem complicação.</em>
              </h1>

              <p className="hero-sub">
                Compare opções com suporte de especialistas e encontre a cobertura ideal para o que importa no seu dia a dia.
              </p>

              <div className="hero-ctas">
                <a href="#cotacao" className="btn btn-primary" style={{ fontSize: '15px', padding: '14px 28px' }}>
                  Solicitar Cotação
                </a>
                <a href={WA_NUMBER} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '15px', padding: '14px 28px' }}>
                  <WaIcon />
                  Falar no WhatsApp
                </a>
              </div>

              <div className="hero-trust">
                {['Atendimento humano de verdade', 'Opções personalizadas para seu perfil', 'Apoio do começo ao sinistro'].map((text) => (
                  <div key={text} className="hero-trust-item">
                    <div className="trust-check"><CheckIcon /></div>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div>
              <div className="quote-card">
                <p className="qc-title">Receber opções de cotação</p>
                <p className="qc-sub">Grátis e sem compromisso. Leva menos de 2 minutos.</p>

                <label className="field-label">Tipo de seguro</label>
                <div className="type-row">
                  {insuranceTypes.map((type) => (
                    <button
                      key={type}
                      className={`type-opt${activeType === type ? ' active' : ''}`}
                      onClick={() => setActiveType(type)}
                    >
                      {typeIcons[type]}
                      {type}
                    </button>
                  ))}
                </div>

                <label className="field-label" htmlFor="f-name">Nome</label>
                <input id="f-name" className="field" type="text" placeholder="Como posso te chamar?" autoComplete="given-name" />

                <label className="field-label" htmlFor="f-wa">WhatsApp</label>
                <input id="f-wa" className="field" type="tel" placeholder="(00) 00000-0000" autoComplete="tel" />

                <label className="field-label" htmlFor="f-email">
                  E-mail <span className="field-optional">opcional</span>
                </label>
                <input id="f-email" className="field" type="email" placeholder="seu@email.com" autoComplete="email" style={{ marginBottom: '20px' }} />

                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '14px' }}>
                  Receber opções
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                <p className="qc-disclaimer">Sem spam. Seus dados são usados apenas para retorno da cotação.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ PARCEIROS ════════ */}
      <div className="partners">
        <div className="container">
          <p className="partners-label">Seguradoras com que trabalhamos</p>
        </div>
        <div className="partners-track-wrap">
          <div className="partners-track" aria-hidden="true">
            {[...seguradoras, ...seguradoras].map((logo, i) => (
              <img key={i} src={logo.src} alt={i < seguradoras.length ? logo.alt : ''} className={logo.className} />
            ))}
          </div>
        </div>
      </div>

      {/* ════════ CREDIBILITY STRIP ════════ */}
      <div className="cred">
        <div className="container">
          <div className="cred-inner">
            {[
              {
                value: '+500',
                label: 'Clientes Atendidos',
                icon: <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
              },
              {
                value: '4.9',
                label: 'Avaliação Média dos Clientes',
                icon: <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
              },
              {
                value: '< 6h',
                label: 'Tempo Médio de Resposta',
                icon: <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              },
              {
                value: '100%',
                label: 'Suporte Humano no Processo',
                icon: <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
              },
            ].map((item) => (
              <div key={item.value} className="cred-item">
                <div className="cred-ico">{item.icon}</div>
                <div className="cred-value">{item.value}</div>
                <div className="cred-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════ COMO FUNCIONA ════════ */}
      <section className="section" id="como-funciona">
        <div className="container">
          <div className="sec-head center">
            <span className="label">Como funciona</span>
            <h2 className="h2">Simples do começo ao fim</h2>
            <p>Você diz o que precisa. A gente compara as opções e acompanha todo o processo.</p>
          </div>

          <div className="steps-grid">
            {[
              {
                num: '01',
                title: 'Conte o que precisa',
                desc: 'Preencha seus dados e nos diga qual seguro faz sentido para o seu momento. Rápido e sem compromisso.',
                img: 'https://cdn.undraw.co/illustration/file-analysis_nbtc.svg',
              },
              {
                num: '02',
                title: 'Receba opções',
                desc: 'Buscamos alternativas com diferentes coberturas e te ajudamos a comparar com clareza, sem jargão.',
                img: 'https://cdn.undraw.co/illustration/work-chat_kw8x.svg',
              },
              {
                num: '03',
                title: 'Feche com apoio humano',
                desc: 'Você tira dúvidas, escolhe com segurança e conta com suporte também no pós-venda e no sinistro.',
                img: 'https://cdn.undraw.co/illustration/handshake-deal_nwk6.svg',
              },
            ].map((step) => (
              <div key={step.num} className="step-card">
                <div className="step-illus">
                  <img src={step.img} alt="" aria-hidden="true" loading="lazy" />
                </div>
                <div className="step-num">{step.num}</div>
                <h3 className="h3">{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ PRODUTOS ════════ */}
      <section className="section" style={{ background: 'var(--c50)' }} id="seguros">
        <div className="container">
          <div className="sec-head center">
            <span className="label">Nossos seguros</span>
            <h2 className="h2">Proteção para cada momento</h2>
            <p>Trabalhamos com soluções pensadas para diferentes perfis, rotinas e patrimônios.</p>
          </div>

          <div className="products-grid">
            {[
              {
                icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1h3.586a1 1 0 00.707-.293l2.414-2.414a1 1 0 00.293-.707V11l-3-4H9v4a1 1 0 001 1h1z" /></svg>,
                title: 'Seguro Auto',
                desc: 'Proteção para o seu veículo com opções adequadas ao seu uso e perfil. Colisão, furto, terceiros e assistência 24h.',
                link: '#cotacao',
                linkText: 'Solicitar cotação',
              },
              {
                icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
                title: 'Seguro de Vida',
                desc: 'Segurança financeira para você e para quem depende de você. Indenização, invalidez e assistência funeral.',
                link: '#cotacao',
                linkText: 'Solicitar cotação',
              },
              {
                icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
                title: 'Residencial',
                desc: 'Cobertura para o seu imóvel com tranquilidade no dia a dia. Incêndio, roubo, danos elétricos e muito mais.',
                link: '#cotacao',
                linkText: 'Solicitar cotação',
              },
              {
                icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                title: 'Empresarial',
                desc: 'Proteção para patrimônio, responsabilidade civil e continuidade do seu negócio. Soluções para micro e pequenas empresas.',
                link: '#cotacao',
                linkText: 'Solicitar cotação',
              },
              {
                icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                title: 'Viagem',
                desc: 'Cobertura médica, bagagem e cancelamento para viagens nacionais e internacionais. Sem burocracia na hora de acionar.',
                link: '#cotacao',
                linkText: 'Solicitar cotação',
              },
              {
                icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
                title: 'Outro seguro?',
                desc: 'Não encontrou o que procura? Nossa equipe encontra a cobertura certa para o seu perfil — seja lá qual for a necessidade.',
                link: WA_NUMBER,
                linkText: 'Falar com um especialista',
              },
            ].map((product) => (
              <div key={product.title} className="prod-card-main">
                <div className="prod-icon">{product.icon}</div>
                <h3 className="h3">{product.title}</h3>
                <p>{product.desc}</p>
                <a href={product.link} target={product.link.startsWith('http') ? '_blank' : undefined} rel={product.link.startsWith('http') ? 'noopener noreferrer' : undefined} className="btn-link">
                  {product.linkText} <ArrowRight />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ DIFERENCIAIS ════════ */}
      <section className="section diff-section">
        <div className="diff-blob diff-blob-1" />
        <div className="diff-blob diff-blob-2" />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="diff-inner">
            <div className="diff-copy">
              <div className="sec-head">
                <span className="label">Diferenciais</span>
                <h2 className="h2">Clareza, suporte humano e uma experiência sem atrito</h2>
                <p>Na Asa Seguros, a cotação não é só uma lista de preços. A gente ajuda você a comparar coberturas, entender diferenças e contratar com mais segurança.</p>
              </div>

              <div className="diff-list">
                {[
                  {
                    icon: <svg width="21" height="21" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                    title: 'Atendimento humano de verdade',
                    desc: 'Você fala com pessoas que ajudam a entender o cenário, e não só empurram opções.',
                  },
                  {
                    icon: <svg width="21" height="21" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                    title: 'Comparação com clareza',
                    desc: 'Explicamos o que muda entre as alternativas para você decidir com mais segurança.',
                  },
                  {
                    icon: <svg width="21" height="21" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
                    title: 'Recomendação personalizada',
                    desc: 'Cada cotação considera seu perfil, rotina e objetivo de proteção.',
                  },
                  {
                    icon: <svg width="21" height="21" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                    title: 'Suporte também no sinistro',
                    desc: 'A experiência não termina na contratação. Estamos com você quando mais importa.',
                  },
                ].map((item) => (
                  <div key={item.title} className="diff-item">
                    <div className="diff-icon">{item.icon}</div>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="diff-illus-wrap">
              <div className="diff-illus-ring diff-illus-ring-1" />
              <div className="diff-illus-ring diff-illus-ring-2" />
              <svg className="di-deco di-dots" width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
                <defs>
                  <pattern id="dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="rgba(37,99,235,.25)" />
                  </pattern>
                </defs>
                <rect width="96" height="96" fill="url(#dots)" />
              </svg>
              <svg className="di-deco di-orbit" width="340" height="340" viewBox="0 0 340 340" fill="none" aria-hidden="true">
                <circle cx="170" cy="170" r="168" stroke="rgba(37,99,235,.12)" strokeWidth="1.5" strokeDasharray="6 8" />
              </svg>
              <div className="di-deco di-sq di-sq-1" />
              <div className="di-deco di-sq di-sq-2" />
              <div className="di-deco di-diamond" />
              <div className="di-deco di-pill" />
              <img src="/undraw_puzzle-solved_qdjq.svg" alt="Solução encontrada" className="diff-illus-img" />
            </div>
          </div>
        </div>
      </section>

      {/* ════════ DEPOIMENTOS ════════ */}
      <section className="section" style={{ background: 'var(--c50)' }} id="avaliacoes">
        <div className="container">
          <div className="sec-head center">
            <span className="label">Avaliações</span>
            <h2 className="h2">O que nossos clientes dizem</h2>
          </div>

          <div className="test-track-wrap">
            <div className="test-track">
              {[
                { initials: 'AM', name: 'Ana M.', meta: 'Seguro Auto · São Paulo', quote: 'Consegui entender de forma simples as diferenças entre as opções e fechei com muito mais segurança.' },
                { initials: 'CS', name: 'Carlos S.', meta: 'Seguro Residencial · Campinas', quote: 'A equipe foi rápida, clara e me acompanhou em todo o processo. Recomendo sem hesitar.' },
                { initials: 'PL', name: 'Patricia L.', meta: 'Seguro de Vida · Belo Horizonte', quote: 'O atendimento foi humano de verdade. Não fiquei perdido em nenhuma etapa. Simples assim.' },
                { initials: 'RF', name: 'Ricardo F.', meta: 'Seguro Auto · Ribeirão Preto', quote: 'Renovei meu seguro auto pela terceira vez com a Asa. Sempre recebo boas opções e atendimento de qualidade.' },
                { initials: 'JC', name: 'Juliana C.', meta: 'Seguro Residencial · Santos', quote: 'Precisei acionar o seguro e fui atendida com muita agilidade. A equipe ficou ao meu lado do início ao fim.' },
                { initials: 'MR', name: 'Marcos R.', meta: 'Seguro Empresarial · Guarulhos', quote: 'Me explicaram cada cobertura com paciência. Nunca me senti pressionado a fechar nada. Isso faz toda a diferença.' },
                { initials: 'FS', name: 'Fernanda S.', meta: 'Seguro de Vida · Curitiba', quote: 'Contratei seguro de vida pela primeira vez e fui surpreendida pelo quanto o processo foi tranquilo e bem explicado.' },
                { initials: 'GT', name: 'Gabriel T.', meta: 'Seguro Auto · Porto Alegre', quote: 'Consegui um valor bem melhor do que tinha antes, com cobertura maior. Vale muito falar com eles antes de renovar.' },
              ].flatMap((t, i, arr) => [t, { ...t, key2: true }]).map((t, i) => (
                <div key={i} className="test-card">
                  <div className="test-stars">★★★★★</div>
                  <blockquote>"{t.quote}"</blockquote>
                  <div className="reviewer">
                    <div className="reviewer-av">{t.initials}</div>
                    <div>
                      <div className="reviewer-name">{t.name}</div>
                      <div className="reviewer-meta">{t.meta}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section className="section" id="duvidas">
        <div className="container">
          <div className="sec-head center">
            <span className="label">Perguntas frequentes</span>
            <h2 className="h2">Suas dúvidas, respondidas</h2>
          </div>

          <div className="faq-wrap">
            {faqItems.map((item, index) => (
              <div key={index} className="faq-item">
                <button
                  className="faq-q"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  {item.q}
                  <span className={`faq-ico${openFaq === index ? ' open' : ''}`}>
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div className="faq-body" style={{ maxHeight: openFaq === index ? '400px' : '0px' }}>
                  <div className="faq-a">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA FINAL ════════ */}
      <section style={{ padding: '0 0 96px' }}>
        <div className="container">
          <div className="cta-banner">
            <h2 className="h2">Pronto para proteger o que importa?</h2>
            <p>Receba uma cotação com atendimento humano e opções alinhadas ao seu perfil.</p>
            <div className="cta-btns">
              <a href="#cotacao" className="btn btn-primary" style={{ fontSize: '15px', padding: '14px 28px' }}>
                Solicitar cotação
              </a>
              <a href={WA_NUMBER} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '15px', padding: '14px 28px' }}>
                <WaIcon />
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src="/brand_assets/asa_seguros_logo_white_transparent.png" alt="Asa Seguros" />
              <p>A Asa Seguros conecta você às opções mais adequadas para o seu perfil, com atendimento claro, suporte humano e uma experiência mais simples do começo ao fim.</p>
            </div>

            <div className="footer-col">
              <h4>Links</h4>
              <ul>
                <li><a href="#como-funciona">Como funciona</a></li>
                <li><a href="#seguros">Seguros</a></li>
                <li><a href="#duvidas">FAQ</a></li>
                <li><Link href="/area-do-cliente/login">Área do cliente</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Contato</h4>
              <ul>
                <li><a href={WA_NUMBER} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
                <li><a href="mailto:contato@asaseguros.com.br">E-mail</a></li>
                <li><a href="#">Instagram</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-legal">
              Asa Seguros Corretora Ltda · CNPJ 00.000.000/0001-00 · Registro SUSEP n.º 000000 · São Paulo, SP<br />
              Somos corretora. Quem emite a apólice é a seguradora escolhida pelo cliente.
            </p>
            <div className="footer-legal-links">
              <a href="#">Privacidade</a>
              <a href="#">Termos de uso</a>
              <a href="#">LGPD</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ════════ MOBILE STICKY ════════ */}
      <div className="m-sticky">
        <a href="#cotacao" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '13px' }}>
          Solicitar cotação grátis
        </a>
      </div>

      {/* ════════ WHATSAPP FLOAT ════════ */}
      <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-float" aria-label="Fale conosco pelo WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12.004 2C6.477 2 2 6.477 2 12.004a9.955 9.955 0 001.395 5.116L2 22l5.03-1.374A9.953 9.953 0 0012.004 22C17.531 22 22 17.523 22 12.004 22 6.477 17.531 2 12.004 2zm0 18.15a8.294 8.294 0 01-4.217-1.15l-.302-.18-3.134.856.844-3.077-.196-.315A8.309 8.309 0 013.853 12c0-4.495 3.656-8.15 8.15-8.15 4.496 0 8.15 3.655 8.15 8.15 0 4.496-3.654 8.15-8.15 8.15z" />
        </svg>
        <span className="wa-label">Fale conosco</span>
      </a>
    </>
  );
}
