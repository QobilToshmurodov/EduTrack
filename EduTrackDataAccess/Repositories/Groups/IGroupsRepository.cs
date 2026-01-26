using EduTrackDataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.Groups
{
    public interface IGroupsRepository 
    {
        Task<IEnumerable<Group>> GetAllGroup();
        Task<Group> GetGroup(int id);
        Task<Group> CreateGroup(Group group);
        Task<Group> UpdateGroup(int id, Group group);
        Task<bool> DeleteGroup(int id);
    }
}
