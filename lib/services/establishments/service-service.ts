import type { AxiosInstance } from "axios";

export interface ServiceData {
  name: string;
  description: string | null;
  price: number;
  duration: number;
  establishId: string;
}

export class ServiceServiceClient {
  constructor(private readonly http: AxiosInstance) {}

  async create(data: ServiceData): Promise<void> {
    this.validate(data);
    await this.http.post("/service/create", data);
  }

  async update(id: string, data: ServiceData): Promise<void> {
    if (!id.trim()) {
      throw new Error("O identificador do serviço é obrigatório.");
    }

    this.validate(data);
    await this.http.patch("/service/edit", {
      serviceId: id,
      name: data.name,
      price: data.price,
      duration: data.duration,
    });
  }

  async delete(id: string): Promise<void> {
    if (!id.trim()) {
      throw new Error("O identificador do serviço é obrigatório.");
    }

    await this.http.delete("/service/delete", {
      data: {
        serviceId: id,
      },
    });
  }

  private validate(data: ServiceData) {
    if (!data.name.trim()) {
      throw new Error("Informe o nome do serviço.");
    }

    if (!Number.isFinite(data.price) || data.price < 0) {
      throw new Error("O preço deve ser um valor igual ou maior que zero.");
    }

    if (
      !Number.isSafeInteger(data.duration) ||
      data.duration < 30 ||
      data.duration % 30 !== 0
    ) {
      throw new Error("A duração deve ser um múltiplo de 30 minutos.");
    }

    if (!data.establishId.trim()) {
      throw new Error("O estabelecimento do serviço é obrigatório.");
    }
  }
}
