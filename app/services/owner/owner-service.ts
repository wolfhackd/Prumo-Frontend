import type { AxiosInstance } from "axios";
import type { OwnerCreateData, OwnerLoginData, OwnerSession } from "./types";

export class OwnerService {
    constructor(private readonly http: AxiosInstance){}

    async create(data: OwnerCreateData) {
        const response = await this.http.post("/owner/create",data);
        if(response.status === 201){
            return response.data
        }

        throw new Error(response.data.message || "Error creating owner")
    }

    async login(data: OwnerLoginData) {
        const response = await this.http.post("/owner/login",data);

        if(response.status === 200){
            return response.data
        }

        throw new Error(response.data.message || "Error logging owner")
    }

    async getSession(): Promise<OwnerSession> {
        const response = await this.http.get<OwnerSession>("/auth/status");

        if (
            response.data?.authenticated !== true ||
            typeof response.data.user?.id !== "string"
        ) {
            throw new Error("Não foi possível validar sua sessão. Entre novamente.");
        }

        return response.data;
    }
}