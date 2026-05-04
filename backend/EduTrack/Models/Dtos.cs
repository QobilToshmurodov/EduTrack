using System.ComponentModel.DataAnnotations;

namespace EduTrack.Models
{
    // Auth
    public class LoginModel
    {
        [Required, MinLength(3), MaxLength(50)]
        public string Username { get; set; } = string.Empty;
        [Required, MinLength(6), MaxLength(100)]
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
        [Required, MinLength(3), MaxLength(50)]
        public string Username { get; set; } = string.Empty;
        [Required, MinLength(6), MaxLength(100)]
        public string Password { get; set; } = string.Empty;
        [Required, RegularExpression("^(Admin|Teacher|Student)$")]
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
        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;
        [Required, MaxLength(20)]
        public string Code { get; set; } = string.Empty;
        [MaxLength(500)]
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
        [Required, MaxLength(150)]
        public string FullName { get; set; } = string.Empty;
        [Required, MinLength(3), MaxLength(50)]
        public string Username { get; set; } = string.Empty;
        [Required, MinLength(6), MaxLength(100)]
        public string Password { get; set; } = string.Empty;
        [EmailAddress, MaxLength(150)]
        public string? Email { get; set; }
        [Phone, MaxLength(30)]
        public string? Phone { get; set; }
        public int? ProfessionId { get; set; }
    }

    public class UpdateEmployeeDto
    {
        [Required, MaxLength(150)]
        public string FullName { get; set; } = string.Empty;
        [EmailAddress, MaxLength(150)]
        public string? Email { get; set; }
        [Phone, MaxLength(30)]
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
        [Required, MaxLength(150)]
        public string FullName { get; set; } = string.Empty;
        [Required, MinLength(3), MaxLength(50)]
        public string Username { get; set; } = string.Empty;
        [Required, MinLength(6), MaxLength(100)]
        public string Password { get; set; } = string.Empty;
        public int? GroupId { get; set; }
    }

    public class UpdateStudentDto
    {
        [Required, MaxLength(150)]
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
        [Required, MaxLength(100)]
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
        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(500)]
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
        [Range(1, int.MaxValue)] public int EmployeeId { get; set; }
        [Range(1, int.MaxValue)] public int SubjectId { get; set; }
        [Range(1, int.MaxValue)] public int GroupId { get; set; }
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
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        [MaxLength(2000)]
        public string? Description { get; set; }
        [Required]
        public DateTime DueDate { get; set; }
        [Range(1, int.MaxValue)] public int SubjectId { get; set; }
        [Range(1, int.MaxValue)] public int GroupId { get; set; }
        [Range(1, int.MaxValue)] public int EmployeeId { get; set; }
    }

    public class UpdateAssignmentDto
    {
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        [MaxLength(2000)]
        public string? Description { get; set; }
        [Required]
        public DateTime DueDate { get; set; }
        [Range(1, int.MaxValue)] public int SubjectId { get; set; }
        [Range(1, int.MaxValue)] public int GroupId { get; set; }
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
        [Range(1, int.MaxValue)] public int AssignmentId { get; set; }
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
        [Range(1, int.MaxValue)] public int SubmissionId { get; set; }
        [Range(1, int.MaxValue)] public int StudentId { get; set; }
        public int EmployeeId { get; set; }
        [Range(0, 100)] public decimal Value { get; set; }
        [MaxLength(1000)]
        public string? Comment { get; set; }
    }

    public class UpdateGradeDto
    {
        [Range(0, 100)] public decimal Value { get; set; }
        [MaxLength(1000)]
        public string? Comment { get; set; }
    }

    // News
    public class NewsDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsPublished { get; set; }
    }

    public class CreateNewsDto
    {
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        [Required, MaxLength(10000)]
        public string Content { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? ImageUrl { get; set; }
        public bool IsPublished { get; set; } = true;
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
