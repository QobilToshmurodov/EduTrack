using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.Groups
{
    public class GroupRepository : IGroupsRepository
    {
        private readonly EdutrackDbContext _dbContext;

        public GroupRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Group> CreateGroup(Group group)
        { 
            await _dbContext.AddAsync(group);
            await _dbContext.SaveChangesAsync();
            return group;
            
        }

        public async Task<bool> DeleteGroup(int id)
        {
           var group = await _dbContext.Groups.FindAsync(id);
            if (group != null)
            {
                _dbContext.Groups.Remove(group);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<Group>> GetAllGroup()
        {
            return await _dbContext.Groups.ToListAsync();
        }

        public async Task<Group> GetGroup(int id)
        {
            return await _dbContext.Groups.FindAsync(id);
        }

        public async Task<Group> UpdateGroup(int id, Group group)
        {
            var updategroup = _dbContext.Groups.Attach(group);
            updategroup.State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return group;
        }
    }
}
