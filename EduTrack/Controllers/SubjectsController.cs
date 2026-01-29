using EduTrack.Models;
using EduTrack.Services;
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
        public async Task<IActionResult> Get()
        {

            return Ok(await _service.GetAll());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            if (id == 0)
                return NotFound($"Data with the given ID: {id} was not found.");

            else if (id < 0)
                return BadRequest("Wrong data.");

            return Ok(await _service.Get(id));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] SubjectModel model)
        {
            var createdSubject = await _service.Create(model);
            var routeValue = new { id = createdSubject.Id };
            return CreatedAtRoute(routeValue, createdSubject);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] SubjectModel model)
        {
            var updatedSubject = await _service.Update(id, model);
            return Ok(updatedSubject);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            bool deletedSubject = await _service.Delete(id);
            if (deletedSubject)
            {
                return NoContent();
            }
            else
            {
                return NotFound();
            }
        }

    }
}
