using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduTrackDataAccess.Repositories.Submissions
{
    public class SubmissionRepository : ISubmissionsRepository
    {
        private readonly EdutrackDbContext _dbContext;

        public SubmissionRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        private IQueryable<Submission> IncludeAll()
        {
            return _dbContext.Submissions
                .Include(s => s.Assignment)
                .Include(s => s.Student)
                .Include(s => s.Grade);
        }

        public async Task<IEnumerable<Submission>> GetAllAsync()
        {
            return await IncludeAll().ToListAsync();
        }

        public async Task<Submission?> GetByIdAsync(int id)
        {
            return await IncludeAll().FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IEnumerable<Submission>> GetByAssignmentIdAsync(int assignmentId)
        {
            return await IncludeAll().Where(s => s.AssignmentId == assignmentId).ToListAsync();
        }

        public async Task<IEnumerable<Submission>> GetByStudentIdAsync(int studentId)
        {
            return await IncludeAll().Where(s => s.StudentId == studentId).ToListAsync();
        }

        public async Task<Submission?> GetByAssignmentAndStudentAsync(int assignmentId, int studentId)
        {
            return await IncludeAll()
                .FirstOrDefaultAsync(s => s.AssignmentId == assignmentId && s.StudentId == studentId);
        }

        public async Task<Submission> CreateAsync(Submission submission)
        {
            await _dbContext.Submissions.AddAsync(submission);
            await _dbContext.SaveChangesAsync();
            return submission;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var submission = await _dbContext.Submissions.FindAsync(id);
            if (submission == null) return false;
            _dbContext.Submissions.Remove(submission);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
