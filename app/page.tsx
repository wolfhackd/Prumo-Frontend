import Link from "next/link";
import EstablishmentSearch from "./establishment-search";

const appointments = [
  {
    initials: "MC",
    name: "Mariana Costa",
    service: "Corte feminino",
    time: "09:30",
    color: "rose",
  },
  {
    initials: "RL",
    name: "Rafael Lima",
    service: "Barba completa",
    time: "10:15",
    color: "blue",
  },
  {
    initials: "AS",
    name: "Ana Souza",
    service: "Coloração",
    time: "11:00",
    color: "amber",
  },
];

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M8 22.5 16 7l8 15.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 18h10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={diagonal ? "arrow-icon arrow-icon-diagonal" : "arrow-icon"}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M4 10h11M10 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="m5 10 3.2 3.2L15 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Prumo — início">
          <BrandMark />
          <span>prumo</span>
        </a>
        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#gestao">Para negócios</a>
          <a href="#clientes">Para clientes</a>
          <a href="#como-funciona">Como funciona</a>
        </nav>
        <a className="header-cta" href="#gestao">
          Conheça a plataforma <ArrowIcon diagonal />
        </a>
      </header>

      <main>
        <section className="hero section-wrap" id="inicio">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              A agenda do seu negócio, no lugar certo
            </div>
            <h1>
              Menos tempo
              <br />
              organizando.
              <br />
              <span>Mais tempo</span>
              <br />
              crescendo.
            </h1>
            <p className="hero-description">
              Chega de papel, mensagens perdidas e horários duplicados.
              Organize seus agendamentos e deixe seus clientes marcarem quando
              quiserem.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#gestao">
                Quero organizar meu negócio <ArrowIcon />
              </a>
              <Link className="text-link" href="/buscar">
                Quero agendar um serviço
              </Link>
            </div>
            <div className="hero-note">
              <span className="avatar-stack" aria-hidden="true">
                <span>J</span>
                <span>M</span>
                <span>A</span>
              </span>
              <span>Feito para quem cuida de cada detalhe.</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Prévia do painel de agendamentos">
            <div className="visual-orbit visual-orbit-one" />
            <div className="visual-orbit visual-orbit-two" />
            <div className="floating-note floating-note-top">
              <span className="floating-icon check-badge"><CheckIcon /></span>
              <span><strong>Agenda organizada</strong><small>Um horário por vez.</small></span>
            </div>
            <div className="dashboard-card hero-dashboard">
              <div className="dashboard-topbar">
                <div className="window-dots"><i /><i /><i /></div>
                <span>prumo <span className="topbar-divider">/</span> visão geral</span>
                <span className="topbar-avatar">L</span>
              </div>
              <div className="dashboard-content">
                <div className="dashboard-greeting">
                  <div>
                    <span className="dashboard-date">QUARTA-FEIRA, 12 DE JUNHO</span>
                    <h3>Bom dia, Luiza <span aria-hidden="true">✳</span></h3>
                  </div>
                  <span className="dashboard-period">Esta semana⌄</span>
                </div>
                <div className="metric-grid">
                  <div className="metric-card">
                    <span>Agendamentos hoje</span>
                    <strong>18</strong>
                    <small className="metric-positive">↑ 3 em relação a ontem</small>
                  </div>
                  <div className="metric-card">
                    <span>Horários ocupados</span>
                    <strong>82<small>%</small></strong>
                    <div className="metric-progress"><i /></div>
                  </div>
                </div>
                <div className="appointments-heading">
                  <strong>Próximos agendamentos</strong>
                  <span>Ver agenda <ArrowIcon diagonal /></span>
                </div>
                <div className="appointment-list">
                  {appointments.map((appointment) => (
                    <div className="appointment-row" key={appointment.initials}>
                      <span className={`person-avatar avatar-${appointment.color}`}>
                        {appointment.initials}
                      </span>
                      <span className="appointment-person">
                        <strong>{appointment.name}</strong>
                        <small>{appointment.service}</small>
                      </span>
                      <span className="appointment-time">{appointment.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="floating-note floating-note-bottom">
              <span className="floating-icon clock-badge">
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M10 6v4l2.5 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <span><strong>Você no controle</strong><small>Da agenda ao atendimento.</small></span>
            </div>
            <span className="visual-sparkle sparkle-one" aria-hidden="true">✳</span>
            <span className="visual-sparkle sparkle-two" aria-hidden="true">✳</span>
          </div>
        </section>

        <section className="benefit-strip" aria-label="Benefícios do Prumo">
          <div className="benefit-inner">
            <span><CheckIcon /> Sem horários duplicados</span>
            <span><CheckIcon /> Mais autonomia para seus clientes</span>
            <span><CheckIcon /> Cada estabelecimento no seu ritmo</span>
          </div>
        </section>

        <section className="management-section section-wrap" id="gestao">
          <div className="section-heading management-heading">
            <div>
              <span className="section-kicker"><span>01</span> PARA QUEM FAZ ACONTECER</span>
              <h2>Sua rotina merece<br />uma agenda à altura.</h2>
            </div>
            <div className="section-intro">
              <p>
                Cuide dos seus estabelecimentos, serviços e agendamentos em um
                só lugar. Você administra o seu negócio; a Prumo ajuda a deixar
                a rotina mais leve.
              </p>
              <a className="text-link text-link-dark" href="#como-funciona">
                Veja como funciona <ArrowIcon />
              </a>
            </div>
          </div>

          <div className="management-preview">
            <aside className="preview-sidebar">
              <div className="sidebar-brand"><BrandMark /><strong>prumo</strong></div>
              <span className="sidebar-label">ESPAÇO DE TRABALHO</span>
              <div className="sidebar-business">
                <span className="business-avatar-small">C</span>
                <span><strong>Casa Amora</strong><small>Meu estabelecimento</small></span>
                <span className="sidebar-chevron">⌄</span>
              </div>
              <div className="sidebar-menu">
                <span className="sidebar-menu-item active"><span className="menu-icon">▦</span> Visão geral</span>
                <span className="sidebar-menu-item"><span className="menu-icon">▣</span> Agendamentos <i>4</i></span>
                <span className="sidebar-menu-item"><span className="menu-icon">◇</span> Serviços</span>
                <span className="sidebar-menu-item"><span className="menu-icon">⌂</span> Estabelecimento</span>
              </div>
              <div className="sidebar-help">
                <span className="help-sparkle">✳</span>
                <strong>Seu negócio,</strong>
                <strong>do seu jeito.</strong>
                <small>Organize. Atenda. Cresça.</small>
              </div>
              <div className="sidebar-profile">
                <span className="profile-avatar">LM</span>
                <span><strong>Luiza Martins</strong><small>Proprietária</small></span>
                <span className="profile-more">···</span>
              </div>
            </aside>

            <div className="preview-main">
              <div className="preview-topline">
                <span>Painel <span>/</span> Visão geral</span>
                <span className="preview-date">◷ &nbsp; Hoje, 12 de junho</span>
              </div>
              <div className="preview-title-row">
                <div><h3>Bom dia, Luiza <span>✳</span></h3><p>Veja o que está acontecendo no seu espaço hoje.</p></div>
                <span className="preview-action">＋ &nbsp; Novo agendamento</span>
              </div>
              <div className="preview-stats">
                <div className="preview-stat"><span>AGENDAMENTOS HOJE</span><strong>18</strong><small><i>↑ 12%</i> vs. semana passada</small><span className="stat-decoration">▤</span></div>
                <div className="preview-stat"><span>PRÓXIMO HORÁRIO</span><strong>09:30</strong><small>Mariana Costa · Corte</small><span className="stat-decoration stat-clock">◷</span></div>
                <div className="preview-stat"><span>SERVIÇOS ATIVOS</span><strong>06</strong><small>Disponíveis para agendamento</small><span className="stat-decoration stat-star">✳</span></div>
              </div>
              <div className="preview-calendar">
                <div className="calendar-head">
                  <div><strong>Agenda de hoje</strong><span>Quarta-feira, 12 de junho</span></div>
                  <span className="calendar-view">Dia⌄</span>
                </div>
                <div className="calendar-row">
                  <time>09:00</time><span className="calendar-line" /><span className="calendar-event event-rose"><strong>Mariana Costa</strong><small>Corte feminino · 09:30 – 10:30</small></span>
                </div>
                <div className="calendar-row">
                  <time>10:00</time><span className="calendar-line" /><span className="calendar-event event-blue"><strong>Rafael Lima</strong><small>Barba completa · 10:15 – 11:00</small></span>
                </div>
                <div className="calendar-row">
                  <time>11:00</time><span className="calendar-line" /><span className="calendar-event event-amber"><strong>Ana Souza</strong><small>Coloração · 11:00 – 12:30</small></span>
                </div>
              </div>
            </div>
          </div>

          <div className="management-features">
            <article><span className="feature-number">01</span><div><h3>Seu espaço, suas regras</h3><p>Cadastre cada estabelecimento e mantenha as informações sempre organizadas.</p></div></article>
            <article><span className="feature-number">02</span><div><h3>Serviços bem definidos</h3><p>Apresente o que você oferece, com duração e valores para seus clientes.</p></div></article>
            <article><span className="feature-number">03</span><div><h3>Agenda sem conflito</h3><p>Acompanhe os horários marcados e organize o dia da sua equipe.</p></div></article>
          </div>
        </section>

        <section className="customer-section" id="clientes">
          <div className="customer-inner section-wrap">
            <div className="customer-copy">
              <span className="section-kicker"><span>02</span> PARA QUEM QUER SER BEM ATENDIDO</span>
              <h2>Seu próximo<br />horário começa<br /><span>com um clique.</span></h2>
              <p>
                Encontre um estabelecimento, escolha o serviço e veja as opções
                disponíveis. Sem precisar criar uma conta para marcar.
              </p>
              <ul className="customer-points">
                <li><span><CheckIcon /></span> Descubra lugares e serviços perto de você</li>
                <li><span><CheckIcon /></span> Escolha um horário que combina com seu dia</li>
                <li><span><CheckIcon /></span> Consulte seu agendamento com CPF ou e-mail</li>
              </ul>
              <Link className="button button-light" href="/buscar">
                Encontrar um serviço <ArrowIcon />
              </Link>
            </div>

            <div className="booking-search-anchor">
              <EstablishmentSearch />
            </div>
            <div className="customer-deco" aria-hidden="true">✳</div>
          </div>
        </section>

        <section className="steps-section section-wrap" id="como-funciona">
          <div className="steps-heading">
            <span className="section-kicker"><span>03</span> SIMPLES ASSIM</span>
            <h2>Um caminho mais leve,<br />do primeiro clique ao atendimento.</h2>
          </div>
          <div className="steps-grid">
            <article className="step-card">
              <span className="step-index">01 <i>↗</i></span>
              <div className="step-illustration step-illustration-one"><span className="step-window"><i /><i /><i /><b>✳</b><small>Seu estabelecimento</small><strong>Casa Amora</strong></span></div>
              <h3>Configure seu espaço</h3>
              <p>O proprietário cadastra seu estabelecimento e adiciona os serviços que oferece.</p>
            </article>
            <article className="step-card">
              <span className="step-index">02 <i>↗</i></span>
              <div className="step-illustration step-illustration-two"><span className="step-calendar"><b>JUNHO 2024</b><i>10&nbsp; 11&nbsp; 12&nbsp; 13&nbsp; 14</i><strong>09:30&nbsp;&nbsp; 10:15&nbsp;&nbsp; 11:00</strong><small>○&nbsp; ○&nbsp; ●</small></span></div>
              <h3>Seu cliente escolhe</h3>
              <p>Ele encontra o lugar, escolhe o serviço e marca um horário disponível.</p>
            </article>
            <article className="step-card">
              <span className="step-index">03 <i>↗</i></span>
              <div className="step-illustration step-illustration-three"><span className="step-confirm"><b><CheckIcon /></b><strong>Horário reservado!</strong><small>Quinta-feira · 10:15</small><i>Barbearia Aurora</i></span></div>
              <h3>Todo mundo fica em dia</h3>
              <p>O horário entra na agenda do negócio; o cliente consulta usando CPF ou e-mail.</p>
            </article>
          </div>
        </section>

        <section className="closing-section">
          <div className="closing-inner section-wrap">
            <div className="closing-flower" aria-hidden="true">✳</div>
            <span className="closing-kicker">UM NOVO RITMO PARA A SUA ROTINA</span>
            <h2>Chega de improvisar.<br /><span>Vem para o Prumo.</span></h2>
            <p>Mais organização para quem atende. Mais tranquilidade para quem agenda.</p>
            <div className="closing-actions">
              <a className="button button-light" href="#gestao">Quero organizar meu negócio <ArrowIcon /></a>
              <Link className="closing-link" href="/buscar">Estou procurando um horário <ArrowIcon /></Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#inicio"><BrandMark /><span>prumo</span></a>
        <span className="footer-tagline">Um bom negócio começa com uma boa agenda.</span>
        <span className="footer-copyright">© 2026 Prumo. Feito para fazer acontecer.</span>
      </footer>
    </>
  );
}
