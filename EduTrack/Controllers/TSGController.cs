using EduTrack.Models;
using EduTrack.Services;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TSGController : ControllerBase
    { 
        private readonly TSGService _service;
        public TSGController(TSGService service)
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
        public async Task<IActionResult> Post([FromBody] TSGModel model)
        {
            var createdTSG = await _service.Create(model);
            var routeValue = new { id = createdTSG.Id };
            return CreatedAtRoute(routeValue, createdTSG);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] TSGModel model)
        {
            var updatedTSG = await _service.Update(id, model);
            return Ok(updatedTSG);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            bool deletedTSG = await _service.Delete(id);
            if (deletedTSG)
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
