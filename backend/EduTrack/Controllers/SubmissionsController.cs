using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Submissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SubmissionsController : ControllerBase
    {
        private readonly ISubmissionsRepository _repo;
        private readonly IWebHostEnvironment _env;

        public SubmissionsController(ISubmissionsRepository repo, IWebHostEnvironment env)
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

        [HttpGet("by-assignment/{assignmentId}")]
        public async Task<IActionResult> GetByAssignment(int assignmentId)
        {
            var items = await _repo.GetByAssignmentIdAsync(assignmentId);
            return Ok(items.Select(MapToDto));
        }

        [HttpGet("by-student/{studentId}")]
        public async Task<IActionResult> GetByStudent(int studentId)
        {
            var items = await _repo.GetByStudentIdAsync(studentId);
            return Ok(items.Select(MapToDto));
        }

        [HttpPost]
        [Authorize(Roles = "Student,Admin")]
        public async Task<IActionResult> Create([FromForm] int assignmentId, [FromForm] int studentId, [FromForm] string? description, IFormFile? file)
        {
            var existing = await _repo.GetByAssignmentAndStudentAsync(assignmentId, studentId);
            if (existing != null) return BadRequest("Already submitted");

            string? filePath = null;
            if (file != null && file.Length > 0)
            {
                var uploadsDir = Path.Combine(_env.ContentRootPath, "Uploads", "Submissions");
                Directory.CreateDirectory(uploadsDir);

                var ext = Path.GetExtension(file.FileName);
                var fileName = $"{assignmentId}_{studentId}_{Guid.NewGuid()}{ext}";
                var fullPath = Path.Combine(uploadsDir, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                filePath = $"Submissions/{fileName}";
            }

            var submission = new Submission
            {
                AssignmentId = assignmentId,
                StudentId = studentId,
                Description = description,
                FilePath = filePath,
                SubmittedAt = DateTime.UtcNow
            };
            var created = await _repo.CreateAsync(submission);
            var loaded = await _repo.GetByIdAsync(created.Id);
            return Ok(MapToDto(loaded!));
        }

        private static SubmissionDto MapToDto(Submission s) => new()
        {
            Id = s.Id,
            AssignmentId = s.AssignmentId,
            AssignmentTitle = s.Assignment?.Title ?? "",
            StudentId = s.StudentId,
            StudentName = s.Student?.FullName ?? "",
            Description = s.Description,
            FilePath = s.FilePath,
            SubmittedAt = s.SubmittedAt,
            Grade = s.Grade != null ? new GradeDto
            {
                Id = s.Grade.Id,
                SubmissionId = s.Grade.SubmissionId,
                StudentId = s.Grade.StudentId,
                StudentName = s.Student?.FullName ?? "",
                EmployeeId = s.Grade.EmployeeId,
                Value = s.Grade.Value,
                Comment = s.Grade.Comment,
                GradedAt = s.Grade.GradedAt
            } : null
        };
    }
}
