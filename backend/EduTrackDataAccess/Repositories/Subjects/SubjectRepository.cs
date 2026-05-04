using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduTrackDataAccess.Repositories.Subjects
{
    public class SubjectRepository : ISubjectRepository
    {
        private readonly EdutrackDbContext _dbContext;

        public SubjectRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Subject>> GetAllAsync()
        {
            return await _dbContext.Subjects.ToListAsync();
        }

        public async Task<Subject?> GetByIdAsync(int id)
        {
            return await _dbContext.Subjects.FindAsync(id);
        }

        public async Task<Subject> CreateAsync(Subject subject)
        {
            await _dbContext.Subjects.AddAsync(subject);
            await _dbContext.SaveChangesAsync();
            return subject;
        }

        public async Task<Subject> UpdateAsync(int id, Subject subject)
        {
            var existing = await _dbContext.Subjects.FindAsync(id);
            if (existing == null) throw new KeyNotFoundException("Subject not found");
            existing.Name = subject.Name;
            existing.Description = subject.Description;
            await _dbContext.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var subject = await _dbContext.Subjects.FindAsync(id);
            if (subject == null) return false;
            _dbContext.Subjects.Remove(subject);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
