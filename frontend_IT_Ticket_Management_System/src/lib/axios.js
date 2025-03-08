import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://it-ticket-management-system-xi.vercel.app/api",
    withCredentials:true,
})

