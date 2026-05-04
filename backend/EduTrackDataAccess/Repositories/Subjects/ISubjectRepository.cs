using System.Collections.Generic;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;

namespace EduTrackDataAccess.Repositories.Subjects
{
    public interface ISubjectRepository
    {
        Task<IEnumerable<Subject>> GetAllAsync();
        Task<Subject?> GetByIdAsync(int id);
        Task<Subject> CreateAsync(Subject subject);
        Task<Subject> UpdateAsync(int id, Subject subject);
        Task<bool> DeleteAsync(int id);
    }
}
