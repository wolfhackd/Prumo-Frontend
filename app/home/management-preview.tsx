import { BrandMark } from "./icons";

const calendarAppointments = [
  {
    time: "09:00",
    name: "Mariana Costa",
    detail: "Corte feminino · 09:30 – 10:30",
    color: "rose",
  },
  {
    time: "10:00",
    name: "Rafael Lima",
    detail: "Barba completa · 10:15 – 11:00",
    color: "blue",
  },
  {
    time: "11:00",
    name: "Ana Souza",
    detail: "Coloração · 11:00 – 12:30",
    color: "amber",
  },
];

const dashboardStats = [
  {
    label: "AGENDAMENTOS HOJE",
    value: "18",
    detail: (
      <>
        <i>↑ 12%</i> vs. semana passada
      </>
    ),
    decoration: "▤",
    decorationClass: "",
  },
  {
    label: "PRÓXIMO HORÁRIO",
    value: "09:30",
    detail: "Mariana Costa · Corte",
    decoration: "◷",
    decorationClass: "stat-clock",
  },
  {
    label: "SERVIÇOS ATIVOS",
    value: "06",
    detail: "Disponíveis para agendamento",
    decoration: "✳",
    decorationClass: "stat-star",
  },
];

const sidebarItems = [
  { icon: "▦", label: "Visão geral", active: true },
  { icon: "▣", label: "Agendamentos", count: "4" },
  { icon: "◇", label: "Serviços" },
  { icon: "⌂", label: "Estabelecimento" },
];

export default function ManagementPreview() {
  return (
    <div className="management-preview">
      <aside className="preview-sidebar">
        <div className="sidebar-brand">
          <BrandMark />
          <strong>prumo</strong>
        </div>
        <span className="sidebar-label">ESPAÇO DE TRABALHO</span>
        <div className="sidebar-business">
          <span className="business-avatar-small">C</span>
          <span>
            <strong>Casa Amora</strong>
            <small>Meu estabelecimento</small>
          </span>
          <span className="sidebar-chevron">⌄</span>
        </div>
        <div className="sidebar-menu">
          {sidebarItems.map((item) => (
            <span
              className={`sidebar-menu-item${item.active ? " active" : ""}`}
              key={item.label}
            >
              <span className="menu-icon">{item.icon}</span>
              {item.label}
              {item.count && <i>{item.count}</i>}
            </span>
          ))}
        </div>
        <div className="sidebar-help">
          <span className="help-sparkle">✳</span>
          <strong>Seu negócio,</strong>
          <strong>do seu jeito.</strong>
          <small>Organize. Atenda. Cresça.</small>
        </div>
        <div className="sidebar-profile">
          <span className="profile-avatar">LM</span>
          <span>
            <strong>Luiza Martins</strong>
            <small>Proprietária</small>
          </span>
          <span className="profile-more">···</span>
        </div>
      </aside>

      <div className="preview-main">
        <div className="preview-topline">
          <span>
            Painel <span>/</span> Visão geral
          </span>
          <span className="preview-date">◷ &nbsp; Hoje, 12 de junho</span>
        </div>
        <div className="preview-title-row">
          <div>
            <h3>
              Bom dia, Luiza <span>✳</span>
            </h3>
            <p>Veja o que está acontecendo no seu espaço hoje.</p>
          </div>
          <span className="preview-action">＋ &nbsp; Novo agendamento</span>
        </div>
        <div className="preview-stats">
          {dashboardStats.map((stat) => (
            <div className="preview-stat" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.detail}</small>
              <span className={`stat-decoration ${stat.decorationClass}`}>
                {stat.decoration}
              </span>
            </div>
          ))}
        </div>
        <div className="preview-calendar">
          <div className="calendar-head">
            <div>
              <strong>Agenda de hoje</strong>
              <span>Quarta-feira, 12 de junho</span>
            </div>
            <span className="calendar-view">Dia⌄</span>
          </div>
          {calendarAppointments.map((appointment) => (
            <div className="calendar-row" key={appointment.name}>
              <time>{appointment.time}</time>
              <span className="calendar-line" />
              <span className={`calendar-event event-${appointment.color}`}>
                <strong>{appointment.name}</strong>
                <small>{appointment.detail}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
