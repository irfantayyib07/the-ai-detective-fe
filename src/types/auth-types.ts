import { SessionUser } from "./user-types";

export interface SignupPayload {
 email: string;
 username: string;
 password: string;
}

export interface SignupResponse {
 success: boolean;
 data: {
  token: string;
  sessionUser: SessionUser;
 };
 message: string;
}

export interface LoginPayload {
 email?: string;
 username?: string;
 password: string;
}

export interface LoginResponse {
 success: boolean;
 data: {
  token: string;
  sessionUser: SessionUser;
 };
 message: string;
}

export interface LogoutResponse {
 success: boolean;
 message: string;
}

export interface RefreshTokenResponse {
 success: boolean;
 data: string;
 message: string;
}
