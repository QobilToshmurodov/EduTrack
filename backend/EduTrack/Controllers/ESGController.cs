using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.EmployeeSubjectGroups;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ESGController : ControllerBase
    {
        private readonly IEmployeeSubjectGroupRepository _repo;

        public ESGController(IEmployeeSubjectGroupRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _repo.GetAllAsync();
            return Ok(items.Select(MapToDto));
        }

        [HttpGet("by-employee/{employeeId}")]
        public async Task<IActionResult> GetByEmployee(int employeeId)
        {
            var items = await _repo.GetByEmployeeIdAsync(employeeId);
            return Ok(items.Select(MapToDto));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateESGDto dto)
        {
            var entity = new EmployeeSubjectGroup
            {
                EmployeeId = dto.EmployeeId,
                SubjectId = dto.SubjectId,
                GroupId = dto.GroupId
            };
            var created = await _repo.CreateAsync(entity);
            var loaded = await _repo.GetByIdAsync(created.Id);
            return Ok(MapToDto(loaded!));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _repo.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        private static ESGDto MapToDto(EmployeeSubjectGroup e) => new()
        {
            Id = e.Id,
            EmployeeId = e.EmployeeId,
            EmployeeName = e.Employee?.FullName ?? "",
            SubjectId = e.SubjectId,
            SubjectName = e.Subject?.Name ?? "",
            GroupId = e.GroupId,
            GroupName = e.Group?.Name ?? ""
        };
    }
}
