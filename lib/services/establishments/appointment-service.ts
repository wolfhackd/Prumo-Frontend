import type { AxiosInstance } from "axios";

export interface Appointment {
  id: string;
  data: string;
  status: boolean;
  establishmentId: string;
  serviceId: string;
  clientId: string;
  client: {
    id: string;
    name: string;
    cpf: string;
    phone: string;
    email: string;
  };
  service: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    establishmentId: string;
  };
}

export interface AppointmentCreateData {
  establishmentId: string;
  serviceId: string;
  hour: string;
  dayOfWeek: number;
  name: string;
  cpf: string;
  phone: string;
  email: string;
}

function isAppointment(value: unknown): value is Appointment {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const appointment = value as Record<string, unknown>;
  const client = appointment.client;
  const service = appointment.service;

  return (
    typeof appointment.id === "string" &&
    typeof appointment.data === "string" &&
    !Number.isNaN(Date.parse(appointment.data)) &&
    typeof appointment.status === "boolean" &&
    typeof appointment.establishmentId === "string" &&
    typeof appointment.serviceId === "string" &&
    typeof appointment.clientId === "string" &&
    typeof client === "object" &&
    client !== null &&
    "id" in client &&
    typeof client.id === "string" &&
    "name" in client &&
    typeof client.name === "string" &&
    "cpf" in client &&
    typeof client.cpf === "string" &&
    client.cpf.trim().length > 0 &&
    typeof service === "object" &&
    service !== null &&
    "id" in service &&
    typeof service.id === "string" &&
    "name" in service &&
    typeof service.name === "string" &&
    "duration" in service &&
    typeof service.duration === "number" &&
    Number.isFinite(service.duration) &&
    service.duration > 0
  );
}

export class AppointmentServiceClient {
  constructor(private readonly http: AxiosInstance) {}

  async create(data: AppointmentCreateData): Promise<void> {
    if (!data.establishmentId.trim()) {
      throw new Error("O estabelecimento do agendamento é obrigatório.");
    }

    if (!data.serviceId.trim()) {
      throw new Error("Selecione um serviço para o agendamento.");
    }

    if (
      !Number.isInteger(data.dayOfWeek) ||
      data.dayOfWeek < 1 ||
      data.dayOfWeek > 7
    ) {
      throw new Error("Selecione um dia da semana válido.");
    }

    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(data.hour)) {
      throw new Error("Informe um horário válido.");
    }

    if (!data.name.trim()) {
      throw new Error("Informe o nome do cliente.");
    }

    if (!/^\d{11}$/.test(data.cpf)) {
      throw new Error("Informe um CPF com 11 números.");
    }

    if (!data.phone.trim()) {
      throw new Error("Informe o telefone do cliente.");
    }

    if (!data.email.trim()) {
      throw new Error("Informe o e-mail do cliente.");
    }

    await this.http.post("/appointment/create", {
      ...data,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
    });
  }

  async getByEstablishment(establishmentId: string): Promise<Appointment[]> {
    if (!establishmentId.trim()) {
      throw new Error("O identificador do estabelecimento é obrigatório.");
    }

    const response = await this.http.get<unknown>(
      `/appointment/establishment/${encodeURIComponent(establishmentId)}`,
    );
    const data = response.data;

    if (
      typeof data !== "object" ||
      data === null ||
      !("appointments" in data) ||
      !Array.isArray(data.appointments) ||
      !data.appointments.every(isAppointment)
    ) {
      throw new Error("A resposta da API não contém uma lista válida de agendamentos.");
    }

    return data.appointments;
  }

  async cancel(appointmentId: string, cpf: string): Promise<void> {
    if (!appointmentId.trim()) {
      throw new Error("O identificador do agendamento é obrigatório.");
    }

    if (!cpf.trim()) {
      throw new Error("O CPF do cliente é obrigatório para cancelar o agendamento.");
    }

    await this.http.delete("/appointment/delete", {
      data: { appointmentId, cpf },
    });
  }

  async checkIn(appointmentId: string): Promise<void> {
    if (!appointmentId.trim()) {
      throw new Error("O identificador do agendamento é obrigatório.");
    }

    await this.http.patch("/appointment/confirm", { appointmentId });
  }
}
