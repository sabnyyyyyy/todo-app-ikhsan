// Kontrak request & response untuk endpoint /api/auth

export interface RegisterRequest {
  nama: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    nama: string;
    email: string;
  };
  token?: string;
}
