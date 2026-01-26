using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.Parents
{
    public class ParentRepository : IParentRepository
    {
        private readonly EdutrackDbContext _dbContext;
        public ParentRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Parent> CreateParent(Parent parent)
        {
            await _dbContext.AddAsync(parent);
            await _dbContext.SaveChangesAsync();
            return parent;
        }

        public async Task<bool> DeleteParent(int id)
        {
            var parent = await _dbContext.Parents.FindAsync(id);
            if (parent != null)
            {
                _dbContext.Parents.Remove(parent);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<Parent>> GetAllParent()
        {
            return await _dbContext.Parents.ToListAsync();
        }

        public async Task<Parent> GetParent(int id)
        {
            return await _dbContext.Parents.FindAsync(id);
        }

        public async Task<Parent> UpdateParent(int id, Parent parent)
        {
            var updateparent = _dbContext.Parents.Attach(parent);
            updateparent.State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return parent;
        }
    }
}
