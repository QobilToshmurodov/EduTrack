using EduTrack.Models;
using EduTrack.Services;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Employees;
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
        private readonly IEmployeeService _service;

        public EmployeesController(IEmployeeRepository repo, IEmployeeService service)
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
            var created = await _service.CreateWithUserAsync(dto);
            return Ok(MapToDto(created));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, UpdateEmployeeDto dto)
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

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteWithUserAsync(id);
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
