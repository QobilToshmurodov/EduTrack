using EduTrackDataAccess.Repositories.Subjects;
using EduTrackDataAccess.Entities;
using EduTrack.ViewModels.Subjects;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubjectsController : ControllerBase
    {
        private readonly ISubjectRepository _repository;

        public SubjectsController(ISubjectRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var subjects = await _repository.GetAllSubject();
            var result = subjects.Select(s => new SubjectOptionVm { Id = s.Id, Name = s.Name });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var subject = await _repository.GetSubject(id);
            if (subject == null) return NotFound();
            var vm = new SubjectOptionVm { Id = subject.Id, Name = subject.Name };
            return Ok(vm);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SubjectLookupVm model)
        {
            if (model == null) return BadRequest();
            var entity = new Subject { Name = model.Name };
            var created = await _repository.CreateSubject(entity);
            var vm = new SubjectOptionVm { Id = created.Id, Name = created.Name };
            return CreatedAtAction(nameof(Get), new { id = vm.Id }, vm);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SubjectLookupVm model)
        {
            var existing = await _repository.GetSubject(id);
            if (existing == null) return NotFound();
            existing.Name = model.Name;
            var updated = await _repository.UpdateSubject(id, existing);
            var vm = new SubjectOptionVm { Id = updated.Id, Name = updated.Name };
            return Ok(vm);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _repository.DeleteSubject(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}