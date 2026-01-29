using EduTrack.Models;
using EduTrack.Services;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubmissionsController : Controller
    {
      private readonly SubmissionService _service;

        public SubmissionsController(SubmissionService service )
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
        public async Task<IActionResult> Post([FromBody] SubmissionModel model)
        {
            var createdSubmission = await _service.Create(model);
            var routeValue = new { id = createdSubmission.Id };
            return CreatedAtRoute(routeValue, createdSubmission);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] SubmissionModel model)
        {
            var updatedSubmission = await _service.Update(id, model);
            return Ok(updatedSubmission);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            bool deletedSubmission = await _service.Delete(id);
            if (deletedSubmission)
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
