// Responsável por montar todos os services

import { axiosClient } from "@/lib/http/axios-client";
import { EstablishmentServiceClient } from "./establishments/establishment-service";
import { OwnerService } from "./owner/owner-service";

export const establishmentService = new EstablishmentServiceClient(axiosClient);
export const ownerService = new OwnerService(axiosClient);
