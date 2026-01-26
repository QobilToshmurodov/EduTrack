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

        public async Task<IEnumerable<Subject>> GetAllSubjectsAsync()
        {
            return await _repository.GetAllSubject();
        }

        public async Task<Subject> GetSubjectByIdAsync(int id)
        {
            return await _repository.GetSubject(id);
        }

        public async Task<Subject> CreateSubjectAsync(Subject model)
        {
            return await _repository.CreateSubject(model);
        }

        public async Task<Subject> UpdateSubjectAsync(int id, Subject model)
        {
            var existing = await _repository.GetSubject(id);
            if (existing == null) return null;

            existing.Name = model.Name;
            // Shartga ko'ra boshqa propertylarni ham yangilash mumkin bo'lsa qo'shish kerak.
            // Hozircha faqat Name yangilanmoqda.

            return await _repository.UpdateSubject(id, existing);
        }

        public async Task<bool> DeleteSubjectAsync(int id)
        {
            return await _repository.DeleteSubject(id);
        }
    }
}
