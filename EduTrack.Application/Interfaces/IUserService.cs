using EduTrack.Application.DTOs;

namespace EduTrack.Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<UserDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<UserDto> CreateAsync(UserCreateDto dto, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
        Task CreateUserWithStudentAsync(UserCreateDto userDto, string fullName, int groupId, CancellationToken cancellationToken = default);
    }
}
