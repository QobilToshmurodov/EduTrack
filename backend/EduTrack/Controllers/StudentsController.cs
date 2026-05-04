using EduTrack.Models;
using EduTrack.Services;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Students;
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
        private readonly IStudentService _service;

        public StudentsController(IStudentRepository repo, IStudentService service)
        {
            _repo = repo;
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _repo.GetAllAsync();
            return Ok(items.Select(MapToDto));
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
            var created = await _service.CreateWithUserAsync(dto);
            return Ok(MapToDto(created));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, UpdateStudentDto dto)
        {
            var entity = new Student
            {
                FullName = dto.FullName,
                GroupId = dto.GroupId
            };
            var updated = await _repo.UpdateAsync(id, entity);
            return Ok(MapToDto(updated));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteWithUserAsync(id);
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
