export const demoStorageKeys = {
  establishments: "prumo-demo-establishments",
  services: "prumo-demo-services",
  appointments: "prumo-demo-appointments",
} as const;

export type DemoAppointment = {
  id: string;
  businessInitials: string;
  businessName?: string;
  establishmentId?: string;
  serviceName: string;
  date: string;
  time: string;
  customerName: string;
  contact: string;
  status: "scheduled" | "completed" | "cancelled";
};

export type DemoEstablishment = {
  id: string;
  name: string;
  category: string;
  city: string;
  address: string;
  active: boolean;
};

export type DemoService = {
  id: string;
  establishmentId: string;
  name: string;
  category: string;
  duration: number;
  price: number;
  active: boolean;
};

export function isDemoEstablishment(value: unknown): value is DemoEstablishment {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "name" in value &&
    typeof value.name === "string" &&
    "category" in value &&
    typeof value.category === "string" &&
    "city" in value &&
    typeof value.city === "string" &&
    "address" in value &&
    typeof value.address === "string" &&
    "active" in value &&
    typeof value.active === "boolean"
  );
}

export function isDemoService(value: unknown): value is DemoService {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "establishmentId" in value &&
    typeof value.establishmentId === "string" &&
    "name" in value &&
    typeof value.name === "string" &&
    "category" in value &&
    typeof value.category === "string" &&
    "duration" in value &&
    typeof value.duration === "number" &&
    "price" in value &&
    typeof value.price === "number" &&
    "active" in value &&
    typeof value.active === "boolean"
  );
}

export function isDemoAppointment(value: unknown): value is DemoAppointment {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const dateValue =
    "date" in value && typeof value.date === "string" ? value.date : null;
  const timeValue =
    "time" in value && typeof value.time === "string" ? value.time : null;
  const validDate =
    dateValue !== null && /^\d{4}-\d{2}-\d{2}$/.test(dateValue);
  const validTime =
    timeValue !== null && /^([01]\d|2[0-3]):[0-5]\d$/.test(timeValue);

  if (dateValue !== null && validDate) {
    const [year, month, day] = dateValue.split("-").map(Number);
    const parsedDate = new Date(year, month - 1, day);
    if (
      parsedDate.getFullYear() !== year ||
      parsedDate.getMonth() !== month - 1 ||
      parsedDate.getDate() !== day
    ) {
      return false;
    }
  }

  return (
    "id" in value &&
    typeof value.id === "string" &&
    "businessInitials" in value &&
    typeof value.businessInitials === "string" &&
    (!("businessName" in value) || typeof value.businessName === "string") &&
    (!("establishmentId" in value) ||
      typeof value.establishmentId === "string") &&
    "serviceName" in value &&
    typeof value.serviceName === "string" &&
    validDate &&
    validTime &&
    "customerName" in value &&
    typeof value.customerName === "string" &&
    "contact" in value &&
    typeof value.contact === "string" &&
    "status" in value &&
    (value.status === "scheduled" ||
      value.status === "completed" ||
      value.status === "cancelled")
  );
}

export function readDemoList<T>(
  key: string,
  fallback: T[],
  isItem: (value: unknown) => value is T,
): T[] {
  const savedValue = window.localStorage.getItem(key);

  if (savedValue === null) {
    return fallback;
  }

  const parsedValue: unknown = JSON.parse(savedValue);

  if (!Array.isArray(parsedValue) || !parsedValue.every(isItem)) {
    throw new Error(`Os dados de demonstração de "${key}" estão inválidos.`);
  }

  return parsedValue;
}

export function writeDemoList<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
