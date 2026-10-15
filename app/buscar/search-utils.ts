import {
  businesses,
  normalizeSearchText,
  type Business,
  type BusinessCategory,
} from "../establishments";
import type {
  DemoAppointment,
  DemoEstablishment,
  DemoService,
} from "../demo-storage";

export type EstablishmentResponse = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  website: string | null;
  location: string | null;
  ownerId: string;
  category?: string | null;
  services: {
    id?: string;
    name: string;
    price?: number | string | null;
    duration?: number | string | null;
    active?: boolean;
  }[];
  businessHours: unknown[];
};

export type SortOrder = "relevance" | "rating";

export type BookingDay = {
  value: string;
  weekday: string;
  day: string;
  month: string;
};

export type BookingService = {
  businessInitials: string;
  serviceName: string;
};

export type Appointment = DemoAppointment;

export const appointmentTimes = [
  "09:00",
  "10:30",
  "11:30",
  "13:30",
  "15:00",
  "16:30",
];

export function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDuration(value: number) {
  if (value < 60) {
    return `${value} min`;
  }

  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes}`;
}

function createInitials(name: string) {
  const words = name.trim().split(/\s+/);

  if (words.length > 1) {
    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toLocaleUpperCase("pt-BR");
  }

  return name.slice(0, 2).toLocaleUpperCase("pt-BR");
}

function getCategoryFilter(
  category: string | null | undefined,
): Exclude<BusinessCategory, "Todos"> | undefined {
  const categoryText = normalizeSearchText(category ?? "");

  if (categoryText.includes("barbearia")) {
    return "Barbearia";
  }
  if (categoryText.includes("beleza") || categoryText.includes("salao")) {
    return "Beleza";
  }
  if (categoryText) {
    return "Bem-estar";
  }
  return undefined;
}

export function createApiBusinessDirectory(
  establishments: EstablishmentResponse[],
): Business[] {
  const tones = ["peach", "sage", "lilac"];

  return establishments.map((establishment, index) => {
    const services = establishment.services
      .filter((service) => service.active !== false)
      .map((service) => {
        const numericPrice = Number(service.price);
        const numericDuration = Number(service.duration);

        return {
          name: service.name,
          price:
            service.price !== null &&
            service.price !== undefined &&
            Number.isFinite(numericPrice)
              ? formatPrice(numericPrice)
              : "—",
          duration:
            service.duration !== null &&
            service.duration !== undefined &&
            Number.isFinite(numericDuration)
              ? formatDuration(numericDuration)
              : "",
        };
      });
    const highlightedService = services[0];
    const location = establishment.location?.trim() || "Localização não informada";
    const category = establishment.category?.trim() || "Estabelecimento";

    return {
      establishmentId: establishment.id,
      website: establishment.website,
      initials: createInitials(establishment.name),
      name: establishment.name,
      category,
      categoryFilter: getCategoryFilter(establishment.category),
      detail: location,
      neighborhood: location,
      rating: "5/5",
      numericRating: 5,
      service: highlightedService?.name ?? "Sem serviços cadastrados",
      price: highlightedService?.price ?? "—",
      duration: highlightedService?.duration ?? "",
      services,
      tone: tones[index % tones.length],
    };
  });
}

export function createBusinessDirectory(
  establishments: DemoEstablishment[],
  services: DemoService[],
): Business[] {
  const tones = ["peach", "sage", "lilac"];

  return establishments
    .filter((establishment) => establishment.active)
    .map((establishment, index) => {
      const activeServices = services.filter(
        (service) =>
          service.establishmentId === establishment.id && service.active,
      );
      const highlightedService = activeServices[0];
      const categoryFilter =
        getCategoryFilter(establishment.category) ?? "Bem-estar";
      const matchingExample = businesses.find(
        (business) =>
          normalizeSearchText(business.name) ===
          normalizeSearchText(establishment.name),
      );
      const neighborhood =
        establishment.address.split("·").at(-1)?.trim() ||
        establishment.city.split(",")[0].trim();
      const city = establishment.city.split(",")[0].trim();

      return {
        initials: createInitials(establishment.name),
        name: establishment.name,
        category: establishment.category,
        categoryFilter,
        detail: `${neighborhood} · ${city}`,
        neighborhood,
        rating: matchingExample?.rating ?? "5,0",
        numericRating: matchingExample?.numericRating ?? 5,
        service: highlightedService?.name ?? "Sem serviços ativos",
        price: highlightedService
          ? formatPrice(highlightedService.price)
          : "—",
        duration: highlightedService
          ? formatDuration(highlightedService.duration)
          : "",
        services: activeServices.map((service) => ({
          name: service.name,
          price: formatPrice(service.price),
          duration: formatDuration(service.duration),
        })),
        tone: matchingExample?.tone ?? tones[index % tones.length],
      };
    });
}

export function getBookingDays(): BookingDay[] {
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index + 1);

    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      weekday: new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
        .format(date)
        .replace(".", ""),
      day: new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(date),
      month: new Intl.DateTimeFormat("pt-BR", { month: "short" })
        .format(date)
        .replace(".", ""),
    };
  });
}

export function formatAppointmentDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(year, month - 1, day, 12));
}
