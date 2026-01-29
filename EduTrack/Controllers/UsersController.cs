using EduTrack.Models;
using EduTrack.Services;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _service;
        public UsersController(UserService service)
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
        public async Task<IActionResult> Post([FromBody] UserModel model)
        {
            var createdUser = await _service.Create(model);
            var routeValue = new { id = createdUser.Id };
            return CreatedAtRoute(routeValue, createdUser);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] UserModel model)
        {
            var updatedUser = await _service.Update(id, model);
            return Ok(updatedUser);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            bool deletedUser = await _service.Delete(id);
            if (deletedUser)
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
