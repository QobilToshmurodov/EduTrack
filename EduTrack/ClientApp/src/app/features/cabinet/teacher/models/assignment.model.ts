import { SubmissionDto } from '../../student/models/submission.model';

// DTOs - Backend'dan keladi
export interface AssignmentDto {
  id: number;
  subjectId: number;
  groupId: number;
  teacherId: number;
  title: string;
  deadline: string; // ISO string
}

export interface CreateAssignmentDto {
  subjectId: number;
  groupId: number;
  teacherId: number;
  title: string;
  deadline: string;
}

export interface UpdateAssignmentDto {
  subjectId?: number;
  groupId?: number;
  title?: string;
  deadline?: string;
}

// Frontend Models
export interface Assignment {
  id: number;
  title: string;
  deadline: Date;
  subjectId: number;
  groupId: number;
  teacherId: number;
  subjectName?: string;
  groupName?: string;
  teacherName?: string;
  submissionsCount?: number;
  status?: AssignmentStatus;
}

export enum AssignmentStatus {
  Active = 'active',
  Expired = 'expired',
  Upcoming = 'upcoming'
}

export interface AssignmentWithDetails extends Assignment {
  submissions: SubmissionDto[];
}
