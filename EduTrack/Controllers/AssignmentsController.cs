using EduTrack.Models;
using EduTrack.Services;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssignmentsController : ControllerBase
    {
        private readonly AssignmentService _service;
        public AssignmentsController(AssignmentService service)
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
        public async Task<IActionResult> Post([FromBody] AssignmentModel model)
        {
            var createdAssignment = await _service.Create(model);
            var routeValue = new { id = createdAssignment.Id };
            return CreatedAtRoute(routeValue, createdAssignment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] AssignmentModel model)
        {
            var updatedAssignment = await _service.Update(id, model);
            return Ok(updatedAssignment);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            bool deletedAssignment = await _service.Delete(id);
            if (deletedAssignment)
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
