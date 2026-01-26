using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.TeacherSubjectGroups
{
    public class TeacherSubjectGroupRepository : ITeacherSubjectGroupRepository
    {
        private readonly EdutrackDbContext _dbContext;
        public TeacherSubjectGroupRepository(EdutrackDbContext dbContext)
        {
            _dbContext= dbContext;
        }

        public async Task<TeacherSubjectGroup> CreateTeacherSubjectGroup(TeacherSubjectGroup teacherSubjectGroup)
        {
            await _dbContext.TeacherSubjectGroups.AddAsync(teacherSubjectGroup);
            await _dbContext.SaveChangesAsync();
            return teacherSubjectGroup;
        }

        public async Task<bool> DeleteTeacherSubjectGroup(int id)
        {
           var tsg =await _dbContext.TeacherSubjectGroups.FindAsync(id);
            if (tsg != null)
            {
                _dbContext.TeacherSubjectGroups.Remove(tsg);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<TeacherSubjectGroup>> GetAllTeacherSubjectGroup()
        {
           return await _dbContext.TeacherSubjectGroups.ToListAsync();
        }

        public async Task<TeacherSubjectGroup> GetTeacherSubjectGroup(int id)
        {
            return await _dbContext.TeacherSubjectGroups.FindAsync(id);
        }

        public async Task<TeacherSubjectGroup> UpdateTeacherSubjectGroup(int id, TeacherSubjectGroup teacherSubjectGroup)
        {
           var updatetsg = _dbContext.TeacherSubjectGroups.Attach(teacherSubjectGroup);
            updatetsg.State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return teacherSubjectGroup;
        }
    }
}
