using EduTrack.Application.DTOs;
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

        public async Task<IEnumerable<SubjectDto>> GetAllSubjectsAsync()
        {
            var subjects = await _repository.GetAllSubject();
            return subjects.Select(s => new SubjectDto
            {
                Id = s.Id,
                Name = s.Name
            });
        }

        public async Task<SubjectDto?> GetSubjectByIdAsync(int id)
        {
            var subject = await _repository.GetSubject(id);
            if (subject == null) return null;

            return new SubjectDto
            {
                Id = subject.Id,
                Name = subject.Name
            };
        }

        public async Task<SubjectDto> CreateSubjectAsync(SubjectCreateDto dto)
        {
            var subject = new Subject
            {
                Name = dto.Name
            };

            var created = await _repository.CreateSubject(subject);

            return new SubjectDto
            {
                Id = created.Id,
                Name = created.Name
            };
        }

        public async Task<SubjectDto?> UpdateSubjectAsync(int id, SubjectUpdateDto dto)
        {
            var existing = await _repository.GetSubject(id);
            if (existing == null) return null;

            existing.Name = dto.Name;

            var updated = await _repository.UpdateSubject(id, existing);

            return new SubjectDto
            {
                Id = updated.Id,
                Name = updated.Name
            };
        }

        public async Task<bool> DeleteSubjectAsync(int id)
        {
            return await _repository.DeleteSubject(id);
        }
    }
}
