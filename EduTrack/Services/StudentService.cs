using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Students;

namespace EduTrack.Services
{
    public class StudentService
    {
        private readonly IStudentRepository _repository;
        public StudentService(IStudentRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Student>> GetAllStudentAsync()
        {
            return await _repository.GetAllStudent();
        }

        public async Task<Student> GetStudentByIdAsync(int id)
        {
            return await _repository.GetStudent(id);
        }

        public async Task<Student> CreateStudentAsync(Student model)
        {
            return await _repository.CreateStudent(model);
        }

        public async Task<Student> UpdateStudentAsync(int id, Student model)
        {
            var existing = await _repository.GetStudent(id);
            if (existing == null) return null;

            existing.UserId = model.UserId;
            existing.ParentId = model.ParentId;
            existing.GroupId = model.GroupId;

            return await _repository.UpdateStudent(id, existing);
        }

        public async Task<bool> DeleteStudentAsync(int id)
        {
            return await _repository.DeleteStudent(id);
        }
    }
}
