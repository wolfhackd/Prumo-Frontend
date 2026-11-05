// Responsável por montar todos os services

import { axiosClient } from "@/lib/http/axios-client";
import { EstablishmentServiceClient } from "./establishments/establishment-service";
import { AppointmentServiceClient } from "./establishments/appointment-service";
import { OwnerService } from "./owner/owner-service";
import { ServiceServiceClient } from "./establishments/service-service";

export const establishmentService = new EstablishmentServiceClient(axiosClient);
export const appointmentService = new AppointmentServiceClient(axiosClient);
export const ownerService = new OwnerService(axiosClient);
export const serviceService = new ServiceServiceClient(axiosClient);
