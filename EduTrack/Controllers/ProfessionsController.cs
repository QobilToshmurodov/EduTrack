using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Professions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfessionsController : ControllerBase
    {
        private readonly IProfessionRepository _repo;

        public ProfessionsController(IProfessionRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _repo.GetAllAsync();
            var result = items.Select(p => new ProfessionDto
            {
                Id = p.Id,
                Name = p.Name,
                Code = p.Code,
                Description = p.Description,
                GroupsCount = p.Groups.Count
            });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var p = await _repo.GetByIdAsync(id);
            if (p == null) return NotFound();
            return Ok(new ProfessionDto
            {
                Id = p.Id,
                Name = p.Name,
                Code = p.Code,
                Description = p.Description,
                GroupsCount = p.Groups.Count
            });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateProfessionDto dto)
        {
            var entity = new Profession
            {
                Name = dto.Name,
                Code = dto.Code,
                Description = dto.Description
            };
            var created = await _repo.CreateAsync(entity);
            return Ok(new ProfessionDto
            {
                Id = created.Id,
                Name = created.Name,
                Code = created.Code,
                Description = created.Description,
                GroupsCount = 0
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, CreateProfessionDto dto)
        {
            try
            {
                var entity = new Profession
                {
                    Name = dto.Name,
                    Code = dto.Code,
                    Description = dto.Description
                };
                var updated = await _repo.UpdateAsync(id, entity);
                return Ok(new ProfessionDto
                {
                    Id = updated.Id,
                    Name = updated.Name,
                    Code = updated.Code,
                    Description = updated.Description,
                    GroupsCount = updated.Groups?.Count ?? 0
                });
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
            var result = await _repo.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
