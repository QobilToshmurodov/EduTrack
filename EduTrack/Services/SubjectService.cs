using EduTrack.ViewModels.Subjects;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Subjects;

namespace EduTrack.Services
{
    public class SubjectService
    {
        private readonly ISubjectRepository _repository;

        public SubjectService(ISubjectRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<SubjectOptionVm>> GetAllSubjectsAsync()
        {
            var subjects = await _repository.GetAllSubject();
            return subjects.Select(s => new SubjectOptionVm { Id = s.Id, Name = s.Name });
        }

        public async Task<SubjectOptionVm> GetSubjectByIdAsync(int id)
        {
            var subject = await _repository.GetSubject(id);
            if (subject == null) return null;
            return new SubjectOptionVm { Id = subject.Id, Name = subject.Name };
        }

        public async Task<SubjectOptionVm> CreateSubjectAsync(SubjectLookupVm model)
        {
            var entity = new Subject { Name = model.Name };
            var created = await _repository.CreateSubject(entity);
            return new SubjectOptionVm { Id = created.Id, Name = created.Name };
        }

        public async Task<SubjectOptionVm> UpdateSubjectAsync(int id, SubjectLookupVm model)
        {
            var existing = await _repository.GetSubject(id);
            if (existing == null) return null;

            existing.Name = model.Name;
            var updated = await _repository.UpdateSubject(id, existing);
            return new SubjectOptionVm { Id = updated.Id, Name = updated.Name };
        }

        public async Task<bool> DeleteSubjectAsync(int id)
        {
            return await _repository.DeleteSubject(id);
        }
    }
}
