using EduTrack.Models;
using EduTrack.Services;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GroupsController : ControllerBase
    {
        private readonly GroupService _service;
        public GroupsController(GroupService service)
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
        public async Task<IActionResult> Post([FromBody] GroupModel model)
        {
            var createdGroup = await _service.Create(model);
            var routeValue = new { id = createdGroup.Id };
            return CreatedAtRoute(routeValue, createdGroup);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] GroupModel model)
        {
            var updatedGroup = await _service.Update(id, model);
            return Ok(updatedGroup);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            bool deletedGroup = await _service.Delete(id);
            if (deletedGroup)
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
