using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Subjects;
using EduTrackDataAccess.Repositories.Submissions;

namespace EduTrack.Services
{
    public class SubmissionService
    {
        private readonly ISubmissionsRepository _repository;

        public SubmissionService(ISubmissionsRepository repository)
        {
            _repository = repository;
        }
        public async Task<IEnumerable<Submission>> GetSubmissionAsync()
        {
            return await _repository.GetAllSubmission();
        }
        public async Task<Submission> GetSubmissionByIdAsync(int id)
        {
            return await _repository.GetSubmission(id);
        }

        public async Task<Submission> CreateSubmissionAsync(Submission model)
        {
            return await _repository.CreateSubmission(model);
        }

        public async Task<Submission> UpdateSubmissionAsync(int id, Submission model)
        {
            var existing = await _repository.GetSubmission(id);
            if (existing == null) return null;

            existing.AssignmentId = model.AssignmentId;
            existing.StudentId = model.StudentId;
            existing.FileUrl = model.FileUrl;

            return await _repository.UpdateSubmission(id, existing);
        }

        public async Task<bool> DeleteSubmissionAsync(int id)
        {
            return await _repository.DeleteSubmission(id);
        }
    }
}
