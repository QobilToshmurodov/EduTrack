using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Subjects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SubjectsController : ControllerBase
    {
        private readonly ISubjectRepository _repo;

        public SubjectsController(ISubjectRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _repo.GetAllAsync();
            var result = items.Select(s => new SubjectDto { Id = s.Id, Name = s.Name, Description = s.Description });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var s = await _repo.GetByIdAsync(id);
            if (s == null) return NotFound();
            return Ok(new SubjectDto { Id = s.Id, Name = s.Name, Description = s.Description });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateSubjectDto dto)
        {
            var entity = new Subject { Name = dto.Name, Description = dto.Description };
            var created = await _repo.CreateAsync(entity);
            return Ok(new SubjectDto { Id = created.Id, Name = created.Name, Description = created.Description });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, CreateSubjectDto dto)
        {
            var entity = new Subject { Name = dto.Name, Description = dto.Description };
            var updated = await _repo.UpdateAsync(id, entity);
            return Ok(new SubjectDto { Id = updated.Id, Name = updated.Name, Description = updated.Description });
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
