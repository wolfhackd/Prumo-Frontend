export interface OwnerCreateData {
    name:string;
    email:string;
    password:string;
    phone:string;
    cpf:string;
}

export interface OwnerLoginData {
    emailOrCpf: string;
    password: string
}