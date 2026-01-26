using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.Assignments
{
    public class AssignmentRepository : IAssignmentRepository
    {
        private readonly EdutrackDbContext _dbContext;

        public AssignmentRepository(EdutrackDbContext dbContext)
        { 
            _dbContext = dbContext; 
        
        }
        public async Task<Assignment> GetAssignment(int id)
        {
            return await _dbContext.Assignments.FindAsync(id);
        }

        public async Task<IEnumerable<Assignment>> GetAllAssignments()
        {
            return await _dbContext.Assignments.ToListAsync();
        }

        public async Task<Assignment> CreateAssignment(Assignment assignment)
        {
            await _dbContext.Assignments.AddAsync(assignment);
            await _dbContext.SaveChangesAsync();

            return assignment;
        }

        public async Task<Assignment> UpdateAssignment(int id, Assignment assignment)
        {
            var updateassignment = _dbContext.Assignments.Attach(assignment);
            updateassignment.State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return assignment;
        }

        public async Task<bool> DeleteAssignment(int id)
        {
            var assignment = await _dbContext.Assignments.FindAsync(id);
            if (assignment != null)
            {
                _dbContext.Assignments.Remove(assignment);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
