using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Assignments;

namespace EduTrack.Services
{
    public class AssignmentService
    {
        private readonly IAssignmentRepository _repository;
        public AssignmentService(IAssignmentRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Assignment>> GetAllAssignmentAsync()
        {
            return await _repository.GetAllAssignments();
        }

        public async Task<Assignment> GetAssignmentByIdAsync(int id)
        {
            return await _repository.GetAssignment(id);
        }

        public async Task<Assignment> CreateAssignmentAsync(Assignment model)
        {
            return await _repository.CreateAssignment(model);
        }

        public async Task<Assignment> UpdateAssignmentAsync(int id, Assignment model)
        {
            var existing = await _repository.GetAssignment(id);
            if (existing == null) return null;

            existing.TeacherId = model.TeacherId;
            existing.SubjectId = model.SubjectId;
            existing.GroupId = model.GroupId;
            existing.Title = model.Title;
            existing.Deadline = model.Deadline;

            return await _repository.UpdateAssignment(id, existing);
        }

        public async Task<bool> DeleteAssignmentAsync(int id)
        {
            return await _repository.DeleteAssignment(id);
        }
    }
}
