using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Grades;

namespace EduTrack.Services
{
    public class GradeService :IGenericService<GradeModel>
    {
        private readonly IGradeRepository _repository;
        public GradeService(IGradeRepository repository)
        {
            _repository = repository;
        }
        public async Task<GradeModel> Create(GradeModel model)
        {
            var grades = new Grade
            {
                Id = model.Id,
                SubmissionId = model.SubmissionId,
                TeacherId = model.TeacherId,
                Score = model.Score,

            };
            var createdGrades = await _repository.CreateGrade(grades);
            var result = new GradeModel()
            {
                Id = createdGrades.Id,
                SubmissionId= createdGrades.SubmissionId,
                TeacherId= createdGrades.TeacherId,
                Score = createdGrades.Score,
            };
            return result;
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.DeleteGrade(id);
        }

        public async Task<GradeModel> Get(int id)
        {
            var grades = await _repository.GetGrade(id);
            var model = new GradeModel
            {
                Id = grades.Id,
                SubmissionId= grades.SubmissionId,
                TeacherId= grades.TeacherId,
                Score = grades.Score,
            };
            return model;

        }

        public async Task<IEnumerable<GradeModel>> GetAll()
        {
            var result = new List<GradeModel>();
            var grades = await _repository.GetAllGrade();
            foreach (var grade in grades)
            {
                var model = new GradeModel
                {
                    Id = grade.Id,
                    SubmissionId = grade.SubmissionId,
                    TeacherId = grade.TeacherId,
                    Score = grade.Score,

                };
                result.Add(model);
            }
            return result;
        }

        public async Task<GradeModel> Update(int id, GradeModel model)
        {
            var grades = new Grade
            {
                Id = model.Id,
                SubmissionId= model.SubmissionId,
                TeacherId=model.TeacherId,
                Score = model.Score,
            };
            var updadedGrades = await _repository.UpdateGrade(id, grades);
            var result = new GradeModel
            {
                Id = updadedGrades.Id,
                SubmissionId= updadedGrades.SubmissionId,
                TeacherId= updadedGrades.TeacherId,
                Score= updadedGrades.Score,
            };
            return result;
        }
    }
}
