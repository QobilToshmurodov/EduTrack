// Submission DTOs
export interface SubmissionDto {
  id: number;
  assignmentId: number;
  studentId: number;
  fileUrl: string;
}

export interface CreateSubmissionDto {
  assignmentId: number;
  studentId: number;
  fileUrl: string;
}

// Grade DTOs
export interface GradeDto {
  id: number;
  submissionId: number;
  teacherId: number;
  score: number;
}

export interface CreateGradeDto {
  submissionId: number;
  teacherId: number;
  score: number;
}

// Frontend Models
export interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  fileUrl: string;
  studentName?: string;
  submittedAt?: Date;
  grade?: Grade;
}

export interface Grade {
  id: number;
  submissionId: number;
  teacherId: number;
  score: number;
  teacherName?: string;
  gradedAt?: Date;
}

export interface StudentSubmission extends Submission {
  assignmentTitle: string;
  assignmentDeadline: Date;
  subjectName: string;
  status: 'pending' | 'submitted' | 'graded';
}
