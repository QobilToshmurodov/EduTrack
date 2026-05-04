using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FilesController : ControllerBase
    {
        private static readonly HashSet<string> AllowedFolders = new(StringComparer.OrdinalIgnoreCase)
        {
            "Assignments", "Submissions", "News"
        };

        private readonly IWebHostEnvironment _env;
        private readonly FileExtensionContentTypeProvider _contentTypeProvider = new();

        public FilesController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpGet("{folder}/{filename}")]
        public IActionResult GetFile(string folder, string filename)
        {
            if (!AllowedFolders.Contains(folder))
                return BadRequest("Invalid folder");

            if (string.IsNullOrWhiteSpace(filename) || filename.Contains('/') || filename.Contains('\\') || filename.Contains(".."))
                return BadRequest("Invalid filename");

            var uploadsRoot = Path.GetFullPath(Path.Combine(_env.ContentRootPath, "Uploads"));
            var requestedPath = Path.GetFullPath(Path.Combine(uploadsRoot, folder, filename));

            if (!requestedPath.StartsWith(uploadsRoot + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase))
                return Forbid();

            if (!System.IO.File.Exists(requestedPath))
                return NotFound();

            if (!_contentTypeProvider.TryGetContentType(filename, out var contentType))
                contentType = "application/octet-stream";

            return PhysicalFile(requestedPath, contentType, filename);
        }
    }
}
