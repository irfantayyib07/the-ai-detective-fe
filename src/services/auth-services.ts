import { signup, login, logout, refreshAccessToken } from "@/api/auth-api";
import {
 SignupPayload,
 SignupResponse,
 LoginPayload,
 LoginResponse,
 LogoutResponse,
 RefreshTokenResponse,
} from "@/types/auth-types";
import { useMutation } from "@tanstack/react-query";

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
   onErrorFn?.(error);
  },
 });
};

export const useLogout = (onSuccessFn?: SuccessLogoutFn, onErrorFn?: ErrorFn) => {
 return useMutation<LogoutResponse, ApiError, void>({
  mutationFn: () => logout(),
  onSuccess: data => {
   onSuccessFn?.(data);
  },
  onError: error => {
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
   onErrorFn?.(error);
  },
 });
};
