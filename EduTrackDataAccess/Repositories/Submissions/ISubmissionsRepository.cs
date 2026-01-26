using EduTrackDataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.Submissions
{
    public interface ISubmissionsRepository 
    {
        Task<IEnumerable<Submission>> GetAllSubmission();
        Task<Submission> GetSubmission(int id);
        Task<Submission> CreateSubmission(Submission submission);
        Task<Submission> UpdateSubmission(int id, Submission submission);
        Task<bool> DeleteSubmission(int id);
    }
}
