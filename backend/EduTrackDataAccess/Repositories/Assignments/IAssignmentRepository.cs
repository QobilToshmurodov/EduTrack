using System.Collections.Generic;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;

namespace EduTrackDataAccess.Repositories.Assignments
{
    public interface IAssignmentRepository
    {
        Task<IEnumerable<Assignment>> GetAllAsync();
        Task<Assignment?> GetByIdAsync(int id);
        Task<IEnumerable<Assignment>> GetByEmployeeIdAsync(int employeeId);
        Task<IEnumerable<Assignment>> GetByGroupIdAsync(int groupId);
        Task<Assignment> CreateAsync(Assignment assignment);
        Task<Assignment> UpdateAsync(int id, Assignment assignment);
        Task<bool> DeleteAsync(int id);
    }
}
