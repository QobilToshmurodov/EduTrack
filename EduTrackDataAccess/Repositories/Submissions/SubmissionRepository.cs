using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.Submissions
{
    public class SubmissionRepository : ISubmissionsRepository
    {
        private readonly EdutrackDbContext _dbContext;
        public SubmissionRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Submission> CreateSubmission(Submission submission)
        {
            await _dbContext.AddAsync(submission);
            await _dbContext.SaveChangesAsync();
            return submission;
        }

        public async Task<bool> DeleteSubmission(int id)
        {
            var submission =await _dbContext.Submissions.FindAsync(id);
            if (submission != null)
            {
                _dbContext.Submissions.Remove(submission);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<Submission>> GetAllSubmission()
        {
           return await _dbContext.Submissions.ToListAsync();
        }

        public async Task<Submission> GetSubmission(int id)
        {
            return await _dbContext.Submissions.FindAsync(id);
        }

        public async Task<Submission> UpdateSubmission(int id, Submission submission)
        {
            var updatesubmission = _dbContext.Submissions.Attach(submission);
            updatesubmission.State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return submission;
        }
    }
}
