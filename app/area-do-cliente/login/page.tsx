'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock auth — redirect to dashboard after short delay
    setTimeout(() => router.push('/dashboard'), 800);
  };

  return (
    <>
      <style>{`
        /* ── Login page tokens (uses main site palette) ── */
        .login-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: var(--font-inter, 'Inter', sans-serif);
        }
        @media (max-width: 900px) {
          .login-root { grid-template-columns: 1fr; }
          .login-brand { display: none; }
        }

        /* ── Brand panel ── */
        .login-brand {
          background: var(--asa-deep, #1e3a8a);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
        }
        .login-brand::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 80% 10%, rgba(37, 99, 235, 0.45) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 20% 90%, rgba(246, 168, 0, 0.12) 0%, transparent 60%);
        }
        .login-brand::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.025'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .brand-top {
          position: relative;
          z-index: 1;
        }
        .brand-logo {
          height: 48px;
          width: auto;
          display: block;
        }

        .brand-center {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 0;
        }
        .brand-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px;
          padding: 5px 14px 5px 10px;
          margin-bottom: 28px;
          width: fit-content;
        }
        .brand-eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--asa, #2563EB);
          flex-shrink: 0;
        }
        .brand-eyebrow span {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.03em;
        }
        .brand-headline {
          font-family: var(--font-sora, 'Sora', sans-serif);
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #ffffff;
          margin-bottom: 20px;
        }
        .brand-headline em {
          font-style: normal;
          color: var(--asa-mist, #dbeafe);
        }
        .brand-sub {
          font-size: 15px;
          line-height: 1.7;
          color: rgba(255,255,255,0.55);
          max-width: 340px;
          margin-bottom: 40px;
        }

        .brand-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .brand-feature {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .brand-feature-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: var(--asa-mist, #dbeafe);
        }
        .brand-feature-text strong {
          display: block;
          font-size: 13.5px;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          margin-bottom: 2px;
        }
        .brand-feature-text span {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          line-height: 1.5;
        }

        .brand-bottom {
          position: relative;
          z-index: 1;
        }
        .brand-testimonial {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 20px 22px;
        }
        .brand-testimonial blockquote {
          font-size: 13px;
          font-style: italic;
          color: rgba(255,255,255,0.6);
          line-height: 1.65;
          margin-bottom: 14px;
        }
        .brand-testimonial-author {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .brand-testimonial-av {
          width: 30px; height: 30px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-sora, 'Sora', sans-serif);
          font-size: 10px; font-weight: 700;
          color: rgba(255,255,255,0.8);
          flex-shrink: 0;
        }
        .brand-testimonial-name {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
        }
        .brand-testimonial-role {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
        }
        .brand-stars { color: var(--solar, #F6A800); font-size: 11px; letter-spacing: 1px; margin-bottom: 10px; }

        /* ── Form panel ── */
        .login-form-panel {
          background: var(--c50, #f8fafc);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
          position: relative;
        }
        .login-form-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(to right, var(--asa-deep, #1e3a8a), var(--asa, #2563EB));
        }
        @media (max-width: 900px) {
          .login-form-panel::before { display: none; }
        }

        .login-form-inner {
          width: 100%;
          max-width: 400px;
        }

        .login-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--c600, #475569);
          margin-bottom: 40px;
          transition: color 0.15s, gap 0.15s;
          text-decoration: none;
        }
        .login-back:hover { color: var(--asa, #2563EB); gap: 9px; }

        .login-mobile-logo {
          display: none;
          height: 40px;
          width: auto;
          margin-bottom: 32px;
        }
        @media (max-width: 900px) {
          .login-mobile-logo { display: block; }
          .login-back { margin-bottom: 24px; }
        }

        .login-eyebrow {
          font-family: var(--font-sora, 'Sora', sans-serif);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--asa, #2563EB);
          margin-bottom: 10px;
        }
        .login-title {
          font-family: var(--font-sora, 'Sora', sans-serif);
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: var(--c900, #0f172a);
          line-height: 1.15;
          margin-bottom: 8px;
        }
        .login-subtitle {
          font-size: 14px;
          color: var(--c600, #475569);
          line-height: 1.6;
          margin-bottom: 36px;
        }

        .login-field-wrap {
          margin-bottom: 16px;
          position: relative;
        }
        .login-label {
          display: block;
          font-family: var(--font-sora, 'Sora', sans-serif);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--c500, #64748b);
          margin-bottom: 7px;
        }
        .login-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid var(--c200, #e2e8f0);
          border-radius: 12px;
          font-family: var(--font-inter, 'Inter', sans-serif);
          font-size: 14px;
          color: var(--c900, #0f172a);
          background: var(--white, #ffffff);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          appearance: none;
          -webkit-appearance: none;
        }
        .login-input::placeholder { color: #a0aec0; }
        .login-input:focus {
          border-color: var(--asa, #2563EB);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .login-input-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          margin-top: 12px;
          color: var(--c500, #64748b);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .login-input-icon:hover { color: var(--asa, #2563EB); }
        .login-input.has-icon { padding-right: 44px; }

        .login-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          margin-top: -4px;
        }
        .login-checkbox-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .login-checkbox {
          width: 16px; height: 16px;
          border: 1.5px solid var(--c200, #e2e8f0);
          border-radius: 4px;
          background: white;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          flex-shrink: 0;
          position: relative;
          transition: border-color 0.15s, background 0.15s;
        }
        .login-checkbox:checked {
          background: var(--asa, #2563EB);
          border-color: var(--asa, #2563EB);
        }
        .login-checkbox:checked::after {
          content: '';
          position: absolute;
          left: 4px; top: 1.5px;
          width: 5px; height: 8px;
          border: 2px solid white;
          border-top: none; border-left: none;
          transform: rotate(45deg);
        }
        .login-checkbox-label {
          font-size: 13px;
          color: var(--c600, #475569);
          user-select: none;
        }
        .login-forgot {
          font-size: 13px;
          font-weight: 500;
          color: var(--asa, #2563EB);
          text-decoration: none;
          transition: color 0.15s;
        }
        .login-forgot:hover { color: var(--asa-deep, #1e3a8a); }

        .login-btn {
          width: 100%;
          padding: 14px 24px;
          background: var(--asa, #2563EB);
          color: #ffffff;
          border: none;
          border-radius: var(--r-xl, 20px);
          font-family: var(--font-sora, 'Sora', sans-serif);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition:
            background 0.15s,
            transform 0.18s cubic-bezier(.34, 1.56, .64, 1),
            box-shadow 0.18s ease;
          box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3), 0 4px 12px rgba(37, 99, 235, 0.2);
          margin-bottom: 24px;
        }
        .login-btn:hover {
          background: var(--asa-deep, #1e3a8a);
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(30, 58, 138, 0.35), 0 8px 20px rgba(30, 58, 138, 0.25);
        }
        .login-btn:active { transform: scale(0.97); }
        .login-btn:focus-visible { outline: 3px solid var(--asa-mist, #dbeafe); outline-offset: 2px; }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .login-divider-line {
          flex: 1;
          height: 1px;
          background: var(--c200, #e2e8f0);
        }
        .login-divider-text {
          font-size: 12px;
          color: var(--c500, #64748b);
          white-space: nowrap;
        }

        .login-register {
          text-align: center;
          font-size: 13px;
          color: var(--c600, #475569);
          line-height: 1.5;
        }
        .login-register a {
          color: var(--asa, #2563EB);
          font-weight: 600;
          text-decoration: none;
          transition: color 0.15s;
        }
        .login-register a:hover { color: var(--asa-deep, #1e3a8a); }

        .login-legal {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid var(--c200, #e2e8f0);
          font-size: 11px;
          color: var(--c500, #64748b);
          line-height: 1.6;
          text-align: center;
        }
        .login-legal a {
          color: var(--c600, #475569);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .login-legal a:hover { color: var(--asa, #2563EB); }

        /* ── Security badge ── */
        .login-secure {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 20px;
          font-size: 12px;
          color: var(--c500, #64748b);
        }
        .login-secure svg { color: var(--asa, #2563EB); }
      `}</style>

      <div className="login-root">
        {/* ════════ Brand Panel ════════ */}
        <div className="login-brand">
          <div className="brand-top">
            <img
              src="/brand_assets/asa_seguros_logo_white_transparent.png"
              alt="Asa Seguros"
              className="brand-logo"
            />
          </div>

          <div className="brand-center">
            <div className="brand-eyebrow">
              <span className="brand-eyebrow-dot" />
              <span>Área exclusiva para clientes</span>
            </div>

            <h1 className="brand-headline">
              Tudo sobre o seu<br />
              <em>seguro em um só lugar.</em>
            </h1>

            <p className="brand-sub">
              Acesse apólices, acompanhe renovações, abra chamados e fale com seu corretor — direto pelo portal.
            </p>

            <div className="brand-features">
              {[
                {
                  icon: (
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ),
                  title: 'Apólices e documentos',
                  desc: 'Acesse e baixe todos seus documentos de cobertura.',
                },
                {
                  icon: (
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'Renovações e vencimentos',
                  desc: 'Alertas automáticos para você nunca ficar desprotegido.',
                },
                {
                  icon: (
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  ),
                  title: 'Fale com seu corretor',
                  desc: 'Atendimento humano direto pelo portal, sem filas.',
                },
              ].map((f) => (
                <div key={f.title} className="brand-feature">
                  <div className="brand-feature-icon">{f.icon}</div>
                  <div className="brand-feature-text">
                    <strong>{f.title}</strong>
                    <span>{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="brand-bottom">
            <div className="brand-testimonial">
              <div className="brand-stars">★★★★★</div>
              <blockquote>
                "O portal da Asa Seguros é incrivelmente simples. Encontro tudo que preciso em segundos e meu corretor responde rápido quando preciso."
              </blockquote>
              <div className="brand-testimonial-author">
                <div className="brand-testimonial-av">RF</div>
                <div>
                  <div className="brand-testimonial-name">Ricardo F.</div>
                  <div className="brand-testimonial-role">Cliente há 3 anos · Seguro Auto</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════ Form Panel ════════ */}
        <div className="login-form-panel">
          <div className="login-form-inner">
            <Link href="/" className="login-back">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Voltar ao site
            </Link>

            <img
              src="/brand_assets/asa_seguros_logo.svg"
              alt="Asa Seguros"
              className="login-mobile-logo"
            />

            <p className="login-eyebrow">Área do Cliente</p>
            <h2 className="login-title">Bem-vindo de volta</h2>
            <p className="login-subtitle">
              Acesse sua conta para ver suas apólices, documentos e acompanhar seu atendimento.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="login-field-wrap">
                <label className="login-label" htmlFor="login-email">
                  E-mail ou CPF
                </label>
                <input
                  id="login-email"
                  className="login-input"
                  type="text"
                  placeholder="seu@email.com ou 000.000.000-00"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-field-wrap">
                <label className="login-label" htmlFor="login-password">
                  Senha
                </label>
                <input
                  id="login-password"
                  className={`login-input has-icon`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="login-input-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="login-row">
                <label className="login-checkbox-wrap">
                  <input
                    type="checkbox"
                    className="login-checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span className="login-checkbox-label">Lembrar de mim</span>
                </label>
                <a href="#" className="login-forgot">Esqueceu a senha?</a>
              </div>

              <button type="submit" className="login-btn" disabled={loading} style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>
                {loading ? 'Entrando...' : 'Entrar na minha conta'}
                {!loading && (
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </button>
            </form>

            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">Novo por aqui?</span>
              <div className="login-divider-line" />
            </div>

            <p className="login-register">
              Ainda não é cliente?{' '}
              <a href="#cotacao">Solicite uma cotação gratuita</a>
              {' '}e nossa equipe criará sua conta após a contratação.
            </p>

            <div className="login-secure">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Conexão segura com criptografia SSL
            </div>

            <div className="login-legal">
              Ao acessar, você concorda com nossa{' '}
              <a href="#">Política de Privacidade</a> e{' '}
              <a href="#">Termos de Uso</a>.<br />
              Em conformidade com a LGPD · Asa Seguros Corretora Ltda
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
