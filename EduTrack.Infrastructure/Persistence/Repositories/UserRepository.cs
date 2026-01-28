using EduTrack.Domain.Entities;
using EduTrack.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EduTrack.Infrastructure.Persistence.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<User>> GetAllAsync(bool trackChanges = false, CancellationToken cancellationToken = default)
        {
            return await Query(trackChanges)
                .Include(u => u.Student)
                .Include(u => u.Teacher)
                .ToListAsync(cancellationToken);
        }

        public override async Task<User?> GetByIdAsync(object id, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Include(u => u.Student)
                .Include(u => u.Teacher)
                .FirstOrDefaultAsync(u => u.Id == (int)id, cancellationToken);
        }

        public async Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Username == username, cancellationToken);
        }
    }
}
