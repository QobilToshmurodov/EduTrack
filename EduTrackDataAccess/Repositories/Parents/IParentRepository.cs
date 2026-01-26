using EduTrackDataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.Parents
{
    public interface IParentRepository 
    {
        Task<IEnumerable<Parent>> GetAllParent();
        Task<Parent> GetParent(int id);
        Task<Parent> CreateParent(Parent parent);
        Task<Parent> UpdateParent(int id, Parent parent);
        Task<bool> DeleteParent(int id);
    }
}
