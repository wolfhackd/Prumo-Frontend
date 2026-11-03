import type { AxiosInstance } from "axios";
import axios from "axios";

export interface EstablishmentServiceItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  establishmentId: string;
}

export interface EstablishmentBusinessHour {
  id: string;
  dayOfWeek: number;
  openingTime: string;
  closingTime: string;
}

export interface EstablishmentBusinessHourData {
  establishmentId: string;
  dayOfWeek: number;
  openingTime: string;
  closingTime: string;
}

export interface EstablishmentBusinessHourUpdateData {
  dayOfWeek: number;
  openingTime: string;
  closingTime: string;
}

export interface Establishment {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  website: string | null;
  location: string | null;
  ownerId: string;
  services: EstablishmentServiceItem[];
  businessHours: EstablishmentBusinessHour[];
}

export interface EstablishmentCreateData {
  name: string;
  email: string;
  phone: string;
  website: string | null;
  location: string | null;
  ownerId: string;
}

export class EstablishmentServiceClient {
  constructor(private readonly http: AxiosInstance) {}

  async create(data: EstablishmentCreateData): Promise<void> {
    await this.http.post("/establishment", data);
  }

  async getAll(page: number, limit: number): Promise<Establishment[]> {
    if (!Number.isInteger(page) || page < 1) {
      throw new Error("A página deve ser um número inteiro maior que zero.");
    }

    if (!Number.isInteger(limit) || limit < 1) {
      throw new Error("O limite deve ser um número inteiro maior que zero.");
    }

    let response;
    try {
      response = await this.http.get<Establishment[]>("/establishment", {
        params: { page, limit },
      });
    } catch (error: unknown) {
      if (
        axios.isAxiosError<{ error?: string }>(error) &&
        error.response?.data?.error === "No establishments found!"
      ) {
        return [];
      }

      throw error;
    }

    if (!Array.isArray(response.data)) {
      throw new Error("A resposta da API não contém uma lista de estabelecimentos.");
    }

    return response.data;
  }

  async getById(id: string): Promise<Establishment> {
    if (!id.trim()) {
      throw new Error("O identificador do estabelecimento é obrigatório.");
    }

    const response = await this.http.get<{ establishment: Establishment }>(
      `/establishment/${encodeURIComponent(id)}`,
    );

    if (
      typeof response.data !== "object" ||
      response.data === null ||
      typeof response.data.establishment !== "object" ||
      response.data.establishment === null
    ) {
      throw new Error("A resposta da API não contém o estabelecimento.");
    }

    return response.data.establishment;
  }

  async registerBusinessHour(data: EstablishmentBusinessHourData): Promise<void> {
    if (!data.establishmentId.trim()) {
      throw new Error("O estabelecimento do horário é obrigatório.");
    }

    this.validateBusinessHourTimes(data);
    await this.http.post("/establishment/register-hour", data);
  }

  async updateBusinessHour(
    businessHourId: string,
    data: EstablishmentBusinessHourUpdateData,
  ): Promise<void> {
    if (!businessHourId.trim()) {
      throw new Error("O identificador do horário é obrigatório.");
    }

    this.validateBusinessHourTimes(data);
    await this.http.patch("/establishment/update-hour", {
      ...data,
      businessHourId,
    });
  }

  async deleteBusinessHour(businessHourId: string): Promise<void> {
    if (!businessHourId.trim()) {
      throw new Error("O identificador do horário é obrigatório.");
    }

    await this.http.delete("/establishment/delete-hour", {
      data: { businessHourId },
    });
  }

  async getForOwner(): Promise<Establishment[]> {
    let response;
    try {
      response = await this.http.get<{
        establishments: Establishment[];
      }>("/establishment/owner");
    } catch (error: unknown) {
      if (
        axios.isAxiosError<{ error?: string }>(error) &&
        error.response?.data?.error === "No establishments found!"
      ) {
        return [];
      }

      throw error;
    }

    if (
      typeof response.data !== "object" ||
      response.data === null ||
      !Array.isArray(response.data.establishments) ||
      response.data.establishments.some(
        (establishment) =>
          typeof establishment !== "object" ||
          establishment === null ||
          !Array.isArray(establishment.services),
      )
    ) {
      throw new Error(
        "A resposta da API não contém os estabelecimentos e serviços do responsável.",
      );
    }

    return response.data.establishments;
  }

  private validateBusinessHourTimes(
    data: EstablishmentBusinessHourUpdateData,
  ) {
    if (
      !Number.isInteger(data.dayOfWeek) ||
      data.dayOfWeek < 1 ||
      data.dayOfWeek > 7
    ) {
      throw new Error("Selecione um dia da semana válido.");
    }

    if (
      !/^\d{2}:\d{2}$/.test(data.openingTime) ||
      !/^\d{2}:\d{2}$/.test(data.closingTime) ||
      data.openingTime >= data.closingTime
    ) {
      throw new Error("O horário de abertura deve ser anterior ao fechamento.");
    }
  }
}