import axios from 'axios';


export const axiosClient = axios.create({
    baseURL: "/api/backend",
    timeout: 65000,
    headers: {
        'Content-Type': 'application/json',
    },
})