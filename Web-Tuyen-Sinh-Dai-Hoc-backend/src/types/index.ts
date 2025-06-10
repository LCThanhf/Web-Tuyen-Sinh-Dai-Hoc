import { Request } from 'express';
import { UserRole, Gender } from '@prisma/client';

export interface RegisterRequest {
  cccd: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  cccd: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      cccd: string;
      fullName: string;
      email: string;
      phone: string;
      role: UserRole;
    };
    token: string;
  };
}

export interface JWTPayload {
  userId: string;
  cccd: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Fix: Extend Express Request instead of the global Request
export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}