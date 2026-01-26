using EduTrackDataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.Teachers
{
    public interface ITeacherReppository 
    {
        Task<IEnumerable<Teacher>> GetAllTeacher();
        Task<Teacher> GetTeacher(int id);
        Task<Teacher> CreateTeacher(Teacher teacher);
        Task<Teacher> UpdateTeacher(int id, Teacher teacher);
        Task<bool> DeleteTeacher(int id);
    }
}
