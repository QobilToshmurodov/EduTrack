using System.Collections.Generic;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;

namespace EduTrackDataAccess.Repositories.EmployeeSubjectGroups
{
    public interface IEmployeeSubjectGroupRepository
    {
        Task<IEnumerable<EmployeeSubjectGroup>> GetAllAsync();
        Task<EmployeeSubjectGroup?> GetByIdAsync(int id);
        Task<IEnumerable<EmployeeSubjectGroup>> GetByEmployeeIdAsync(int employeeId);
        Task<EmployeeSubjectGroup> CreateAsync(EmployeeSubjectGroup esg);
        Task<bool> DeleteAsync(int id);
    }
}
