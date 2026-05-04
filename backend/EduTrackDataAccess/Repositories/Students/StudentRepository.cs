using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduTrackDataAccess.Repositories.Students
{
    public class StudentRepository : IStudentRepository
    {
        private readonly EdutrackDbContext _dbContext;

        public StudentRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Student>> GetAllAsync()
        {
            return await _dbContext.Students
                .Include(s => s.Group)
                .Include(s => s.User)
                .ToListAsync();
        }

        public async Task<Student?> GetByIdAsync(int id)
        {
            return await _dbContext.Students
                .Include(s => s.Group)
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Student?> GetByUserIdAsync(int userId)
        {
            return await _dbContext.Students
                .Include(s => s.Group)
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.UserId == userId);
        }

        public async Task<IEnumerable<Student>> GetByGroupIdAsync(int groupId)
        {
            return await _dbContext.Students
                .Include(s => s.Group)
                .Include(s => s.User)
                .Where(s => s.GroupId == groupId)
                .ToListAsync();
        }

        public async Task<Student> CreateAsync(Student student)
        {
            await _dbContext.Students.AddAsync(student);
            await _dbContext.SaveChangesAsync();
            return student;
        }

        public async Task<Student> UpdateAsync(int id, Student student)
        {
            var existing = await _dbContext.Students.FindAsync(id);
            if (existing == null) throw new KeyNotFoundException("Student not found");
            existing.FullName = student.FullName;
            existing.GroupId = student.GroupId;
            await _dbContext.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var student = await _dbContext.Students.FindAsync(id);
            if (student == null) return false;
            _dbContext.Students.Remove(student);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
