using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Employees;
using EduTrackDataAccess.Repositories.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeRepository _repo;
        private readonly IUserReporitory _userRepo;

        public EmployeesController(IEmployeeRepository repo, IUserReporitory userRepo)
        {
            _repo = repo;
            _userRepo = userRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _repo.GetAllAsync();
            var result = items.Select(e => MapToDto(e));
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return NotFound();
            return Ok(MapToDto(e));
        }

        [HttpGet("by-user/{userId}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var e = await _repo.GetByUserIdAsync(userId);
            if (e == null) return NotFound();
            return Ok(MapToDto(e));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateEmployeeDto dto)
        {
            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Teacher"
            };
            var createdUser = await _userRepo.CreateUser(user);

            var employee = new Employee
            {
                UserId = createdUser.Id,
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                ProfessionId = dto.ProfessionId
            };
            var created = await _repo.CreateAsync(employee);
            return Ok(MapToDto(created));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, UpdateEmployeeDto dto)
        {
            try
            {
                var entity = new Employee
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    ProfessionId = dto.ProfessionId
                };
                var updated = await _repo.UpdateAsync(id, entity);
                return Ok(MapToDto(updated));
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var employee = await _repo.GetByIdAsync(id);
            if (employee == null) return NotFound();
            await _repo.DeleteAsync(id);
            await _userRepo.DeleteUser(employee.UserId);
            return NoContent();
        }

        private static EmployeeDto MapToDto(Employee e) => new()
        {
            Id = e.Id,
            UserId = e.UserId,
            FullName = e.FullName,
            Phone = e.Phone,
            Email = e.Email,
            ProfessionId = e.ProfessionId,
            ProfessionName = e.Profession?.Name
        };
    }
}
