using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.Grades
{
    public class GradeRepository : IGradeRepository
    {
        private readonly EdutrackDbContext _dbContext;
        public GradeRepository (EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<Grade> CreateGrade(Grade grade)
        {
            await _dbContext.Grades.AddAsync(grade);
            await _dbContext.SaveChangesAsync();
            return grade;
        }

        public async Task<bool> DeleteGrade(int id)
        {
            var grade = await _dbContext.Grades.FindAsync(id);
            if (grade != null)
            {
                _dbContext.Grades.Remove(grade);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<Grade>> GetAllGrade()
        {
            return await _dbContext.Grades.ToListAsync();
        }

        public async Task<Grade> GetGrade(int id)
        {
            return await _dbContext.Grades.FindAsync(id);
        }

        public async Task<Grade> UpdateGrade(int id, Grade grade)
        {
            var updategrade = _dbContext.Grades.Attach(grade);
            updategrade.State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return grade;
        }
    }
}
