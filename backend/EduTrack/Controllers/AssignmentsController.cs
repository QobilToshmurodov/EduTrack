using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Assignments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AssignmentsController : ControllerBase
    {
        private readonly IAssignmentRepository _repo;
        private readonly IWebHostEnvironment _env;

        public AssignmentsController(IAssignmentRepository repo, IWebHostEnvironment env)
        {
            _repo = repo;
            _env = env;
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
            var a = await _repo.GetByIdAsync(id);
            if (a == null) return NotFound();
            return Ok(MapToDto(a));
        }

        [HttpGet("by-employee/{employeeId}")]
        public async Task<IActionResult> GetByEmployee(int employeeId)
        {
            var items = await _repo.GetByEmployeeIdAsync(employeeId);
            return Ok(items.Select(MapToDto));
        }

        [HttpGet("by-group/{groupId}")]
        public async Task<IActionResult> GetByGroup(int groupId)
        {
            var items = await _repo.GetByGroupIdAsync(groupId);
            return Ok(items.Select(MapToDto));
        }

        [HttpPost]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> Create(CreateAssignmentDto dto)
        {
            var entity = new Assignment
            {
                Title = dto.Title,
                Description = dto.Description,
                DueDate = dto.DueDate,
                SubjectId = dto.SubjectId,
                GroupId = dto.GroupId,
                EmployeeId = dto.EmployeeId,
                CreatedAt = DateTime.UtcNow
            };
            var created = await _repo.CreateAsync(entity);
            var loaded = await _repo.GetByIdAsync(created.Id);
            return Ok(MapToDto(loaded!));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> Update(int id, UpdateAssignmentDto dto)
        {
            try
            {
                var entity = new Assignment
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    DueDate = dto.DueDate,
                    SubjectId = dto.SubjectId,
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

        [HttpPost("{id}/upload")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> UploadFile(int id, IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("No file uploaded");
            if (file.Length > 5 * 1024 * 1024) return BadRequest("File size exceeds 5MB");

            var assignment = await _repo.GetByIdAsync(id);
            if (assignment == null) return NotFound();

            var uploadsDir = Path.Combine(_env.ContentRootPath, "Uploads", "Assignments");
            Directory.CreateDirectory(uploadsDir);

            var ext = Path.GetExtension(file.FileName);
            var fileName = $"{id}_{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            assignment.FilePath = $"Assignments/{fileName}";
            await _repo.UpdateAsync(id, assignment);

            return Ok(new { filePath = assignment.FilePath });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _repo.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        private static AssignmentDto MapToDto(Assignment a) => new()
        {
            Id = a.Id,
            Title = a.Title,
            Description = a.Description,
            FilePath = a.FilePath,
            DueDate = a.DueDate,
            SubjectId = a.SubjectId,
            SubjectName = a.Subject?.Name ?? "",
            GroupId = a.GroupId,
            GroupName = a.Group?.Name ?? "",
            EmployeeId = a.EmployeeId,
            EmployeeName = a.Employee?.FullName ?? "",
            CreatedAt = a.CreatedAt,
            SubmissionsCount = a.Submissions?.Count ?? 0
        };
    }
}
