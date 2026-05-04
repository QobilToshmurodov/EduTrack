using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Groups;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GroupsController : ControllerBase
    {
        private readonly IGroupsRepository _repo;

        public GroupsController(IGroupsRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _repo.GetAllAsync();
            var result = items.Select(g => MapToDto(g));
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var g = await _repo.GetByIdAsync(id);
            if (g == null) return NotFound();
            return Ok(MapToDto(g));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateGroupDto dto)
        {
            var entity = new Group { Name = dto.Name, ProfessionId = dto.ProfessionId };
            var created = await _repo.CreateAsync(entity);
            return Ok(MapToDto(created));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, CreateGroupDto dto)
        {
            var entity = new Group { Name = dto.Name, ProfessionId = dto.ProfessionId };
            var updated = await _repo.UpdateAsync(id, entity);
            return Ok(MapToDto(updated));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _repo.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        private static GroupDto MapToDto(Group g) => new()
        {
            Id = g.Id,
            Name = g.Name,
            ProfessionId = g.ProfessionId,
            ProfessionName = g.Profession?.Name,
            StudentsCount = g.Students?.Count ?? 0
        };
    }
}
