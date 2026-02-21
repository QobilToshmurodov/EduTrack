using EduTrack.Models;
using EduTrackDataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly EdutrackDbContext _context;

        public DashboardController(EdutrackDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var stats = new DashboardStatsDto
            {
                ProfessionsCount = await _context.Professions.CountAsync(),
                StudentsCount = await _context.Students.CountAsync(),
                EmployeesCount = await _context.Employees.CountAsync(),
                GroupsCount = await _context.Groups.CountAsync(),
                SubjectsCount = await _context.Subjects.CountAsync(),
                AssignmentsCount = await _context.Assignments.CountAsync()
            };
            return Ok(stats);
        }
    }
}
