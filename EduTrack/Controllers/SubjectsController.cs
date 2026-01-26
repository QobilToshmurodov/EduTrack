using EduTrack.Services;
using EduTrack.ViewModels.Subjects;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubjectsController : ControllerBase
    {
        private readonly SubjectService _service;

        public SubjectsController(SubjectService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllSubjectsAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var vm = await _service.GetSubjectByIdAsync(id);
            if (vm == null) return NotFound();
            return Ok(vm);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SubjectLookupVm model)
        {
            if (model == null) return BadRequest();
            var vm = await _service.CreateSubjectAsync(model);
            return CreatedAtAction(nameof(Get), new { id = vm.Id }, vm);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SubjectLookupVm model)
        {
            var vm = await _service.UpdateSubjectAsync(id, model);
            if (vm == null) return NotFound();
            return Ok(vm);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteSubjectAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}