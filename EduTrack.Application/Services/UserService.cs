using EduTrack.Application.DTOs;
using EduTrack.Application.Interfaces;
using EduTrack.Domain.Entities;
using EduTrack.Domain.Enums;
using EduTrack.Domain.Interfaces;
using EduTrack.Domain.Interfaces.Common;

namespace EduTrack.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;
        private readonly IStudentRepository _studentRepository;

        public UserService(IUnitOfWork unitOfWork, IUserRepository userRepository, IStudentRepository studentRepository)
        {
            _unitOfWork = unitOfWork;
            _userRepository = userRepository;
            _studentRepository = studentRepository;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var users = await _userRepository.GetAllAsync(false, cancellationToken);
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
            await _unitOfWork.CommitAsync(cancellationToken);

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

            _userRepository.Remove(user);
            await _unitOfWork.CommitAsync(cancellationToken);
            return true;
        }

        // Example of multi-entity creation in one transaction
        public async Task CreateUserWithStudentAsync(UserCreateDto userDto, string fullName, int groupId, CancellationToken cancellationToken = default)
        {
            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            try
            {
                var user = new User
                {
                    Username = userDto.Username,
                    PasswordHash = userDto.Password,
                    Role = UserRole.Student
                };
                await _userRepository.AddAsync(user, cancellationToken);
                await _unitOfWork.CommitAsync(cancellationToken); // Intermediate save to get user.Id

                var student = new Student
                {
                    Id = user.Id,
                    FullName = fullName,
                    GroupId = groupId
                };
                await _studentRepository.AddAsync(student, cancellationToken);

                await _unitOfWork.CommitTransactionAsync(cancellationToken);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw;
            }
        }
    }
}
