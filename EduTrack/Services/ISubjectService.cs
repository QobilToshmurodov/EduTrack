using EduTrackDataAccess.Entities;
using EduTrack.ViewModels.Subjects;

namespace EduTrack.Services
{
    public interface ISubjectService
    {
        Task<IEnumerable<SubjectOptionVm>> GetAllSubjectsAsync();
        Task<SubjectOptionVm> GetSubjectByIdAsync(int id);
        Task<SubjectOptionVm> CreateSubjectAsync(SubjectLookupVm model);
        Task<SubjectOptionVm> UpdateSubjectAsync(int id, SubjectLookupVm model);
        Task<bool> DeleteSubjectAsync(int id);
    }
}
