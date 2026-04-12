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

export interface UserRecord {
  competitionId: number;
  competitionName: string;
  date: string;
  discipline: string;
  result: string;
}

export interface Trainee {
  id: number;
  fullName: string;
  avatar: string;
  sport: string;
}

export interface UserSport {
  sportName: string;
  rankName: string;
  dateReceived: Date;
}

export interface UserProfile {
  id: number;
  fullName: string;
  avatar: string;
  role: 'Athlete' | 'Coach' | 'Admin';
  age: number;
  birthDate: string;
  gender: 'Male' | 'Female';
  email: string;
  university: string;
  universityId: number;
  faculty: string;
  course: number;
  coachId: number | null;
  coachName: string | null;
  sport: UserSport[];
  records: UserRecord[];
  trainees: Trainee[];
}
