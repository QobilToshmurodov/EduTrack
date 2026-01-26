using EduTrackDataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.Subjects
{
    public interface ISubjectRepository 
    {
        Task<IEnumerable<Subject>> GetAllSubject();
        Task<Subject> GetSubject(int id);
        Task<Subject> CreateSubject(Subject subject);
        Task<Subject> UpdateSubject(int id, Subject subject);
        Task<bool> DeleteSubject(int id);
    }
}
