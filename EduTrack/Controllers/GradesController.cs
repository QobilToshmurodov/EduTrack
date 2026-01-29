using EduTrack.Models;
using EduTrack.Services;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GradesController : ControllerBase
    {
        private readonly GradeService _service;
        public GradesController(GradeService service)
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
        public async Task<IActionResult> Post([FromBody] GradeModel model)
        {
            var createdGrade = await _service.Create(model);
            var routeValue = new { id = createdGrade.Id };
            return CreatedAtRoute(routeValue, createdGrade);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] GradeModel model)
        {
            var updatedGrade = await _service.Update(id, model);
            return Ok(updatedGrade);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            bool deletedGrade = await _service.Delete(id);
            if (deletedGrade)
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
