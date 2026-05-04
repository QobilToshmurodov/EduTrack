using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduTrackDataAccess.Repositories.Users
{
    public class UserRepository : IUserRepository
    {
        private readonly EdutrackDbContext _dbContext;

        public UserRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _dbContext.Users.ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _dbContext.Users.FindAsync(id);
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User> CreateAsync(User user)
        {
            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();
            return user;
        }

        public async Task<User> UpdateAsync(int id, User user)
        {
            var existing = await _dbContext.Users.FindAsync(id)
                ?? throw new KeyNotFoundException($"User {id} not found");

            existing.Username = user.Username;
            existing.Role = user.Role;
            if (!string.IsNullOrEmpty(user.PasswordHash))
                existing.PasswordHash = user.PasswordHash;

            await _dbContext.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _dbContext.Users.FindAsync(id);
            if (user is null) return false;
            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
