using EduTrack.Models;
using EduTrackDataAccess.Repositories.Users;
using EduTrackDataAccess.Repositories.Employees;
using EduTrackDataAccess.Repositories.Students;

namespace EduTrack.Services
{
    public interface IAuthService
    {
        Task<LoginResponseModel> LoginAsync(LoginModel dto);
    }

    public class AuthService : IAuthService
    {
        private readonly IUserReporitory _userRepo;
        private readonly IJWTService _jwtService;
        private readonly IEmployeeRepository _employeeRepo;
        private readonly IStudentRepository _studentRepo;

        public AuthService(IUserReporitory userRepo, IJWTService jwtService,
            IEmployeeRepository employeeRepo, IStudentRepository studentRepo)
        {
            _userRepo = userRepo;
            _jwtService = jwtService;
            _employeeRepo = employeeRepo;
            _studentRepo = studentRepo;
        }

        public async Task<LoginResponseModel> LoginAsync(LoginModel dto)
        {
            var user = await _userRepo.GetByUsernameAsync(dto.Username);
            if (user == null)
                throw new Exception("Username yoki parol xato");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new Exception("Username yoki parol xato");

            int? profileId = null;
            if (user.Role == "Teacher")
            {
                var employee = await _employeeRepo.GetByUserIdAsync(user.Id);
                profileId = employee?.Id;
            }
            else if (user.Role == "Student")
            {
                var student = await _studentRepo.GetByUserIdAsync(user.Id);
                profileId = student?.Id;
            }

            return new LoginResponseModel
            {
                Token = _jwtService.GenerateToken(user),
                Role = user.Role,
                UserId = user.Id,
                ProfileId = profileId
            };
        }
    }
}
