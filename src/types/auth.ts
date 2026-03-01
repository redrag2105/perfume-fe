// Auth-related types

export interface DecodedToken {
  memberId: string;
  isAdmin: boolean;
  exp: number;
}

export interface User extends DecodedToken {
  token: string;
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  updateUserName: (name: string) => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  YOB: number;
  gender: boolean;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  user: {
    email: string;
    name: string;
    isAdmin: boolean;
  };
}

export interface GoogleCredential {
  credential: string;
}
