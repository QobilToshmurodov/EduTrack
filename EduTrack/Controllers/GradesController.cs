using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Grades;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GradesController : ControllerBase
    {
        private readonly IGradeRepository _repo;

        public GradesController(IGradeRepository repo)
        {
            _repo = repo;
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
            var g = await _repo.GetByIdAsync(id);
            if (g == null) return NotFound();
            return Ok(MapToDto(g));
        }

        [HttpPost]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> Create(CreateGradeDto dto)
        {
            var entity = new Grade
            {
                SubmissionId = dto.SubmissionId,
                StudentId = dto.StudentId,
                EmployeeId = dto.EmployeeId,
                Value = dto.Value,
                Comment = dto.Comment,
                GradedAt = DateTime.UtcNow
            };
            var created = await _repo.CreateAsync(entity);
            var loaded = await _repo.GetByIdAsync(created.Id);
            return Ok(MapToDto(loaded!));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> Update(int id, UpdateGradeDto dto)
        {
            try
            {
                var entity = new Grade { Value = dto.Value, Comment = dto.Comment };
                var updated = await _repo.UpdateAsync(id, entity);
                return Ok(MapToDto(updated));
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _repo.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        private static GradeDto MapToDto(Grade g) => new()
        {
            Id = g.Id,
            SubmissionId = g.SubmissionId,
            StudentId = g.StudentId,
            StudentName = g.Student?.FullName ?? "",
            EmployeeId = g.EmployeeId,
            Value = g.Value,
            Comment = g.Comment,
            GradedAt = g.GradedAt
        };
    }
}
