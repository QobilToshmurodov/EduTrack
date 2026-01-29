using EduTrack.Models;
using EduTrack.Services;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationLogsController : ControllerBase
    {
        private readonly NotificationLogService _service;
        public NotificationLogsController(NotificationLogService service)
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
        public async Task<IActionResult> Post([FromBody] NotificationLogModel model)
        {
            var createdNotificationLog = await _service.Create(model);
            var routeValue = new { id = createdNotificationLog.Id };
            return CreatedAtRoute(routeValue, createdNotificationLog);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] NotificationLogModel model)
        {
            var updatedNotificationLog = await _service.Update(id, model);
            return Ok(updatedNotificationLog);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            bool deletedNotificationLog = await _service.Delete(id);
            if (deletedNotificationLog)
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
