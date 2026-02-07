export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export enum UserRole {
  Admin = 'Admin',
  Director = 'Director',
  Teacher = 'Teacher',
  Student = 'Student'
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  username: string;
  role: string;
}
