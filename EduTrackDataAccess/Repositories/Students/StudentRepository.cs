using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.Students
{
    public class StudentRepository : IStudentRepository
    {
        private readonly EdutrackDbContext _dbContext;
        public StudentRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Student> CreateStudent(Student student)
        {
           await _dbContext.Students.AddAsync(student);
            await _dbContext.SaveChangesAsync();
            return student;
        }

        public async Task<bool> DeleteStudent(int id)
        {
            var student= await _dbContext.Students.FindAsync(id);
            if (student != null)
            {
                _dbContext.Students.Remove(student);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<Student>> GetAllStudent()
        {
            return await _dbContext.Students.ToListAsync();
        }

        public async Task<Student> GetStudent(int id)
        {
            return await _dbContext.Students.FindAsync(id);
        }

        public async Task<Student> UpdateStudent(int id, Student student)
        {
            var updatestudent =  _dbContext.Students.Attach(student);
            updatestudent.State =EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return student;
        }
    }
}
