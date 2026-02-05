using EduTrack.Models;
using EduTrackDataAccess.Repositories.Users;

namespace EduTrack.Services
{
    public interface IAuthService
    {
        Task<TokenResponseModel> LoginAsync(LoginModel dto);
    }
    public class AuthService : IAuthService
    {
        private readonly IUserReporitory _userRepo;
        private readonly IJWTService _jwtService;

        public AuthService(IUserReporitory userRepo, IJWTService jwtService)
        {
            _userRepo = userRepo;
            _jwtService = jwtService;
        }

        public async Task<TokenResponseModel> LoginAsync(LoginModel dto)
        {
            var user = await _userRepo.GetByUsernameAsync(dto.Username);
            if (user == null)
                throw new Exception("Username yoki parol xato");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new Exception("Username yoki parol xato");

            return new TokenResponseModel
            {
                AccessToken = _jwtService.GenerateToken(user),
                RefreshToken = _jwtService.GenerateRefreshToken()
            };


        }
    }
}
