using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Students;
using EduTrackDataAccess.Repositories.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentRepository _repo;
        private readonly IUserReporitory _userRepo;

        public StudentsController(IStudentRepository repo, IUserReporitory userRepo)
        {
            _repo = repo;
            _userRepo = userRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _repo.GetAllAsync();
            var result = items.Select(s => MapToDto(s));
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var s = await _repo.GetByIdAsync(id);
            if (s == null) return NotFound();
            return Ok(MapToDto(s));
        }

        [HttpGet("by-user/{userId}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var s = await _repo.GetByUserIdAsync(userId);
            if (s == null) return NotFound();
            return Ok(MapToDto(s));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateStudentDto dto)
        {
            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Student"
            };
            var createdUser = await _userRepo.CreateUser(user);

            var student = new Student
            {
                UserId = createdUser.Id,
                FullName = dto.FullName,
                GroupId = dto.GroupId
            };
            var created = await _repo.CreateAsync(student);
            return Ok(MapToDto(created));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, UpdateStudentDto dto)
        {
            try
            {
                var entity = new Student
                {
                    FullName = dto.FullName,
                    GroupId = dto.GroupId
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
            var student = await _repo.GetByIdAsync(id);
            if (student == null) return NotFound();
            await _repo.DeleteAsync(id);
            await _userRepo.DeleteUser(student.UserId);
            return NoContent();
        }

        private static StudentDto MapToDto(Student s) => new()
        {
            Id = s.Id,
            UserId = s.UserId,
            FullName = s.FullName,
            GroupId = s.GroupId,
            GroupName = s.Group?.Name,
            Username = s.User?.Username
        };
    }
}
