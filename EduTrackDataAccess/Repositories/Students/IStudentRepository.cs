using System.Collections.Generic;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;

namespace EduTrackDataAccess.Repositories.Students
{
    public interface IStudentRepository
    {
        Task<IEnumerable<Student>> GetAllAsync();
        Task<Student?> GetByIdAsync(int id);
        Task<Student?> GetByUserIdAsync(int userId);
        Task<IEnumerable<Student>> GetByGroupIdAsync(int groupId);
        Task<Student> CreateAsync(Student student);
        Task<Student> UpdateAsync(int id, Student student);
        Task<bool> DeleteAsync(int id);
    }
}
