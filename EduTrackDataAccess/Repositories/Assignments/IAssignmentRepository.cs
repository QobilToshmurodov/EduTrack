using EduTrackDataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.Assignments
{
    public interface IAssignmentRepository 
    {
        Task<Assignment> GetAssignment(int id);
        Task<IEnumerable<Assignment>> GetAllAssignments();
        Task<Assignment> CreateAssignment(Assignment assignment);
        Task<Assignment> UpdateAssignment(int id, Assignment assignment);
        Task<bool> DeleteAssignment(int id);
    }
}
