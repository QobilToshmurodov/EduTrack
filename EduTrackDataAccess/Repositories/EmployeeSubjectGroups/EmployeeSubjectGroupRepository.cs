using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduTrackDataAccess.Repositories.EmployeeSubjectGroups
{
    public class EmployeeSubjectGroupRepository : IEmployeeSubjectGroupRepository
    {
        private readonly EdutrackDbContext _dbContext;

        public EmployeeSubjectGroupRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<EmployeeSubjectGroup>> GetAllAsync()
        {
            return await _dbContext.EmployeeSubjectGroups
                .Include(esg => esg.Employee)
                .Include(esg => esg.Subject)
                .Include(esg => esg.Group)
                .ToListAsync();
        }

        public async Task<EmployeeSubjectGroup?> GetByIdAsync(int id)
        {
            return await _dbContext.EmployeeSubjectGroups
                .Include(esg => esg.Employee)
                .Include(esg => esg.Subject)
                .Include(esg => esg.Group)
                .FirstOrDefaultAsync(esg => esg.Id == id);
        }

        public async Task<IEnumerable<EmployeeSubjectGroup>> GetByEmployeeIdAsync(int employeeId)
        {
            return await _dbContext.EmployeeSubjectGroups
                .Include(esg => esg.Employee)
                .Include(esg => esg.Subject)
                .Include(esg => esg.Group)
                .Where(esg => esg.EmployeeId == employeeId)
                .ToListAsync();
        }

        public async Task<EmployeeSubjectGroup> CreateAsync(EmployeeSubjectGroup esg)
        {
            await _dbContext.EmployeeSubjectGroups.AddAsync(esg);
            await _dbContext.SaveChangesAsync();
            return esg;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var esg = await _dbContext.EmployeeSubjectGroups.FindAsync(id);
            if (esg == null) return false;
            _dbContext.EmployeeSubjectGroups.Remove(esg);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
