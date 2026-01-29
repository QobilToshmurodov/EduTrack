using EduTrack.Models;
using EduTrack.Services;
using EduTrackDataAccess;
using EduTrackDataAccess.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.EntityFrameworkCore;

namespace EduTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly EdutrackDbContext _context;
        private readonly IJWTService _jwtService;

        public AuthController(EdutrackDbContext context, IJWTService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        // REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterModel dto)
        {
            var exists = await _context.Users
                .AnyAsync(x => x.Username == dto.Username);

            if (exists)
                return BadRequest("Username already exists");

            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "User"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Registered successfully");
        }

        // LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Username == dto.Username);

            if (user == null)
                return Unauthorized("Invalid username or password");

            var valid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!valid)
                return Unauthorized("Invalid username or password");

            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                token,
                user.Id,
                user.Username,
                user.Role
            });
        }
    }
}
