import type { AxiosInstance } from "axios";
import { OwnerCreateData, OwnerLoginData } from "./types";

export class OwnerService {
    constructor(private readonly http: AxiosInstance){}


    async create(data:OwnerCreateData){

        const response = await this.http.post("/owner/create",data);
        if(response.status === 201){
            return response.data
        }

        throw new Error(response.data.message || "Error creating owner")
    }

    async login(data:OwnerLoginData) {
        const response = await this.http.post("/owner/login",data);

        if(response.status === 200){
            return response.data
        }

        throw new Error(response.data.message || "Error logging owner")
    }
}