using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.Teachers
{
    public class TeacherRepository : ITeacherReppository
    {
        private readonly EdutrackDbContext _dbContext;
        public TeacherRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Teacher> CreateTeacher(Teacher teacher)
        {
            await _dbContext.Teachers.AddAsync(teacher);
            await _dbContext.SaveChangesAsync();
            return teacher;
        }

        public async Task<bool> DeleteTeacher(int id)
        {
            var teacher = await _dbContext.Teachers.FindAsync(id);
            if (teacher != null)
            {
                _dbContext.Teachers.Remove(teacher);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<Teacher>> GetAllTeacher()
        {
            return await _dbContext.Teachers.ToListAsync();
        }


        public async Task<Teacher> GetTeacher(int id)
        {
            return await _dbContext.Teachers.FindAsync(id);
        }

        public async Task<Teacher> UpdateTeacher(int id, Teacher teacher)
        {
            var updateteacher = _dbContext.Teachers.Attach(teacher);
            updateteacher.State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return teacher;
        }
    }
}
