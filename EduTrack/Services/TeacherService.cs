using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Teachers;

namespace EduTrack.Services
{
    public class TeacherService : IGenericService<TeacherModel>
    {
        private readonly ITeacherReppository _repository;
        public TeacherService(ITeacherReppository reppository)
        {
            _repository = reppository;
        }
        public async Task<TeacherModel> Create(TeacherModel model)
        {
            var teachers = new Teacher
            {
                Id = model.Id,
                UserId = model.UserId,
                Fullname = model.Fullname,

            };
            var createdTeachers = await _repository.CreateTeacher(teachers);
            var result = new TeacherModel()
            {
                Id = createdTeachers.Id,
                UserId= createdTeachers.UserId,
                Fullname= createdTeachers.Fullname,
            };
            return result;
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.DeleteTeacher(id);
        }

        public async Task<TeacherModel> Get(int id)
        {
            var teachers = await _repository.GetTeacher(id);
            var model = new TeacherModel
            {
                Id = teachers.Id,
                UserId= teachers.UserId,
                Fullname = teachers.Fullname,

            };
            return model;

        }

        public async Task<IEnumerable<TeacherModel>> GetAll()
        {
            var result = new List<TeacherModel>();
            var teachers = await _repository.GetAllTeacher();
            foreach (var Teacher in teachers)
            {
                var model = new TeacherModel
                {
                   Id = Teacher.Id,
                   UserId = Teacher.UserId,
                   Fullname = Teacher.Fullname,

                };
                result.Add(model);
            }
            return result;
        }

        public async Task<TeacherModel> Update(int id, TeacherModel model)
        {
            var teachers = new Teacher
            {
                Id = model.Id,
                UserId = model.UserId,
                Fullname = model.Fullname,
            };
            var updadedTeachers = await _repository.UpdateTeacher(id, teachers);
            var result = new TeacherModel
            {
                Id = updadedTeachers.Id,
                UserId= updadedTeachers.UserId,
                Fullname = updadedTeachers.Fullname
            };
            return result;
        }
    }
}
