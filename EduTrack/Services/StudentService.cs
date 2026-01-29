using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Students;

namespace EduTrack.Services
{
    public class StudentService : IGenericService<StudentModel>
    {
        private readonly IStudentRepository _repository;
        public StudentService(IStudentRepository repository)
        {
            _repository = repository;
        }

        public async Task<StudentModel> Create(StudentModel model)
        {
            var students = new Student
            {
                Id = model.Id,
                UserId = model.UserId,
                GroupId = model.GroupId,
                ParentId = model.ParentId,

            };
            var createdStudents = await _repository.CreateStudent(students);
            var result = new StudentModel()
            {
                Id = createdStudents.Id,
                UserId= createdStudents.UserId,
                GroupId = createdStudents.GroupId,
                ParentId = createdStudents.ParentId,
            };
            return result;
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.DeleteStudent(id);
        }

        public async Task<StudentModel> Get(int id)
        {
            var students = await _repository.GetStudent(id);
            var model = new StudentModel
            {
                Id = students.Id,
                UserId= students.UserId,
                GroupId = students.GroupId,
                ParentId= students.ParentId,
            };
            return model;

        }

        public async Task<IEnumerable<StudentModel>> GetAll()
        {
            var result = new List<StudentModel>();
            var students = await _repository.GetAllStudent();
            foreach (var student in students)
            {
                var model = new StudentModel
                {
                    Id = student.Id,
                    UserId = student.UserId,
                    GroupId = student.GroupId,
                    ParentId = student.ParentId,
                };
                result.Add(model);
            }
            return result;
        }

        public async Task<StudentModel> Update(int id, StudentModel model)
        {
            var students = new Student
            {
                Id = model.Id,
                UserId=model.UserId,
                GroupId = model.GroupId,
                ParentId = model.ParentId,
            };
            var updadedStudents = await _repository.UpdateStudent(id, students);
            var result = new StudentModel
            {
                Id = updadedStudents.Id,
                UserId= updadedStudents.UserId,
                GroupId = updadedStudents.GroupId,
                ParentId=updadedStudents.ParentId,
            };
            return result;
        }
    }
}
