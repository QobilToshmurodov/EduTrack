using EduTrackDataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.Students
{
    public interface IStudentRepository 
    {
        Task<IEnumerable<Student>> GetAllStudent();
        Task<Student> GetStudent(int id);
        Task<Student> CreateStudent(Student student);
        Task<Student> UpdateStudent(int id, Student student);
        Task<bool> DeleteStudent(int id);
    }
}
