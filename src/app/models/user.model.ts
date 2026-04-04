// src/app/models/user.model.ts
export interface User {
  id: number;
  fullName: string;
  email: string;
  avatar: string | null;
  role: 'Athlete' | 'Coach';
  age: number;
  birthDate: string;
  gender: 'Male' | 'Female';
  university: string;
  faculty: string;
  course: number;
  coachId: number | null;
  coachName: string | null;
  sport: string | null;
  category: string | null;
  trainees?: any[];
  records?: any[];
}

export interface AuthResponse {
  message: string;
  email: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleName: 'Athlete' | 'Coach';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}
