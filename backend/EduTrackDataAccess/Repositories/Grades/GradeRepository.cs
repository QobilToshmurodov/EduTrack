using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduTrackDataAccess.Repositories.Grades
{
    public class GradeRepository : IGradeRepository
    {
        private readonly EdutrackDbContext _dbContext;

        public GradeRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Grade>> GetAllAsync()
        {
            return await _dbContext.Grades
                .Include(g => g.Submission)
                .Include(g => g.Student)
                .Include(g => g.Employee)
                .ToListAsync();
        }

        public async Task<Grade?> GetByIdAsync(int id)
        {
            return await _dbContext.Grades
                .Include(g => g.Submission)
                .Include(g => g.Student)
                .Include(g => g.Employee)
                .FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task<Grade> CreateAsync(Grade grade)
        {
            await _dbContext.Grades.AddAsync(grade);
            await _dbContext.SaveChangesAsync();
            return grade;
        }

        public async Task<Grade> UpdateAsync(int id, Grade grade)
        {
            var existing = await _dbContext.Grades.FindAsync(id);
            if (existing == null) throw new KeyNotFoundException("Grade not found");
            existing.Value = grade.Value;
            existing.Comment = grade.Comment;
            existing.GradedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var grade = await _dbContext.Grades.FindAsync(id);
            if (grade == null) return false;
            _dbContext.Grades.Remove(grade);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
