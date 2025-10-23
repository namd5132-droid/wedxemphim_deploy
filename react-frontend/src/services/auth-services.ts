import apiClient from "../constants/api";
import type { RegisterData } from "../entities/auth";
import type { LoginData } from "../entities/auth";
import { AUTH } from "../constants/api-endpoint";

export const AuthSevice = {
    register(data:RegisterData) {
        return apiClient.post(AUTH.REGISTER,data);
    },
    login(data:LoginData) {
        return apiClient.post(AUTH.LOGIN,data);
    },
 
}