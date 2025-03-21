import { signup, login, logout, refreshAccessToken } from "@/api/auth-api";
import { RootState } from "@/redux/store";
import {
 SignupPayload,
 SignupResponse,
 LoginPayload,
 LoginResponse,
 LogoutResponse,
 RefreshTokenResponse,
} from "@/types/auth-types";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export type ApiError = { message: string };
type ErrorFn = (error: ApiError) => void;
type SuccessSignupFn = (data: SignupResponse) => void;
type SuccessLoginFn = (data: LoginResponse) => void;
type SuccessLogoutFn = (data: LogoutResponse) => void;
type SuccessRefreshTokenFn = (data: RefreshTokenResponse) => void;

export const useSignup = (onSuccessFn?: SuccessSignupFn, onErrorFn?: ErrorFn) => {
 return useMutation<SignupResponse, ApiError, SignupPayload>({
  mutationFn: payload => signup(payload),
  onSuccess: data => {
   onSuccessFn?.(data);
  },
  onError: error => {
   toast.error(error.message || "Signup failed");
   onErrorFn?.(error);
  },
 });
};

export const useLogin = (onSuccessFn?: SuccessLoginFn, onErrorFn?: ErrorFn) => {
 return useMutation<LoginResponse, ApiError, LoginPayload>({
  mutationFn: payload => login(payload),
  onSuccess: data => {
   onSuccessFn?.(data);
  },
  onError: error => {
   toast.error(error.message || "Login failed");
   onErrorFn?.(error);
  },
 });
};

export const useLogout = (onSuccessFn?: SuccessLogoutFn, onErrorFn?: ErrorFn) => {
 const token = useSelector((state: RootState) => state.auth.token);
 return useMutation<LogoutResponse, ApiError, void>({
  mutationFn: () => logout(token),
  onSuccess: data => {
   onSuccessFn?.(data);
  },
  onError: error => {
   toast.error(error.message || "Logout failed");
   onErrorFn?.(error);
  },
 });
};

export const useRefreshAccessToken = (onSuccessFn?: SuccessRefreshTokenFn, onErrorFn?: ErrorFn) => {
 return useMutation<RefreshTokenResponse, ApiError, void>({
  mutationFn: () => refreshAccessToken(),
  onSuccess: data => {
   onSuccessFn?.(data);
  },
  onError: error => {
   toast.error(error.message || "Token refreshing failed");
   onErrorFn?.(error);
  },
 });
};
