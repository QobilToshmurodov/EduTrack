using EduTrack.Models;
using EduTrack.Services;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeachersController : ControllerBase
    {
       private readonly TeacherService _service;

        public TeachersController(TeacherService service)
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
        public async Task<IActionResult> Post([FromBody] TeacherModel model)
        {
            var createdTeacher = await _service.Create(model);
            var routeValue = new { id = createdTeacher.Id };
            return CreatedAtRoute(routeValue, createdTeacher);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] TeacherModel model)
        {
            var updatedTeacher = await _service.Update(id, model);
            return Ok(updatedTeacher);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            bool deletedTeacher = await _service.Delete(id);
            if (deletedTeacher)
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
