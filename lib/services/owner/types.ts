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

export interface OwnerSession {
    authenticated: boolean;
    user: {
        id: string;
        name: string;
        cpf: string;
        phone: string;
        email: string;
    };
}