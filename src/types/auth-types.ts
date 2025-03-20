export interface SignupPayload {
 email: string;
 username: string;
 password: string;
}

export interface LoginPayload {
 email?: string;
 username?: string;
 password: string;
}

export interface SignupResponse {
 user: {
  id: string;
  email: string;
  username: string;
 };
 tokens: {
  accessToken: string;
 };
}

export interface LoginResponse {
 user: {
  id: string;
  email: string;
  username: string;
 };
 tokens: {
  accessToken: string;
  refreshToken: string;
 };
}

export interface LogoutResponse {
 success: boolean;
 message: string;
}

export interface RefreshTokenResponse {
 accessToken: string;
 refreshToken: string;
}
