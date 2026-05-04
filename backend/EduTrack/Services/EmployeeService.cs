using EduTrack.Models;
using EduTrackDataAccess;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Employees;
using EduTrackDataAccess.Repositories.Users;
using Microsoft.EntityFrameworkCore;

namespace EduTrack.Services
{
    public interface IEmployeeService
    {
        Task<Employee> CreateWithUserAsync(CreateEmployeeDto dto);
        Task DeleteWithUserAsync(int employeeId);
    }

    public class EmployeeService : IEmployeeService
    {
        private readonly EdutrackDbContext _db;
        private readonly IUserRepository _userRepo;
        private readonly IEmployeeRepository _employeeRepo;

        public EmployeeService(EdutrackDbContext db, IUserRepository userRepo, IEmployeeRepository employeeRepo)
        {
            _db = db;
            _userRepo = userRepo;
            _employeeRepo = employeeRepo;
        }

        public async Task<Employee> CreateWithUserAsync(CreateEmployeeDto dto)
        {
            var existing = await _userRepo.GetByUsernameAsync(dto.Username);
            if (existing != null)
                throw new ConflictException("Username already taken");

            await using var tx = await _db.Database.BeginTransactionAsync();

            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Teacher"
            };
            var createdUser = await _userRepo.CreateAsync(user);

            var employee = new Employee
            {
                UserId = createdUser.Id,
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                ProfessionId = dto.ProfessionId
            };
            var createdEmployee = await _employeeRepo.CreateAsync(employee);

            await tx.CommitAsync();
            return createdEmployee;
        }

        public async Task DeleteWithUserAsync(int employeeId)
        {
            var employee = await _employeeRepo.GetByIdAsync(employeeId)
                ?? throw new NotFoundException("Employee not found");

            await using var tx = await _db.Database.BeginTransactionAsync();
            await _employeeRepo.DeleteAsync(employeeId);
            await _userRepo.DeleteAsync(employee.UserId);
            await tx.CommitAsync();
        }
    }
}
