
export enum AppRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  postedAt: number;
  salary?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  skills: string[];
  role: AppRole;
  password?: string; // Simplification for demo authentication
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatus;
  appliedAt: number;
  feedback?: string;
}
