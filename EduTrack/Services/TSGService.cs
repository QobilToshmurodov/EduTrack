using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.TeacherSubjectGroups;

namespace EduTrack.Services
{
    public class TSGService
    {
        private readonly ITeacherSubjectGroupRepository _repository;
        public TSGService(ITeacherSubjectGroupRepository repository )
        {
            _repository = repository;
        }

        public async Task<IEnumerable<TeacherSubjectGroup>> GetTSGAsync()
        {
            return await _repository.GetAllTeacherSubjectGroup();
        }
        public async Task<TeacherSubjectGroup> GetTSGByIdAsync(int id)
        {
            return await _repository.GetTeacherSubjectGroup(id);
        }

        public async Task<TeacherSubjectGroup> CreateTSGAsync(TeacherSubjectGroup model)
        {
            return await _repository.CreateTeacherSubjectGroup(model);
        }

        public async Task<TeacherSubjectGroup> UpdateTSGAsync(int id, TeacherSubjectGroup model)
        {
            var existing = await _repository.GetTeacherSubjectGroup(id);
            if (existing == null) return null;

            existing.SubjectId = model.SubjectId;
            existing.TeacherId = model.TeacherId;
            existing.GroupId = model.GroupId;

            return await _repository.UpdateTeacherSubjectGroup(id, existing);
        }

        public async Task<bool> DeleteTSGAsync(int id)
        {
            return await _repository.DeleteTeacherSubjectGroup(id);
        }
    }
}
