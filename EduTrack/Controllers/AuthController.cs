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
        private readonly IAuthService _authService;

        public AuthController(EdutrackDbContext context, IJWTService jwtService, IAuthService authService)
        {
            _context = context;
            _jwtService = jwtService;
            _authService = authService;
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
