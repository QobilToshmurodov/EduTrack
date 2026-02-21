using System.Collections.Generic;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;

namespace EduTrackDataAccess.Repositories.Groups
{
    public interface IGroupsRepository
    {
        Task<IEnumerable<Group>> GetAllAsync();
        Task<Group?> GetByIdAsync(int id);
        Task<Group> CreateAsync(Group group);
        Task<Group> UpdateAsync(int id, Group group);
        Task<bool> DeleteAsync(int id);
    }
}
