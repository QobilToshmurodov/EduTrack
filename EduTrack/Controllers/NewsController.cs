using EduTrack.Models;
using EduTrackDataAccess.Repositories.News;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly INewsRepository _repo;
        private readonly IWebHostEnvironment _env;

        public NewsController(INewsRepository repo, IWebHostEnvironment env)
        {
            _repo = repo;
            _env = env;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var items = await _repo.GetAllAsync();
            var result = items.Select(n => new NewsDto
            {
                Id = n.Id,
                Title = n.Title,
                Content = n.Content,
                ImageUrl = n.ImageUrl,
                CreatedDate = n.CreatedDate,
                IsPublished = n.IsPublished
            });
            return Ok(result);
        }

        [HttpGet("latest/{count}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetLatest(int count)
        {
            var items = await _repo.GetLatestAsync(count);
            var result = items.Select(n => new NewsDto
            {
                Id = n.Id,
                Title = n.Title,
                Content = n.Content,
                ImageUrl = n.ImageUrl,
                CreatedDate = n.CreatedDate,
                IsPublished = n.IsPublished
            });
            return Ok(result);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var n = await _repo.GetByIdAsync(id);
            if (n == null) return NotFound();
            return Ok(new NewsDto
            {
                Id = n.Id,
                Title = n.Title,
                Content = n.Content,
                ImageUrl = n.ImageUrl,
                CreatedDate = n.CreatedDate,
                IsPublished = n.IsPublished
            });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateNewsDto dto)
        {
            var entity = new EduTrackDataAccess.Entities.News
            {
                Title = dto.Title,
                Content = dto.Content,
                ImageUrl = dto.ImageUrl,
                IsPublished = dto.IsPublished,
                CreatedDate = DateTime.UtcNow
            };
            var created = await _repo.CreateAsync(entity);
            return Ok(new NewsDto
            {
                Id = created.Id,
                Title = created.Title,
                Content = created.Content,
                ImageUrl = created.ImageUrl,
                CreatedDate = created.CreatedDate,
                IsPublished = created.IsPublished
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, CreateNewsDto dto)
        {
            try
            {
                var entity = new EduTrackDataAccess.Entities.News
                {
                    Title = dto.Title,
                    Content = dto.Content,
                    ImageUrl = dto.ImageUrl,
                    IsPublished = dto.IsPublished
                };
                var updated = await _repo.UpdateAsync(id, entity);
                return Ok(new NewsDto
                {
                    Id = updated.Id,
                    Title = updated.Title,
                    Content = updated.Content,
                    ImageUrl = updated.ImageUrl,
                    CreatedDate = updated.CreatedDate,
                    IsPublished = updated.IsPublished
                });
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _repo.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpPost("upload-image")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Fayl yuklanmadi.");

            var uploadsDir = Path.Combine(_env.ContentRootPath, "Uploads", "News");
            Directory.CreateDirectory(uploadsDir);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsDir, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return Ok(new { imageUrl = $"/Uploads/News/{fileName}" });
        }
    }
}