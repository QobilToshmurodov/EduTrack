// Group
export interface GroupDto {
  id: number;
  name: string;
}

export interface Group {
  id: number;
  name: string;
  studentsCount?: number;
}

// Subject
export interface SubjectDto {
  id: number;
  name: string;
}

export interface Subject {
  id: number;
  name: string;
}

// Student
export interface StudentDto {
  id: number;
  userId: number;
  groupId?: number;
  parentId?: number;
}

export interface Student {
  id: number;
  userId: number;
  username: string;
  groupId?: number;
  groupName?: string;
  parentId?: number;
}

// Teacher
export interface TeacherDto {
  id: number;
  userId: number;
  fullname: string;
}

export interface Teacher {
  id: number;
  userId: number;
  fullname: string;
  subjects?: Subject[];
  groups?: Group[];
}

// Teacher-Subject-Group
export interface TSGDto {
  id: number;
  teacherId: number;
  subjectId: number;
  groupId: number;
}
