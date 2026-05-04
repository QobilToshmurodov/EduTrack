using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduTrackDataAccess.Repositories.Groups
{
    public class GroupRepository : IGroupsRepository
    {
        private readonly EdutrackDbContext _dbContext;

        public GroupRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Group>> GetAllAsync()
        {
            return await _dbContext.Groups
                .Include(g => g.Profession)
                .Include(g => g.Students)
                .ToListAsync();
        }

        public async Task<Group?> GetByIdAsync(int id)
        {
            return await _dbContext.Groups
                .Include(g => g.Profession)
                .Include(g => g.Students)
                .FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task<Group> CreateAsync(Group group)
        {
            await _dbContext.Groups.AddAsync(group);
            await _dbContext.SaveChangesAsync();
            return group;
        }

        public async Task<Group> UpdateAsync(int id, Group group)
        {
            var existing = await _dbContext.Groups.FindAsync(id);
            if (existing == null) throw new Exception("Group not found");
            existing.Name = group.Name;
            existing.ProfessionId = group.ProfessionId;
            await _dbContext.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var group = await _dbContext.Groups.FindAsync(id);
            if (group == null) return false;
            _dbContext.Groups.Remove(group);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
