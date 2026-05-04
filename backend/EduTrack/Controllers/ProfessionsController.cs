using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Professions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfessionsController : ControllerBase
    {
        private readonly IProfessionRepository _repo;

        public ProfessionsController(IProfessionRepository repo)
        {
            _repo = repo;
        }

        // Anonim — landing sahifasi yo'nalishlarni ko'rsatishi uchun ochiq.
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var items = await _repo.GetAllAsync();
            var result = items.Select(MapToDto);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var p = await _repo.GetByIdAsync(id);
            if (p == null) return NotFound();
            return Ok(MapToDto(p));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateProfessionDto dto)
        {
            var entity = new Profession
            {
                Name = dto.Name,
                Code = dto.Code,
                Description = dto.Description,
                DurationYears = dto.DurationYears,
                IconEmoji = dto.IconEmoji
            };
            var created = await _repo.CreateAsync(entity);
            return Ok(MapToDto(created));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, CreateProfessionDto dto)
        {
            var entity = new Profession
            {
                Name = dto.Name,
                Code = dto.Code,
                Description = dto.Description,
                DurationYears = dto.DurationYears,
                IconEmoji = dto.IconEmoji
            };
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

        private static ProfessionDto MapToDto(Profession p) => new()
        {
            Id = p.Id,
            Name = p.Name,
            Code = p.Code,
            Description = p.Description,
            DurationYears = p.DurationYears,
            IconEmoji = p.IconEmoji,
            GroupsCount = p.Groups?.Count ?? 0
        };
    }
}
