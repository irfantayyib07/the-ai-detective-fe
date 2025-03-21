import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { refreshAccessToken } from "./auth-api";
import store from "@/redux/store";
import { setToken } from "@/redux/slices/authSlice";

let isRefreshing = false;
let failedRequests: {
 resolve: (value: any) => void;
 reject: (reason?: any) => void;
 config: AxiosRequestConfig;
}[] = [];

export const apiClient = axios.create({
 baseURL: "http://localhost:3500",
});

export const apiClientWithAuth = (token: string) => {
 console.log(token);
 const client = axios.create({
  baseURL: "http://localhost:3500",
 });

 client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (token) {
   config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
 });

 client.interceptors.response.use(
  (response: AxiosResponse) => {
   return response;
  },
  async (error: AxiosError) => {
   const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

   const isAuthError =
    error.response?.status === 403 &&
    error.response?.data &&
    (error.response.data as any).message === "You are not authorized to perform this action";

   if (
    isAuthError &&
    originalRequest &&
    !originalRequest._retry &&
    originalRequest.url !== "/auth/refresh-token"
   ) {
    if (!isRefreshing) {
     isRefreshing = true;
     originalRequest._retry = true;

     try {
      const refreshResponse = await refreshAccessToken();
      const newAccessToken = refreshResponse.data;

      store.dispatch(setToken(newAccessToken));

      if (originalRequest.headers) {
       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      } else {
       originalRequest.headers = { Authorization: `Bearer ${newAccessToken}` };
      }

      failedRequests.forEach(request => {
       if (request.config.headers) {
        request.config.headers.Authorization = `Bearer ${newAccessToken}`;
       } else {
        request.config.headers = { Authorization: `Bearer ${newAccessToken}` };
       }
       request.resolve(client(request.config));
      });
      failedRequests = [];

      return client(originalRequest);
     } catch (refreshError) {
      failedRequests.forEach(request => {
       request.reject(refreshError);
      });
      failedRequests = [];

      return Promise.reject(refreshError);
     } finally {
      isRefreshing = false;
     }
    } else {
     // If already refreshing, queue this request
     return new Promise((resolve, reject) => {
      failedRequests.push({
       resolve,
       reject,
       config: originalRequest,
      });
     });
    }
   }

   return Promise.reject(error);
  },
 );

 return client;
};
