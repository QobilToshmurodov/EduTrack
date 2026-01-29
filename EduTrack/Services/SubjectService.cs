using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Subjects;

namespace EduTrack.Services
{
    public class SubjectService :IGenericService<SubjectModel>
    {
        private readonly ISubjectRepository _repository;

        public SubjectService(ISubjectRepository repository)
        {
            _repository = repository;
        }

        public async Task<SubjectModel> Create(SubjectModel model)
        {
            var subjects = new Subject
            {
                Id = model.Id,
                Name = model.Name,

            };
            var createdSubjects = await _repository.CreateSubject(subjects);
            var result = new SubjectModel()
            {
                Id = createdSubjects.Id,
                Name= createdSubjects.Name,
            };
            return result;
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.DeleteSubject(id);
        }

        public async Task<SubjectModel> Get(int id)
        {
            var subjects = await _repository.GetSubject(id);
            var model = new SubjectModel
            {
                Id = subjects.Id,
                Name = subjects.Name,
            };
            return model;

        }

        public async Task<IEnumerable<SubjectModel>> GetAll()
        {
            var result = new List<SubjectModel>();
            var subjects = await _repository.GetAllSubject();
            foreach (var subject in subjects)
            {
                var model = new SubjectModel
                {
                    Id = subject.Id,
                    Name = subject.Name,

                };
                result.Add(model);
            }
            return result;
        }

        public async Task<SubjectModel> Update(int id, SubjectModel model)
        {
            var subjects = new Subject
            {
                Id = model.Id,
               Name = model.Name,
            };
            var updadedSubjects = await _repository.UpdateSubject(id, subjects);
            var result = new SubjectModel
            {
                Id = updadedSubjects.Id,
                Name= updadedSubjects.Name,
            };
            return result;
        }
    }
}
