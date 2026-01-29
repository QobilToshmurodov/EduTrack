
using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Users;

namespace EduTrack.Services
{
    public class UserService : IGenericService<UserModel>
    {
        private readonly IUserReporitory _repository;
        public UserService(IUserReporitory repository)
        {
            _repository = repository;
        }

        public async Task<UserModel> Create(UserModel model)
        {
            var users = new User
            {
                Id = model.Id,
                Username = model.Username,
                PasswordHash = model.PasswordHash,
                Role = model.Role,

            };
            var createdUsers = await _repository.CreateUser(users);
            var result = new UserModel()
            {
                Id=createdUsers.Id,
                Username=createdUsers.Username,
                PasswordHash=createdUsers.PasswordHash,
                Role=createdUsers.Role,
            };
            return result;
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.DeleteUser(id);
        }

        public async Task<UserModel> Get(int id)
        {
            var users = await _repository.GetUser(id);
            var model = new UserModel
            {
                Id=users.Id,
                Username=users.Username,
                PasswordHash=users.PasswordHash,
                Role=users.Role,

            };
            return model;

        }

        public async Task<IEnumerable<UserModel>> GetAll()
        {
            var result = new List<UserModel>();
            var users = await _repository.GetAllUser();
            foreach (var user in users)
            {
                var model = new UserModel
                {
                    Id = user.Id,
                    Username = user.Username,
                    PasswordHash=user.PasswordHash,
                    Role=user.Role,
                };
                result.Add(model);
            }
            return result;
        }

        public async Task<UserModel> Update(int id, UserModel model)
        {
            var users = new User
            {
                Id = model.Id,
                Username = model.Username,
                PasswordHash=model.PasswordHash,
                Role=model.Role,
            };
            var updadedUsers = await _repository.UpdateUser(id, users);
            var result = new UserModel
            {
                Id = updadedUsers.Id,
                Username = updadedUsers.Username,
                PasswordHash = updadedUsers.PasswordHash,
                Role=updadedUsers.Role,
            };
            return result;
        }
    }
}
