using EduTrack.Models;
using EduTrack.Services;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParentsController : ControllerBase
    {
        private readonly ParentService _service;
        public ParentsController(ParentService service)
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
        public async Task<IActionResult> Post([FromBody] ParentModel model)
        {
            var createdParent = await _service.Create(model);
            var routeValue = new { id = createdParent.Id };
            return CreatedAtRoute(routeValue, createdParent);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ParentModel model)
        {
            var updatedParent = await _service.Update(id, model);
            return Ok(updatedParent);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            bool deletedParent = await _service.Delete(id);
            if (deletedParent)
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
