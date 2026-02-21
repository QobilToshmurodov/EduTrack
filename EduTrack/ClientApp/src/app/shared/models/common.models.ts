export interface ProfessionDto {
  id: number;
  name: string;
  code: string;
  description?: string;
  groupsCount: number;
}

export interface EmployeeDto {
  id: number;
  userId: number;
  fullName: string;
  phone?: string;
  email?: string;
  professionId?: number;
  professionName?: string;
}

export interface StudentDto {
  id: number;
  userId: number;
  fullName: string;
  groupId?: number;
  groupName?: string;
  username?: string;
}

export interface GroupDto {
  id: number;
  name: string;
  professionId?: number;
  professionName?: string;
  studentsCount: number;
}

export interface SubjectDto {
  id: number;
  name: string;
  description?: string;
}

export interface ESGDto {
  id: number;
  employeeId: number;
  employeeName: string;
  subjectId: number;
  subjectName: string;
  groupId: number;
  groupName: string;
}

export interface AssignmentDto {
  id: number;
  title: string;
  description?: string;
  filePath?: string;
  dueDate: string;
  subjectId: number;
  subjectName: string;
  groupId: number;
  groupName: string;
  employeeId: number;
  employeeName: string;
  createdAt: string;
  submissionsCount: number;
}

export interface SubmissionDto {
  id: number;
  assignmentId: number;
  assignmentTitle: string;
  studentId: number;
  studentName: string;
  description?: string;
  filePath?: string;
  submittedAt: string;
  grade?: GradeDto;
}

export interface GradeDto {
  id: number;
  submissionId: number;
  studentId: number;
  studentName: string;
  employeeId: number;
  value: number;
  comment?: string;
  gradedAt: string;
}

export interface DashboardStatsDto {
  professionsCount: number;
  studentsCount: number;
  employeesCount: number;
  groupsCount: number;
  subjectsCount: number;
  assignmentsCount: number;
}
