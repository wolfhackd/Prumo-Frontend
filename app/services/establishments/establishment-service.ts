import type { AxiosInstance } from "axios";

export interface EstablishmentServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  establishmentId: string;
}

export interface EstablishmentOpeningHour {
  establishmentId: string;
  dayOfWeek: string;
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
  website?: string;
  location?: string;
  ownerID: string;
  services: EstablishmentServiceItem[];
  openingHours?: EstablishmentOpeningHour[];
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

    const response = await this.http.get<Establishment[]>("/establishment", {
      params: { page, limit },
    });

    if (!Array.isArray(response.data)) {
      throw new Error("A resposta da API não contém uma lista de estabelecimentos.");
    }

    return response.data;
  }
}