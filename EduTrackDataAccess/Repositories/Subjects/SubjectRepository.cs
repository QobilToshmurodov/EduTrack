using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.Subjects
{
    public class SubjectRepository : ISubjectRepository
    {
        private readonly EdutrackDbContext _dbContext;
        public SubjectRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Subject> CreateSubject(Subject subject)
        {
            await _dbContext.AddAsync(subject);
            await _dbContext.SaveChangesAsync();
            return subject;
        }

        public async Task<bool> DeleteSubject(int id)
        {
            var subject = await _dbContext.Subjects.FindAsync(id);
            if (subject != null)
            {
                _dbContext.Subjects.Remove(subject);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<Subject>> GetAllSubject()
        {
            return await _dbContext.Subjects.ToListAsync();
        }

        public async Task<Subject> GetSubject(int id)
        {
            return await _dbContext.Subjects.FindAsync(id);
        }

        public async Task<Subject> UpdateSubject(int id, Subject subject)
        {
            var updatesubject = _dbContext.Subjects.Attach(subject);
             updatesubject.State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return subject;
        }
    }
}
