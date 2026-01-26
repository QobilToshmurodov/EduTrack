using EduTrackDataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.TeacherSubjectGroups
{
    public interface ITeacherSubjectGroupRepository 
    {
        Task<IEnumerable<TeacherSubjectGroup>> GetAllTeacherSubjectGroup();
        Task<TeacherSubjectGroup> GetTeacherSubjectGroup(int id);
        Task<TeacherSubjectGroup> CreateTeacherSubjectGroup(TeacherSubjectGroup teacherSubjectGroup);
        Task<TeacherSubjectGroup> UpdateTeacherSubjectGroup(int id, TeacherSubjectGroup teacherSubjectGroup);
        Task<bool> DeleteTeacherSubjectGroup(int id);
    }
}
