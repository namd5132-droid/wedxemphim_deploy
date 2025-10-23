import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL

const apiClient = axios.create({
    baseURL:API_BASE_URL,
    headers:{
        'content-Type': "application/json"
    }
})

export default apiClient;