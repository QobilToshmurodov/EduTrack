using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduTrackDataAccess.Repositories.Assignments
{
    public class AssignmentRepository : IAssignmentRepository
    {
        private readonly EdutrackDbContext _dbContext;

        public AssignmentRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        private IQueryable<Assignment> IncludeAll()
        {
            return _dbContext.Assignments
                .Include(a => a.Subject)
                .Include(a => a.Group)
                .Include(a => a.Employee)
                .Include(a => a.Submissions);
        }

        public async Task<IEnumerable<Assignment>> GetAllAsync()
        {
            return await IncludeAll().ToListAsync();
        }

        public async Task<Assignment?> GetByIdAsync(int id)
        {
            return await IncludeAll().FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<IEnumerable<Assignment>> GetByEmployeeIdAsync(int employeeId)
        {
            return await IncludeAll().Where(a => a.EmployeeId == employeeId).ToListAsync();
        }

        public async Task<IEnumerable<Assignment>> GetByGroupIdAsync(int groupId)
        {
            return await IncludeAll().Where(a => a.GroupId == groupId).ToListAsync();
        }

        public async Task<Assignment> CreateAsync(Assignment assignment)
        {
            await _dbContext.Assignments.AddAsync(assignment);
            await _dbContext.SaveChangesAsync();
            return assignment;
        }

        public async Task<Assignment> UpdateAsync(int id, Assignment assignment)
        {
            var existing = await _dbContext.Assignments.FindAsync(id);
            if (existing == null) throw new KeyNotFoundException("Assignment not found");
            existing.Title = assignment.Title;
            existing.Description = assignment.Description;
            existing.DueDate = assignment.DueDate;
            existing.SubjectId = assignment.SubjectId;
            existing.GroupId = assignment.GroupId;
            await _dbContext.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var assignment = await _dbContext.Assignments.FindAsync(id);
            if (assignment == null) return false;
            _dbContext.Assignments.Remove(assignment);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
