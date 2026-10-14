"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  demoStorageKeys,
  isDemoEstablishment,
  isDemoAppointment,
  isDemoService,
  readDemoList,
  writeDemoList,
  type DemoAppointment,
  type DemoEstablishment,
  type DemoService,
} from "../demo-storage";

type Manager = {
  name: string;
  email: string;
};

type Establishment = DemoEstablishment;
type Service = DemoService;

type Section = "overview" | "establishments" | "services" | "appointments";
type AuthMode = "login" | "signup";

const sessionKey = "prumo-demo-session";
const workspaceKey = "prumo-demo-workspace";

const initialEstablishments: Establishment[] = [
  {
    id: "casa-amora",
    name: "Casa Amora",
    category: "Salão de beleza",
    city: "São Paulo, SP",
    address: "Rua Harmonia, 218 · Vila Madalena",
    active: true,
  },
  {
    id: "lume-estetica",
    name: "Lume Estética",
    category: "Estética e bem-estar",
    city: "São Paulo, SP",
    address: "Rua dos Pinheiros, 540 · Pinheiros",
    active: true,
  },
  {
    id: "barbearia-aurora",
    name: "Barbearia Aurora",
    category: "Barbearia",
    city: "São Paulo, SP",
    address: "Rua dos Pinheiros, 540 · Pinheiros",
    active: true,
  },
];

const initialServices: Service[] = [
  {
    id: "escova",
    establishmentId: "casa-amora",
    name: "Escova",
    category: "Cabelo",
    duration: 45,
    price: 65,
    active: true,
  },
  {
    id: "corte-feminino",
    establishmentId: "casa-amora",
    name: "Corte feminino",
    category: "Cabelo",
    duration: 60,
    price: 90,
    active: true,
  },
  {
    id: "coloracao",
    establishmentId: "casa-amora",
    name: "Coloração",
    category: "Cabelo",
    duration: 150,
    price: 220,
    active: true,
  },
  {
    id: "limpeza-de-pele",
    establishmentId: "lume-estetica",
    name: "Limpeza de pele",
    category: "Facial",
    duration: 75,
    price: 120,
    active: true,
  },
  {
    id: "hidratacao-capilar",
    establishmentId: "casa-amora",
    name: "Hidratação capilar",
    category: "Cabelo",
    duration: 60,
    price: 110,
    active: true,
  },
  {
    id: "design-de-sobrancelhas",
    establishmentId: "lume-estetica",
    name: "Design de sobrancelhas",
    category: "Facial",
    duration: 45,
    price: 65,
    active: true,
  },
  {
    id: "massagem-relaxante",
    establishmentId: "lume-estetica",
    name: "Massagem relaxante",
    category: "Corporal",
    duration: 60,
    price: 160,
    active: true,
  },
  {
    id: "peeling-facial",
    establishmentId: "lume-estetica",
    name: "Peeling facial",
    category: "Facial",
    duration: 90,
    price: 180,
    active: true,
  },
  {
    id: "corte-masculino",
    establishmentId: "barbearia-aurora",
    name: "Corte masculino",
    category: "Cabelo",
    duration: 45,
    price: 55,
    active: true,
  },
  {
    id: "barba-completa",
    establishmentId: "barbearia-aurora",
    name: "Barba completa",
    category: "Barba",
    duration: 30,
    price: 45,
    active: true,
  },
  {
    id: "corte-barba",
    establishmentId: "barbearia-aurora",
    name: "Corte + barba",
    category: "Barba e cabelo",
    duration: 60,
    price: 85,
    active: true,
  },
  {
    id: "acabamento",
    establishmentId: "barbearia-aurora",
    name: "Acabamento",
    category: "Cabelo",
    duration: 20,
    price: 30,
    active: true,
  },
];

const emptyEstablishment = {
  name: "",
  category: "",
  city: "",
  address: "",
};

const emptyService = {
  establishmentId: "",
  name: "",
  category: "",
  duration: "60",
  price: "",
};

function getDemoAppointments(): DemoAppointment[] {
  function getDate(daysFromNow: number) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + daysFromNow);

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  return [
    {
      id: "demo-appointment-casa-amora",
      businessInitials: "CA",
      businessName: "Casa Amora",
      establishmentId: "casa-amora",
      serviceName: "Escova",
      date: getDate(1),
      time: "10:30",
      customerName: "Marina Costa",
      contact: "marina@email.com",
      status: "scheduled",
    },
    {
      id: "demo-appointment-lume-estetica",
      businessInitials: "LE",
      businessName: "Lume Estética",
      establishmentId: "lume-estetica",
      serviceName: "Limpeza de pele",
      date: getDate(2),
      time: "14:00",
      customerName: "Camila Nunes",
      contact: "(11) 99999-0000",
      status: "scheduled",
    },
  ];
}

function formatAppointmentDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
    .format(new Date(year, month - 1, day, 12))
    .replace(".", "");
}

