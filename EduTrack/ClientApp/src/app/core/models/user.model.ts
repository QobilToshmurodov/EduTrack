export interface User {
  id: number;
  username: string;
  role: UserRole;
  profileId?: number;
}

export enum UserRole {
  Admin = 'Admin',
  Teacher = 'Teacher',
  Student = 'Student'
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  userId: number;
  profileId?: number;
}
