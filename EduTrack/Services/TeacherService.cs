using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Teachers;

namespace EduTrack.Services
{
    public class TeacherService
    {
        private readonly ITeacherReppository _repository;
        public TeacherService(ITeacherReppository reppository)
        {
            _repository = reppository;
        }
        public async Task<IEnumerable<Teacher>> GetTeachersAsync()
        {
            return await _repository.GetAllTeacher();
        }
        public async Task<Teacher> GetTeacherByIdAsync(int id)
        {
            return await _repository.GetTeacher(id);
        }

        public async Task<Teacher> CreateTeacherAsync(Teacher model)
        {
            return await _repository.CreateTeacher(model);
        }

        public async Task<Teacher> UpdateTeacherAsync(int id, Teacher model)
        {
            var existing = await _repository.GetTeacher(id);
            if (existing == null) return null;

            existing.Fullname = model.Fullname;

            return await _repository.UpdateTeacher(id, existing);
        }

        public async Task<bool> DeleteTeacherAsync(int id)
        {
            return await _repository.DeleteTeacher(id);
        }
    }
}
