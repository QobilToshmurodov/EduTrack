// Attendance DTOs
export interface AttendanceEventDto {
  id: number;
  studentId: number;
  teacherId: number;
  timestamp: string; // ISO string
  eventType: string; // 'arrived', 'late', 'left'
  source: string; // 'qr', 'manual', 'face'
}

export interface CreateAttendanceEventDto {
  studentId: number;
  teacherId: number;
  eventType: string;
  source: string;
}

// Frontend Models
export interface AttendanceEvent {
  id: number;
  studentId: number;
  teacherId: number;
  timestamp: Date;
  eventType: AttendanceEventType;
  source: AttendanceSource;
  studentName?: string;
  teacherName?: string;
}

export enum AttendanceEventType {
  Arrived = 'arrived',
  Late = 'late',
  Left = 'left'
}

export enum AttendanceSource {
  QR = 'qr',
  Manual = 'manual',
  Face = 'face'
}

export interface StudentAttendance {
  studentId: number;
  studentName: string;
  groupName: string;
  events: AttendanceEvent[];
  status: AttendanceStatus;
}

export enum AttendanceStatus {
  Present = 'present',
  Late = 'late',
  Absent = 'absent'
}

export interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  lateDays: number;
  absentDays: number;
  attendancePercentage: number;
}
