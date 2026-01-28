using EduTrack.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EduTrack.Infrastructure.Persistence.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public virtual IQueryable<T> Query(bool trackChanges = false)
        {
            return trackChanges ? _dbSet : _dbSet.AsNoTracking();
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync(bool trackChanges = false, CancellationToken cancellationToken = default)
        {
            return await Query(trackChanges).ToListAsync(cancellationToken);
        }

        public virtual async Task<T?> GetByIdAsync(object id, CancellationToken cancellationToken = default)
        {
            return await _dbSet.FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task AddAsync(T entity, CancellationToken cancellationToken = default)
        {
            await _dbSet.AddAsync(entity, cancellationToken);
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public virtual void Remove(T entity)
        {
            _dbSet.Remove(entity);
        }
    }

    public class GenericRepository<T> : Repository<T>, IRepository<T> where T : class
    {
        public GenericRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
