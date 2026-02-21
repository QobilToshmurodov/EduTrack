namespace EduTrack.Models
{
    // Auth
    public class LoginModel
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponseModel
    {
        public string Token { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public int UserId { get; set; }
        public int? ProfileId { get; set; }
    }

    public class RegisterModel
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    // Profession
    public class ProfessionDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int GroupsCount { get; set; }
    }

    public class CreateProfessionDto
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    // Employee
    public class EmployeeDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int? ProfessionId { get; set; }
        public string? ProfessionName { get; set; }
    }

    public class CreateEmployeeDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public int? ProfessionId { get; set; }
    }

    public class UpdateEmployeeDto
    {
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public int? ProfessionId { get; set; }
    }

    // Student
    public class StudentDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public int? GroupId { get; set; }
        public string? GroupName { get; set; }
        public string? Username { get; set; }
    }

    public class CreateStudentDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int? GroupId { get; set; }
    }

    public class UpdateStudentDto
    {
        public string FullName { get; set; } = string.Empty;
        public int? GroupId { get; set; }
    }

    // Group
    public class GroupDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? ProfessionId { get; set; }
        public string? ProfessionName { get; set; }
        public int StudentsCount { get; set; }
    }

    public class CreateGroupDto
    {
        public string Name { get; set; } = string.Empty;
        public int? ProfessionId { get; set; }
    }

    // Subject
    public class SubjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class CreateSubjectDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    // EmployeeSubjectGroup
    public class ESGDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public int SubjectId { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public int GroupId { get; set; }
        public string GroupName { get; set; } = string.Empty;
    }

    public class CreateESGDto
    {
        public int EmployeeId { get; set; }
        public int SubjectId { get; set; }
        public int GroupId { get; set; }
    }

    // Assignment
    public class AssignmentDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? FilePath { get; set; }
        public DateTime DueDate { get; set; }
        public int SubjectId { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public int GroupId { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int SubmissionsCount { get; set; }
    }

    public class CreateAssignmentDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime DueDate { get; set; }
        public int SubjectId { get; set; }
        public int GroupId { get; set; }
        public int EmployeeId { get; set; }
    }

    public class UpdateAssignmentDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime DueDate { get; set; }
        public int SubjectId { get; set; }
        public int GroupId { get; set; }
    }

    // Submission
    public class SubmissionDto
    {
        public int Id { get; set; }
        public int AssignmentId { get; set; }
        public string AssignmentTitle { get; set; } = string.Empty;
        public int StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? FilePath { get; set; }
        public DateTime SubmittedAt { get; set; }
        public GradeDto? Grade { get; set; }
    }

    public class CreateSubmissionDto
    {
        public int AssignmentId { get; set; }
        public int StudentId { get; set; }
    }

    // Grade
    public class GradeDto
    {
        public int Id { get; set; }
        public int SubmissionId { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int EmployeeId { get; set; }
        public decimal Value { get; set; }
        public string? Comment { get; set; }
        public DateTime GradedAt { get; set; }
    }

    public class CreateGradeDto
    {
        public int SubmissionId { get; set; }
        public int StudentId { get; set; }
        public int EmployeeId { get; set; }
        public decimal Value { get; set; }
        public string? Comment { get; set; }
    }

    public class UpdateGradeDto
    {
        public decimal Value { get; set; }
        public string? Comment { get; set; }
    }

    // Dashboard
    public class DashboardStatsDto
    {
        public int ProfessionsCount { get; set; }
        public int StudentsCount { get; set; }
        public int EmployeesCount { get; set; }
        public int GroupsCount { get; set; }
        public int SubjectsCount { get; set; }
        public int AssignmentsCount { get; set; }
    }
}
