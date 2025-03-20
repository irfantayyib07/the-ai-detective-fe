import axios from "axios";
import {
 SignupPayload,
 SignupResponse,
 LoginPayload,
 LoginResponse,
 LogoutResponse,
 RefreshTokenResponse,
} from "@/types/auth-types";
import { ENDPOINTS } from "./api";

const apiClient = axios.create({
 baseURL: "http://localhost:3500",
});

export const signup = async (payload: SignupPayload): Promise<SignupResponse> => {
 const response = await apiClient.post<SignupResponse>(`${ENDPOINTS.AUTH}/signup`, payload);
 return response.data;
};

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
 const response = await apiClient.post<LoginResponse>(`${ENDPOINTS.AUTH}/login`, payload);
 return response.data;
};

export const logout = async (): Promise<LogoutResponse> => {
 const response = await apiClient.post<LogoutResponse>(`${ENDPOINTS.AUTH}/logout`);
 return response.data;
};

export const refreshAccessToken = async (): Promise<RefreshTokenResponse> => {
 const response = await apiClient.post<RefreshTokenResponse>(`${ENDPOINTS.AUTH}/refresh-token`);
 return response.data;
};
