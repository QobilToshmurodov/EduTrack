using System.Collections.Generic;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;

namespace EduTrackDataAccess.Repositories.Submissions
{
    public interface ISubmissionsRepository
    {
        Task<IEnumerable<Submission>> GetAllAsync();
        Task<Submission?> GetByIdAsync(int id);
        Task<IEnumerable<Submission>> GetByAssignmentIdAsync(int assignmentId);
        Task<IEnumerable<Submission>> GetByStudentIdAsync(int studentId);
        Task<Submission?> GetByAssignmentAndStudentAsync(int assignmentId, int studentId);
        Task<Submission> CreateAsync(Submission submission);
        Task<bool> DeleteAsync(int id);
    }
}
