using System.Collections.Generic;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;

namespace EduTrackDataAccess.Repositories.Employees
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<Employee>> GetAllAsync();
        Task<Employee?> GetByIdAsync(int id);
        Task<Employee?> GetByUserIdAsync(int userId);
        Task<Employee> CreateAsync(Employee employee);
        Task<Employee> UpdateAsync(int id, Employee employee);
        Task<bool> DeleteAsync(int id);
    }
}
