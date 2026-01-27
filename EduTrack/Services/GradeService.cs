using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Grades;

namespace EduTrack.Services
{
    public class GradeService
    {
        private readonly IGradeRepository _repository;
        public GradeService(IGradeRepository repository)
        {
            _repository = repository;
        }
        public async Task<IEnumerable<Grade>> GetAllGradeAsync()
        {
            return await _repository.GetAllGrade();
        }

        public async Task<Grade> GetGradeByIdAsync(int id)
        {
            return await _repository.GetGrade(id);
        }

        public async Task<Grade> CreateGradeAsync(Grade model)
        {
            return await _repository.CreateGrade(model);
        }

        public async Task<Grade> UpdateGradeAsync(int id, Grade model)
        {
            var existing = await _repository.GetGrade(id);
            if (existing == null) return null;

            existing.SubmissionId = model.SubmissionId;
            existing.TeacherId = model.TeacherId;
            existing.Score = model.Score;

            return await _repository.UpdateGrade(id, existing);
        }

        public async Task<bool> DeleteGradeAsync(int id)
        {
            return await _repository.DeleteGrade(id);
        }
    }
}
