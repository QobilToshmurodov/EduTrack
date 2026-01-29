using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.Users
{
    public class UserRepository : IUserReporitory
    {
        private readonly EdutrackDbContext _dbContext;

        public UserRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<User> CreateUser(User user)
        {
            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteUser(int id)
        {
           var user = await _dbContext.Users.FindAsync(id);
            if (user != null)
            {
                _dbContext.Users.Remove(user);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<User>> GetAllUser()
        {
            return await _dbContext.Users.ToListAsync();
        }

        public async Task<User> GetUser(int id)
        {
            return await _dbContext.Users.FindAsync(id);
        }

        public async Task<User> UpdateUser(int id, User user)
        {
            var updateuser= _dbContext.Users.Attach(user);
            updateuser.State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return user;
        }
    }
}
