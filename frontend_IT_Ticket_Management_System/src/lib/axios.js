import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://it-ticket-management-system.onrender.com/api",
    withCredentials:true,
})

