using EduTrack.Application.DTOs;
using EduTrack.Application.Interfaces;
using EduTrack.Domain.Entities;
using EduTrack.Domain.Interfaces;

namespace EduTrack.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var users = await _userRepository.GetAllAsync(cancellationToken);
            return users.Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Role = u.Role
            });
        }

        public async Task<UserDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var user = await _userRepository.GetByIdAsync(id, cancellationToken);
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role
            };
        }

        public async Task<UserDto> CreateAsync(UserCreateDto dto, CancellationToken cancellationToken = default)
        {
            var user = new User
            {
                Username = dto.Username,
                PasswordHash = dto.Password, // TODO: Hash password
                Role = dto.Role
            };

            await _userRepository.AddAsync(user, cancellationToken);
            await _userRepository.SaveChangesAsync(cancellationToken);

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role
            };
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var user = await _userRepository.GetByIdAsync(id, cancellationToken);
            if (user == null) return false;

            _userRepository.Delete(user);
            await _userRepository.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
