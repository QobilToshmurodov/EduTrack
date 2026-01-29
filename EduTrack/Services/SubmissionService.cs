using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Subjects;
using EduTrackDataAccess.Repositories.Submissions;

namespace EduTrack.Services
{
    public class SubmissionService : IGenericService<SubmissionModel>
    {
        private readonly ISubmissionsRepository _repository;

        public SubmissionService(ISubmissionsRepository repository)
        {
            _repository = repository;
        }
        public async Task<SubmissionModel> Create(SubmissionModel model)
        {
            var submissions = new Submission
            {
                Id = model.Id,
                AssignmentId = model.AssignmentId,
                StudentId = model.StudentId,
                FileUrl = model.FileUrl,

            };
            var createdSubmissions = await _repository.CreateSubmission(submissions);
            var result = new SubmissionModel()
            {
                Id = createdSubmissions.Id,
                AssignmentId= createdSubmissions.AssignmentId,
                StudentId= createdSubmissions.StudentId,
                FileUrl= createdSubmissions.FileUrl,
            };
            return result;
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.DeleteSubmission(id);
        }

        public async Task<SubmissionModel> Get(int id)
        {
            var submissions = await _repository.GetSubmission(id);
            var model = new SubmissionModel
            {
                Id = submissions.Id,
                AssignmentId=submissions.AssignmentId,
                StudentId=submissions.StudentId,
                FileUrl=submissions.FileUrl,
            };
            return model;

        }

        public async Task<IEnumerable<SubmissionModel>> GetAll()
        {
            var result = new List<SubmissionModel>();
            var submissions = await _repository.GetAllSubmission();
            foreach (var submission in submissions)
            {
                var model = new SubmissionModel
                {
                    Id = submission.Id,
                    AssignmentId = submission.AssignmentId,
                    StudentId=submission.StudentId,
                    FileUrl=submission.FileUrl,

                };
                result.Add(model);
            }
            return result;
        }

        public async Task<SubmissionModel> Update(int id, SubmissionModel model)
        {
            var Submissions = new Submission
            {
                Id = model.Id,
                AssignmentId = model.AssignmentId,
                StudentId = model.StudentId,
                FileUrl = model.FileUrl,
            };
            var updadedSubmissions = await _repository.UpdateSubmission(id, Submissions);
            var result = new SubmissionModel
            {
                Id = updadedSubmissions.Id,
                AssignmentId=updadedSubmissions.AssignmentId,
                StudentId=updadedSubmissions.StudentId,
                FileUrl=updadedSubmissions.FileUrl,
            };
            return result;
        }
    }
}