function formatAppointmentMonth(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(new Date(year, month - 1, day, 12))
    .replace(".", "");
}

function getAppointmentBusinessName(
  appointment: DemoAppointment,
  currentEstablishments: Establishment[],
) {
  if (appointment.businessName) {
    return appointment.businessName;
  }

  const matchedEstablishment = currentEstablishments.find((establishment) => {
    const initials = establishment.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toLocaleUpperCase("pt-BR");
    return initials === appointment.businessInitials;
  });

  return matchedEstablishment?.name ?? appointment.businessInitials;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <path
          d="M8 22.5 16 7l8 15.5"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 18h10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function Icon({
  name,
}: {
  name: "grid" | "store" | "sparkle" | "calendar" | "plus" | "logout";
}) {
  const paths = {
    grid: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </>
    ),
    store: (
      <>
        <path d="M4 10v10h16V10" />
        <path d="M3 9.5 5.3 4h13.4L21 9.5" />
        <path d="M3 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
        <path d="M9 20v-5h6v5" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9L12 3Z" />
        <path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="management-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

export default function ManagementPage() {
  const [manager, setManager] = useState<Manager | null>(null);
  const [ready, setReady] = useState(false);
  const [canPersist, setCanPersist] = useState(false);
  const [dataError, setDataError] = useState("");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [managerName, setManagerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [section, setSection] = useState<Section>("overview");
  const [establishments, setEstablishments] =
    useState<Establishment[]>(initialEstablishments);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [appointments, setAppointments] = useState<DemoAppointment[]>([]);
  const [workspaceId, setWorkspaceId] = useState("");
  const [establishmentDraft, setEstablishmentDraft] = useState(emptyEstablishment);
  const [serviceDraft, setServiceDraft] = useState(emptyService);
  const [editingEstablishment, setEditingEstablishment] = useState<string | null>(
    null,
  );
  const [editingService, setEditingService] = useState<string | null>(null);
  const [showEstablishmentForm, setShowEstablishmentForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const savedSession = window.sessionStorage.getItem(sessionKey);

        if (savedSession) {
          const parsedSession: unknown = JSON.parse(savedSession);

          if (
            typeof parsedSession === "object" &&
            parsedSession !== null &&
            "name" in parsedSession &&
            typeof parsedSession.name === "string" &&
            "email" in parsedSession &&
            typeof parsedSession.email === "string"
          ) {
            setManager({ name: parsedSession.name, email: parsedSession.email });
          }
        }

        const loadedEstablishments = readDemoList(
          demoStorageKeys.establishments,
          initialEstablishments,
          isDemoEstablishment,
        );
        setEstablishments(loadedEstablishments);
        setServices(
          readDemoList(demoStorageKeys.services, initialServices, isDemoService),
        );
        setAppointments(
          readDemoList(
            demoStorageKeys.appointments,
            getDemoAppointments(),
            isDemoAppointment,
          ),
        );
        const savedWorkspaceId = window.localStorage.getItem(workspaceKey);
        const initialWorkspaceId =
          savedWorkspaceId &&
          loadedEstablishments.some(
            (establishment) => establishment.id === savedWorkspaceId,
          )
            ? savedWorkspaceId
            : loadedEstablishments[0]?.id ?? "";
        setWorkspaceId(initialWorkspaceId);
        setCanPersist(true);
      } catch (error) {
        setDataError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os dados salvos neste navegador.",
        );
      } finally {
        setReady(true);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!ready || !canPersist) {
      return;
    }

    try {
      writeDemoList(demoStorageKeys.establishments, establishments);
      writeDemoList(demoStorageKeys.services, services);
      writeDemoList(demoStorageKeys.appointments, appointments);
      if (workspaceId) {
        window.localStorage.setItem(workspaceKey, workspaceId);
      } else {
        window.localStorage.removeItem(workspaceKey);
      }
      window.setTimeout(() => setDataError(""), 0);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar as alterações neste navegador.";
      window.setTimeout(() => setDataError(message), 0);
    }
  }, [appointments, canPersist, establishments, ready, services, workspaceId]);

  const sectionTitle = {
    overview: "Visão geral",
    establishments: "Estabelecimentos",
    services: "Serviços",
    appointments: "Agendamentos",
  }[section];

  const activeServices = useMemo(
    () => services.filter((service) => service.active),
    [services],
  );
  const scheduledAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status === "scheduled"),
    [appointments],
  );
  const selectedEstablishment =
    establishments.find((item) => item.id === workspaceId) ??
    establishments[0] ??
    null;
  const workspaceServices = selectedEstablishment
    ? services.filter(
        (service) => service.establishmentId === selectedEstablishment.id,
      )
    : [];
  const workspaceActiveServices = workspaceServices.filter(
    (service) => service.active,
  );
  const workspaceAppointments = selectedEstablishment
    ? scheduledAppointments.filter(
        (appointment) =>
          appointment.establishmentId === selectedEstablishment.id ||
          (!appointment.establishmentId &&
            (appointment.businessName === selectedEstablishment.name ||
              appointment.businessInitials ===
                selectedEstablishment.name
                  .trim()
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("")
                  .toLocaleUpperCase("pt-BR"))),
      )
    : [];

  function updateAppointmentStatus(
    id: string,
    status: DemoAppointment["status"],
  ) {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment,
      ),
    );
  }

  function removeAppointment(id: string) {
    setAppointments((current) =>
      current.filter((appointment) => appointment.id !== id),
    );
  }

  function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextManager = {
      name: authMode === "signup" ? managerName.trim() : email.split("@")[0],
      email: email.trim(),
    };

    window.sessionStorage.setItem(sessionKey, JSON.stringify(nextManager));
    setManager(nextManager);
  }

  function handleLogout() {
    window.sessionStorage.removeItem(sessionKey);
    setManager(null);
    setSection("overview");
  }

  function openNewEstablishment() {
    setEditingEstablishment(null);
    setEstablishmentDraft(emptyEstablishment);
    setShowEstablishmentForm(true);
    setSection("establishments");
  }

  function editEstablishment(establishment: Establishment) {
    setEditingEstablishment(establishment.id);
    setEstablishmentDraft({
      name: establishment.name,
      category: establishment.category,
      city: establishment.city,
      address: establishment.address,
    });
    setShowEstablishmentForm(true);
  }

  function saveEstablishment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingEstablishment) {
      setEstablishments((current) =>
        current.map((item) =>
          item.id === editingEstablishment
            ? { ...item, ...establishmentDraft }
            : item,
        ),
      );
    } else {
      const newEstablishment = {
        id: globalThis.crypto.randomUUID(),
        ...establishmentDraft,
        active: true,
      };
      setEstablishments((current) => [...current, newEstablishment]);
      setWorkspaceId(newEstablishment.id);
    }

    setShowEstablishmentForm(false);
  }

  function removeEstablishment(id: string) {
    if (workspaceId === id) {
      setWorkspaceId(establishments.find((item) => item.id !== id)?.id ?? "");
    }
    setEstablishments((current) => current.filter((item) => item.id !== id));
    setServices((current) =>
      current.filter((service) => service.establishmentId !== id),
    );
  }

  function toggleEstablishment(id: string) {
    setEstablishments((current) =>
      current.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    );
  }

  function openNewService() {
    setEditingService(null);
    setServiceDraft({
      ...emptyService,
      establishmentId: selectedEstablishment?.id ?? establishments[0]?.id ?? "",
    });
    setShowServiceForm(true);
    setSection("services");
  }

  function editService(service: Service) {
    setEditingService(service.id);
    setServiceDraft({
      establishmentId: service.establishmentId,
      name: service.name,
      category: service.category,
      duration: String(service.duration),
      price: String(service.price),
    });
    setShowServiceForm(true);
  }

  function saveService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const savedService = {
      establishmentId: serviceDraft.establishmentId,
      name: serviceDraft.name.trim(),
      category: serviceDraft.category.trim(),
      duration: Number(serviceDraft.duration),
      price: Number(serviceDraft.price.replace(",", ".")),
    };

    if (editingService) {
      setServices((current) =>
        current.map((item) =>
          item.id === editingService ? { ...item, ...savedService } : item,
        ),
      );
    } else {
      setServices((current) => [
        ...current,
        {
          id: globalThis.crypto.randomUUID(),
          ...savedService,
          active: true,
        },
      ]);
    }

    setShowServiceForm(false);
  }

  function toggleService(id: string) {
    setServices((current) =>
      current.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    );
  }

  function removeService(id: string) {
    setServices((current) => current.filter((item) => item.id !== id));
  }

  if (!ready) {
    return <main className="management-loading" aria-label="Carregando gestão" />;
  }

  if (!manager) {
    return (
      <main className="management-auth-page">
        <header className="management-auth-header">
          <Link className="brand" href="/" aria-label="Prumo — início">
            <BrandMark />
            <span>prumo</span>
          </Link>
          <Link className="management-back-link" href="/">
            Voltar ao início
          </Link>
        </header>
        <div className="management-auth-layout">
          <section className="management-auth-aside">
            <span className="management-auth-kicker">
              <span /> SEU NEGÓCIO, NO SEU RITMO
            </span>
            <h1>
              Tudo em ordem.
              <br />
              <em>Do seu jeito.</em>
            </h1>
            <p>
              Um espaço simples para cuidar dos seus estabelecimentos e deixar
              seus serviços prontos para receber agendamentos.
            </p>
            <div className="management-auth-perks">
              <span><Icon name="store" /> Seus espaços em um só lugar</span>
              <span><Icon name="sparkle" /> Serviços organizados com clareza</span>
            </div>
            <span className="management-auth-decoration" aria-hidden="true">✳</span>
          </section>

          <section className="management-auth-card">
            <span className="management-auth-card-kicker">ÁREA DO NEGÓCIO</span>
            <h2>{authMode === "login" ? "Que bom ter você por aqui." : "Vamos começar?"}</h2>
            <p>
              {authMode === "login"
                ? "Entre para continuar organizando a sua rotina."
                : "Crie seu acesso e prepare o seu espaço no Prumo."}
            </p>
            <div className="auth-tabs" role="tablist" aria-label="Acesso à conta">
              <button
                aria-selected={authMode === "login"}
                className={authMode === "login" ? "selected" : ""}
                onClick={() => setAuthMode("login")}
                role="tab"
                type="button"
              >
                Entrar
              </button>
              <button
                aria-selected={authMode === "signup"}
                className={authMode === "signup" ? "selected" : ""}
                onClick={() => setAuthMode("signup")}
                role="tab"
                type="button"
              >
                Criar cadastro
              </button>
            </div>
            <form className="management-auth-form" onSubmit={handleAuth}>
              {authMode === "signup" && (
                <label>
                  Seu nome
                  <input
                    autoComplete="name"
                    onChange={(event) => setManagerName(event.target.value)}
                    placeholder="Como podemos te chamar?"
                    required
                    value={managerName}
                  />
                </label>
              )}
              <label>
                E-mail
                <input
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@seunegocio.com.br"
                  required
                  type="email"
                  value={email}
                />
              </label>
              <label>
                Senha
                <input
                  autoComplete={authMode === "login" ? "current-password" : "new-password"}
                  minLength={8}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Pelo menos 8 caracteres"
                  required
                  type="password"
                  value={password}
                />
              </label>
              {authMode === "login" && (
                <button
                  className="auth-forgot"
                  onClick={() => setAuthMode("signup")}
                  type="button"
                >
                  Ainda não tem cadastro? <strong>Crie sua conta</strong>
                </button>
              )}
              <button className="management-submit-button" type="submit">
                {authMode === "login" ? "Entrar na minha conta" : "Criar minha conta"}
                <span aria-hidden="true">→</span>
              </button>
            </form>
            <p className="demo-notice">
              Demonstração local: os dados de acesso não são verificados por um
              servidor. Conecte uma autenticação segura antes de publicar.
            </p>
          </section>
        </div>
        <footer className="management-auth-footer">
          <span>© 2026 Prumo</span>
          <span>Feito para fazer acontecer.</span>
        </footer>
      </main>
    );
  }

  return (
    <main className="management-app">
      <aside className="management-sidebar">
        <Link className="brand management-brand" href="/" aria-label="Prumo — início">
          <BrandMark />
          <span>prumo</span>
        </Link>
        <span className="management-nav-label">ESPAÇO DE TRABALHO</span>
        <div className="management-workspace">
          <span className="workspace-avatar">
            {selectedEstablishment?.name.slice(0, 1) ?? "P"}
          </span>
          <label className="management-workspace-info">
            <span className="visually-hidden">
              Estabelecimento do espaço de trabalho
            </span>
            <select
              aria-label="Estabelecimento do espaço de trabalho"
              disabled={establishments.length === 0}
              onChange={(event) => setWorkspaceId(event.target.value)}
              value={selectedEstablishment?.id ?? ""}
            >
              {establishments.length === 0 ? (
                <option value="">Nenhum estabelecimento</option>
              ) : (
                establishments.map((establishment) => (
                  <option key={establishment.id} value={establishment.id}>
                    {establishment.name}
                  </option>
                ))
              )}
            </select>
            <small>
              {establishments.length}{" "}
              {establishments.length === 1 ? "espaço" : "espaços"} no negócio
            </small>
          </label>
          <span className="workspace-chevron">⌄</span>
        </div>
        <nav className="management-nav" aria-label="Gestão do negócio">
          <button
            className={section === "overview" ? "active" : ""}
            onClick={() => setSection("overview")}
            type="button"
          >
            <Icon name="grid" /> Visão geral
          </button>
          <button
            className={section === "establishments" ? "active" : ""}
            onClick={() => {
              setSection("establishments");
              setShowEstablishmentForm(false);
            }}
            type="button"
          >
            <Icon name="store" /> Estabelecimentos
            <span className="management-nav-count">{establishments.length}</span>
          </button>
          <button
            className={section === "services" ? "active" : ""}
            onClick={() => {
              setSection("services");
              setShowServiceForm(false);
            }}
            type="button"
          >
            <Icon name="sparkle" /> Serviços
            <span className="management-nav-count">{services.length}</span>
          </button>
          <button
            className={section === "appointments" ? "active" : ""}
            onClick={() => {
              setSection("appointments");
              setShowEstablishmentForm(false);
              setShowServiceForm(false);
            }}
            type="button"
          >
            <Icon name="calendar" /> Agendamentos
            <span className="management-nav-count">{scheduledAppointments.length}</span>
          </button>
        </nav>
        <div className="management-sidebar-note">
          <span aria-hidden="true">✳</span>
          <strong>Seu negócio,<br />do seu jeito.</strong>
          <small>Organize. Atenda. Cresça.</small>
        </div>
        <div className="management-profile">
          <span className="management-profile-avatar">
            {manager.name.slice(0, 2).toUpperCase()}
          </span>
          <span className="management-profile-info">
            <strong>{manager.name}</strong>
            <small>{manager.email}</small>
          </span>
          <button
            aria-label="Sair da conta"
            className="management-logout"
            onClick={handleLogout}
            title="Sair"
            type="button"
          >
            <Icon name="logout" />
          </button>
        </div>
      </aside>

      <section className="management-main">
        <header className="management-topbar">
          <div className="management-breadcrumb">
            <Link href="/">Prumo</Link><span>/</span><strong>{sectionTitle}</strong>
          </div>
          <Link className="management-view-site" href="/buscar">
            Ver página de agendamentos <span aria-hidden="true">↗</span>
          </Link>
        </header>

        <div className="management-content">
          {dataError && (
            <p className="management-storage-error" role="alert">
              {dataError} As alterações podem não ser salvas. Confira o
              armazenamento local do navegador.
            </p>
          )}
          {section === "overview" && (
            <>
              <div className="management-page-heading">
                <div>
                  <span className="management-overline">PANORAMA DO ESPAÇO</span>
                  <h1>{selectedEstablishment?.name ?? "Seu negócio"} <span aria-hidden="true">✳</span></h1>
                  <p>
                    Visão geral do estabelecimento selecionado no espaço de
                    trabalho.
                  </p>
                </div>
                <button className="management-primary-button" onClick={openNewEstablishment} type="button">
                  <Icon name="plus" /> Novo estabelecimento
                </button>
              </div>
              <div className="management-stats">
                <article>
                  <span>ESPAÇO</span>
                  <strong>{selectedEstablishment ? "01" : "00"}</strong>
                  <small>
                    {selectedEstablishment
                      ? selectedEstablishment.active
                        ? "Estabelecimento ativo"
                        : "Estabelecimento inativo"
                      : "Cadastre um estabelecimento"}
                  </small>
                  <i className="stat-symbol">⌂</i>
                </article>
                <article>
                  <span>SERVIÇOS</span>
                  <strong>{workspaceServices.length.toString().padStart(2, "0")}</strong>
                  <small>{workspaceActiveServices.length} ativos para agendamento</small>
                  <i className="stat-symbol stat-symbol-sparkle">✳</i>
                </article>
                <article>
                  <span>AGENDAMENTOS</span>
                  <strong>{workspaceAppointments.length.toString().padStart(2, "0")}</strong>
                  <small>horários em aberto neste espaço</small>
                  <i className="stat-symbol stat-symbol-sparkle">◷</i>
                </article>
              </div>
              <div className="management-overview-grid">
                <section className="management-panel overview-business-panel">
                  <div className="management-panel-heading">
                    <div>
                      <h2>Sobre o estabelecimento</h2>
                      <p>Informações do espaço de trabalho selecionado.</p>
                    </div>
                    <button
                      className="management-text-button"
                      onClick={() => setSection("establishments")}
                      type="button"
                    >
                      Gerenciar <span>→</span>
                    </button>
                  </div>
                  {selectedEstablishment ? (
                    <div className="overview-business-list">
                      <article>
                        <span className="establishment-monogram">
                          {selectedEstablishment.name.slice(0, 1)}
                        </span>
                        <span className="overview-business-info">
                          <strong>{selectedEstablishment.name}</strong>
                          <small>
                            {selectedEstablishment.category} ·{" "}
                            {selectedEstablishment.city}
                          </small>
                          <small>{selectedEstablishment.address}</small>
                        </span>
                        <span
                          className={`management-status ${selectedEstablishment.active ? "status-active" : "status-inactive"}`}
                        >
                          <i /> {selectedEstablishment.active ? "Ativo" : "Inativo"}
                        </span>
                      </article>
                    </div>
                  ) : (
                    <div className="management-empty-state">
                      <span>⌂</span><strong>Seu primeiro espaço começa aqui.</strong>
                      <button onClick={openNewEstablishment} type="button">Cadastrar estabelecimento</button>
                    </div>
                  )}
                </section>
                <section className="management-panel overview-services-panel">
                  <div className="management-panel-heading">
                    <div><h2>Serviços em destaque</h2><p>O que seus clientes podem agendar.</p></div>
                    <button className="management-text-button" onClick={() => setSection("services")} type="button">Ver todos <span>→</span></button>
                  </div>
                  {workspaceActiveServices.slice(0, 4).map((service) => (
                    <article className="overview-service-row" key={service.id}>
                      <span className="overview-service-icon"><Icon name="sparkle" /></span>
                      <span><strong>{service.name}</strong><small>{selectedEstablishment?.name ?? "Estabelecimento"}</small></span>
                      <strong className="overview-service-price">{formatPrice(service.price)}</strong>
                    </article>
                  ))}
                  {workspaceActiveServices.length === 0 && (
                    <div className="management-empty-state compact">
                      <strong>Nenhum serviço ativo neste espaço.</strong>
                      <button onClick={openNewService} type="button">Cadastrar serviço</button>
                    </div>
                  )}
                </section>
              </div>
              <section className="management-panel management-upcoming-panel">
                <div className="management-panel-heading">
                  <div>
                    <h2>Próximos agendamentos</h2>
                    <p>
                      Reservas de {selectedEstablishment?.name ?? "este espaço"}.
                    </p>
                  </div>
                  <button
                    className="management-text-button"
                    onClick={() => setSection("appointments")}
                    type="button"
                  >
                    Ver agenda <span>→</span>
                  </button>
                </div>
                {workspaceAppointments.length > 0 ? (
                  <div className="management-upcoming-list">
                    {[...workspaceAppointments]
                      .sort((first, second) =>
                        `${first.date} ${first.time}`.localeCompare(
                          `${second.date} ${second.time}`,
                        ),
                      )
                      .slice(0, 3)
                      .map((appointment) => (
                        <article key={appointment.id}>
                          <span className="management-upcoming-date">
                            <strong>{appointment.date.slice(8, 10)}</strong>
                            <small>{formatAppointmentMonth(appointment.date)}</small>
                          </span>
                          <span className="management-upcoming-info">
                            <strong>{appointment.customerName}</strong>
                            <small>
                              {appointment.time} · {appointment.serviceName} ·{" "}
                              {selectedEstablishment?.name ??
                                getAppointmentBusinessName(
                                  appointment,
                                  establishments,
                                )}
                            </small>
                          </span>
                        </article>
                      ))}
                  </div>
                ) : (
                  <div className="management-empty-state compact">
                    <strong>Nenhum agendamento em aberto neste espaço.</strong>
                    <button
                      onClick={() => setSection("appointments")}
                      type="button"
                    >
                      Abrir agenda
                    </button>
                  </div>
                )}
              </section>
              <section className="management-tip">
                <span>✳</span>
                <div><strong>Um bom começo faz diferença.</strong><p>Cadastre seus serviços com duração e valor para deixar tudo pronto para os agendamentos.</p></div>
                <button onClick={openNewService} type="button">Adicionar serviço <span>→</span></button>
              </section>
            </>
          )}

          {section === "establishments" && (
            <>
              <div className="management-page-heading">
                <div>
                  <span className="management-overline">O SEU NEGÓCIO, ORGANIZADO</span>
                  <h1>Estabelecimentos</h1>
                  <p>Gerencie os espaços onde você atende seus clientes.</p>
                </div>
                {!showEstablishmentForm && (
                  <button className="management-primary-button" onClick={openNewEstablishment} type="button">
                    <Icon name="plus" /> Novo estabelecimento
                  </button>
                )}
              </div>
              {showEstablishmentForm && (
                <form className="management-panel management-edit-form" onSubmit={saveEstablishment}>
                  <div className="management-panel-heading">
                    <div><h2>{editingEstablishment ? "Editar estabelecimento" : "Novo estabelecimento"}</h2><p>Preencha as informações principais do seu espaço.</p></div>
                    <button aria-label="Fechar formulário" className="management-close-button" onClick={() => setShowEstablishmentForm(false)} type="button">×</button>
                  </div>
                  <div className="management-form-grid">
                    <label>Nome do estabelecimento<input onChange={(event) => setEstablishmentDraft({ ...establishmentDraft, name: event.target.value })} placeholder="Ex.: Casa Amora" required value={establishmentDraft.name} /></label>
                    <label>Categoria<select onChange={(event) => setEstablishmentDraft({ ...establishmentDraft, category: event.target.value })} required value={establishmentDraft.category}><option value="">Selecione uma categoria</option><option>Salão de beleza</option><option>Barbearia</option><option>Estética e bem-estar</option><option>Saúde</option><option>Outro</option></select></label>
                    <label>Cidade<input onChange={(event) => setEstablishmentDraft({ ...establishmentDraft, city: event.target.value })} placeholder="Ex.: São Paulo, SP" required value={establishmentDraft.city} /></label>
                    <label>Endereço e bairro<input onChange={(event) => setEstablishmentDraft({ ...establishmentDraft, address: event.target.value })} placeholder="Rua, número · Bairro" required value={establishmentDraft.address} /></label>
                  </div>
                  <div className="management-form-actions">
                    <button className="management-cancel-button" onClick={() => setShowEstablishmentForm(false)} type="button">Cancelar</button>
                    <button className="management-primary-button" type="submit">{editingEstablishment ? "Salvar alterações" : "Cadastrar estabelecimento"}</button>
                  </div>
                </form>
              )}
              <section className="management-panel management-list-panel">
                <div className="management-panel-heading">
                  <div><h2>Todos os espaços</h2><p>{establishments.length} {establishments.length === 1 ? "estabelecimento cadastrado" : "estabelecimentos cadastrados"}</p></div>
                </div>
                {establishments.length > 0 ? (
                  <div className="management-table-wrap">
                    <table className="management-table">
                      <thead><tr><th>ESTABELECIMENTO</th><th>LOCALIZAÇÃO</th><th>SERVIÇOS</th><th>STATUS</th><th><span className="visually-hidden">Ações</span></th></tr></thead>
                      <tbody>{establishments.map((establishment) => (
                        <tr key={establishment.id}>
                          <td><span className="table-establishment"><span className="establishment-monogram">{establishment.name.slice(0, 1)}</span><span><strong>{establishment.name}</strong><small>{establishment.category}</small></span></span></td>
                          <td>{establishment.address}<small className="table-secondary">{establishment.city}</small></td>
                          <td>{services.filter((service) => service.establishmentId === establishment.id).length} {services.filter((service) => service.establishmentId === establishment.id).length === 1 ? "serviço" : "serviços"}</td>
                          <td><button className={`management-status status-toggle ${establishment.active ? "status-active" : "status-inactive"}`} onClick={() => toggleEstablishment(establishment.id)} type="button"><i />{establishment.active ? "Ativo" : "Inativo"}</button></td>
                          <td><div className="management-row-actions"><button onClick={() => editEstablishment(establishment)} type="button">Editar</button><button aria-label={`Excluir ${establishment.name}`} onClick={() => removeEstablishment(establishment.id)} type="button">Excluir</button></div></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                ) : (
                  <div className="management-empty-state"><span>⌂</span><strong>Nenhum estabelecimento cadastrado.</strong><button onClick={openNewEstablishment} type="button">Cadastrar estabelecimento</button></div>
                )}
              </section>
            </>
          )}

          {section === "services" && (
            <>
              <div className="management-page-heading">
                <div>
                  <span className="management-overline">O QUE VOCÊ OFERECE</span>
                  <h1>Serviços</h1>
                  <p>Defina os serviços, valores e duração de cada atendimento.</p>
                </div>
                {!showServiceForm && (
                  <button className="management-primary-button" disabled={establishments.length === 0} onClick={openNewService} type="button">
                    <Icon name="plus" /> Novo serviço
                  </button>
                )}

              </div>
              {showServiceForm && (
                <form className="management-panel management-edit-form" onSubmit={saveService}>
                  <div className="management-panel-heading">
                    <div><h2>{editingService ? "Editar serviço" : "Novo serviço"}</h2><p>Informe os detalhes que seus clientes precisam saber.</p></div>
                    <button aria-label="Fechar formulário" className="management-close-button" onClick={() => setShowServiceForm(false)} type="button">×</button>
                  </div>
                  <div className="management-form-grid service-form-grid">
                    <label>Nome do serviço<input onChange={(event) => setServiceDraft({ ...serviceDraft, name: event.target.value })} placeholder="Ex.: Corte feminino" required value={serviceDraft.name} /></label>
                    <label>Estabelecimento<select onChange={(event) => setServiceDraft({ ...serviceDraft, establishmentId: event.target.value })} required value={serviceDraft.establishmentId}><option value="">Selecione um espaço</option>{establishments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
                    <label>Categoria<input onChange={(event) => setServiceDraft({ ...serviceDraft, category: event.target.value })} placeholder="Ex.: Cabelo" required value={serviceDraft.category} /></label>
                    <label>Duração (minutos)<input min="5" onChange={(event) => setServiceDraft({ ...serviceDraft, duration: event.target.value })} required type="number" value={serviceDraft.duration} /></label>
                    <label>Valor (R$)<input min="0" onChange={(event) => setServiceDraft({ ...serviceDraft, price: event.target.value })} placeholder="0,00" required step="0.01" type="number" value={serviceDraft.price} /></label>
                  </div>
                  <div className="management-form-actions">
                    <button className="management-cancel-button" onClick={() => setShowServiceForm(false)} type="button">Cancelar</button>
                    <button className="management-primary-button" type="submit">{editingService ? "Salvar alterações" : "Cadastrar serviço"}</button>
                  </div>
                </form>
              )}
              <section className="management-panel management-list-panel">
                <div className="management-panel-heading">
                  <div><h2>Catálogo de serviços</h2><p>{services.length} {services.length === 1 ? "serviço cadastrado" : "serviços cadastrados"} em {establishments.length} {establishments.length === 1 ? "espaço" : "espaços"}</p></div>
                  <span className="management-result-count">{activeServices.length} ativos</span>
                </div>
                {services.length > 0 ? (
                  <div className="management-table-wrap">
                    <table className="management-table service-table">
                      <thead><tr><th>SERVIÇO</th><th>ESTABELECIMENTO</th><th>DURAÇÃO</th><th>VALOR</th><th>STATUS</th><th><span className="visually-hidden">Ações</span></th></tr></thead>
                      <tbody>{services.map((service) => (
                        <tr key={service.id}>
                          <td><span className="table-service"><span className="overview-service-icon"><Icon name="sparkle" /></span><span><strong>{service.name}</strong><small>{service.category}</small></span></span></td>
                          <td>{establishments.find((item) => item.id === service.establishmentId)?.name ?? "—"}</td>
                          <td>{service.duration} min</td>
                          <td><strong>{formatPrice(service.price)}</strong></td>
                          <td><button className={`management-status status-toggle ${service.active ? "status-active" : "status-inactive"}`} onClick={() => toggleService(service.id)} type="button"><i />{service.active ? "Ativo" : "Inativo"}</button></td>
                          <td><div className="management-row-actions"><button onClick={() => editService(service)} type="button">Editar</button><button aria-label={`Excluir ${service.name}`} onClick={() => removeService(service.id)} type="button">Excluir</button></div></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                ) : (
                  <div className="management-empty-state"><span>✳</span><strong>Nenhum serviço cadastrado ainda.</strong><button disabled={establishments.length === 0} onClick={openNewService} type="button">Cadastrar serviço</button></div>
                )}
              </section>
            </>
          )}

          {section === "appointments" && (
            <>
              <div className="management-page-heading">
                <div>
                  <span className="management-overline">A ROTINA DO SEU ESPAÇO</span>
                  <h1>Agendamentos</h1>
                  <p>
                    Acompanhe, conclua ou atualize os horários reservados pelos
                    clientes.
                  </p>
                </div>
                <span className="management-result-count">
                  {scheduledAppointments.length} em aberto
                </span>
              </div>
              <section className="management-panel management-list-panel">
                <div className="management-panel-heading">
                  <div>
                    <h2>Todos os agendamentos</h2>
                    <p>
                      Inclui horários em aberto, concluídos e cancelados.
                    </p>
                  </div>
                </div>
                {appointments.length > 0 ? (
                  <div className="management-table-wrap">
                    <table className="management-table appointment-table">
                      <thead>
                        <tr>
                          <th>CLIENTE</th>
                          <th>ESTABELECIMENTO E SERVIÇO</th>
                          <th>DATA E HORÁRIO</th>
                          <th>CONTATO</th>
                          <th>STATUS</th>
                          <th><span className="visually-hidden">Ações</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...appointments]
                          .sort((first, second) =>
                            `${first.date} ${first.time}`.localeCompare(
                              `${second.date} ${second.time}`,
                            ),
                          )
                          .map((appointment) => (
                            <tr key={appointment.id}>
                              <td><strong>{appointment.customerName}</strong></td>
                              <td>
                                <strong>
                                  {getAppointmentBusinessName(
                                    appointment,
                                    establishments,
                                  )}
                                </strong>
                                <small className="table-secondary">
                                  {appointment.serviceName}
                                </small>
                              </td>
                              <td>
                                {formatAppointmentDate(appointment.date)}
                                <small className="table-secondary">
                                  às {appointment.time}
                                </small>
                              </td>
                              <td>{appointment.contact}</td>
                              <td>
                                <select
                                  aria-label={`Status de ${appointment.customerName}`}
                                  className={`appointment-status status-${appointment.status}`}
                                  onChange={(event) => {
                                    const nextStatus = event.target.value;
                                    if (
                                      nextStatus === "scheduled" ||
                                      nextStatus === "completed" ||
                                      nextStatus === "cancelled"
                                    ) {
                                      updateAppointmentStatus(
                                        appointment.id,
                                        nextStatus,
                                      );
                                    }
                                  }}
                                  value={appointment.status}
                                >
                                  <option value="scheduled">Agendado</option>
                                  <option value="completed">Concluído</option>
                                  <option value="cancelled">Cancelado</option>
                                </select>
                              </td>
                              <td>
                                <div className="management-row-actions">
                                  <button
                                    aria-label={`Excluir agendamento de ${appointment.customerName}`}
                                    onClick={() => removeAppointment(appointment.id)}
                                    type="button"
                                  >
                                    Excluir
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="management-empty-state">
                    <span>◷</span>
                    <strong>Nenhum agendamento por enquanto.</strong>
                    <p>
                      Quando alguém reservar um horário pela página pública, ele
                      aparecerá aqui.
                    </p>
                    <Link className="management-text-button" href="/buscar">
                      Abrir página de agendamentos <span>→</span>
                    </Link>
                  </div>
                )}
              </section>
              <p className="management-demo-note">
                Demonstração local: estes dados ficam salvos neste navegador e
                não são enviados a um servidor.
              </p>
            </>
          )}
          <footer className="management-content-footer">
            <span>© 2026 Prumo</span><span>Um bom negócio começa com uma boa agenda.</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
