using EduTrack.Models;
using EduTrackDataAccess;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Students;
using EduTrackDataAccess.Repositories.Users;
using Microsoft.EntityFrameworkCore;

namespace EduTrack.Services
{
    public interface IStudentService
    {
        Task<Student> CreateWithUserAsync(CreateStudentDto dto);
        Task DeleteWithUserAsync(int studentId);
    }

    public class StudentService : IStudentService
    {
        private readonly EdutrackDbContext _db;
        private readonly IUserRepository _userRepo;
        private readonly IStudentRepository _studentRepo;

        public StudentService(EdutrackDbContext db, IUserRepository userRepo, IStudentRepository studentRepo)
        {
            _db = db;
            _userRepo = userRepo;
            _studentRepo = studentRepo;
        }

        public async Task<Student> CreateWithUserAsync(CreateStudentDto dto)
        {
            var existing = await _userRepo.GetByUsernameAsync(dto.Username);
            if (existing != null)
                throw new ConflictException("Username already taken");

            await using var tx = await _db.Database.BeginTransactionAsync();

            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Student"
            };
            var createdUser = await _userRepo.CreateAsync(user);

            var student = new Student
            {
                UserId = createdUser.Id,
                FullName = dto.FullName,
                GroupId = dto.GroupId
            };
            var createdStudent = await _studentRepo.CreateAsync(student);

            await tx.CommitAsync();
            return createdStudent;
        }

        public async Task DeleteWithUserAsync(int studentId)
        {
            var student = await _studentRepo.GetByIdAsync(studentId)
                ?? throw new NotFoundException("Student not found");

            await using var tx = await _db.Database.BeginTransactionAsync();
            await _studentRepo.DeleteAsync(studentId);
            await _userRepo.DeleteAsync(student.UserId);
            await tx.CommitAsync();
        }
    }
}
