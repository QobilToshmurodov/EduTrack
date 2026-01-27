
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Users;

namespace EduTrack.Services
{
    public class UserService
    {
        private readonly IUserReporitory _repository;
        public UserService(IUserReporitory repository)
        {
            _repository = repository;
        }
        
        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await _repository.GetAllUser();
        }
        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _repository.GetUser(id);
        }

        public async Task<User> CreateUserAsync(User model)
        {
            return await _repository.CreateUser(model);
        }

        public async Task<User> UpdateUserAsync(int id, User model)
        {
            var existing = await _repository.GetUser(id);
            if (existing == null) return null;

            existing.Username = model.Username;
            existing.Role = model.Role;
            existing.PasswordHash = model.PasswordHash;

            return await _repository.UpdateUser(id, existing);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            return await _repository.DeleteUser(id);
        }
    }
}
