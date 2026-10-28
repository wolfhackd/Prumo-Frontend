//Responsável por montar todos os services

import {OwnerService} from './owner/owner-service'
import {axiosClient} from '@/lib/http/axios-client'



export const ownerService = new OwnerService(axiosClient)
