using EduTrack.Models;
using EduTrack.Services;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceEventsController : ControllerBase
    {
        private readonly AttendanceEventService _service;
        public AttendanceEventsController(AttendanceEventService service)
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
        public async Task<IActionResult> Post([FromBody] AttendanceEventModel model)
        {
            var createdAttendanceEvent = await _service.Create(model);
            var routeValue = new { id = createdAttendanceEvent.Id };
            return CreatedAtRoute(routeValue, createdAttendanceEvent);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] AttendanceEventModel model)
        {
            var updatedAttendanceEvent = await _service.Update(id, model);
            return Ok(updatedAttendanceEvent);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            bool deletedAttendanceEvent = await _service.Delete(id);
            if (deletedAttendanceEvent)
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
