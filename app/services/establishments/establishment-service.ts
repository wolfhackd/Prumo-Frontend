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

export class EstablishmentServiceClient {
  constructor(private readonly http: AxiosInstance) {}

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

  async getForOwner(): Promise<Establishment[]> {
    const response = await this.http.get<{
      establishments: Establishment[];
    }>("/establishment/owner");

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
}