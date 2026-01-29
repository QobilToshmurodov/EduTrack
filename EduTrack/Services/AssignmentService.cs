using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Assignments;

namespace EduTrack.Services
{
    public class AssignmentService : IGenericService<AssignmentModel>
    {
        private readonly IAssignmentRepository _repository;
        public AssignmentService(IAssignmentRepository repository)
        {
            _repository = repository;
        }

        public async Task<AssignmentModel> Create(AssignmentModel model)
        {
            var assignments = new Assignment
            {
                Id = model.Id,
                SubjectId = model.SubjectId,
                GroupId = model.GroupId,
                TeacherId = model.TeacherId,
                Title = model.Title,
                Deadline = model.Deadline,

            };
            var createdAssignments = await _repository.CreateAssignment(assignments);
            var result = new AssignmentModel()
            {
                Id = createdAssignments.Id,
                SubjectId= createdAssignments.SubjectId,    
                GroupId= createdAssignments.GroupId,
                TeacherId= createdAssignments.TeacherId,
                Title = createdAssignments.Title,
                Deadline = createdAssignments.Deadline,
            };
            return result;
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.DeleteAssignment(id);
        }

        public async Task<AssignmentModel> Get(int id)
        {
            var assignments = await _repository.GetAssignment(id);
            var model = new AssignmentModel
            {
                Id = assignments.Id,
                SubjectId= assignments.SubjectId,
                GroupId= assignments.GroupId,
                TeacherId= assignments.TeacherId,
                Title = assignments.Title,
                Deadline = assignments.Deadline,
            };
            return model;

        }

        public async Task<IEnumerable<AssignmentModel>> GetAll()
        {
            var result = new List<AssignmentModel>();
            var assignments = await _repository.GetAllAssignments();
            foreach (var assignment in assignments)
            {
                var model = new AssignmentModel
                {
                    Id = assignment.Id,
                    SubjectId= assignment.SubjectId,
                    GroupId= assignment.GroupId,
                    TeacherId = assignment.TeacherId,
                    Title = assignment.Title,
                    Deadline = assignment.Deadline,

                };
                result.Add(model);
            }
            return result;
        }

        public async Task<AssignmentModel> Update(int id, AssignmentModel model)
        {
            var assignments = new Assignment
            {
                Id = model.Id,
                SubjectId = model.SubjectId,
                GroupId = model.GroupId,
                TeacherId = model.TeacherId,
                Title = model.Title,
                Deadline = model.Deadline,
            };
            var updadedAssignments = await _repository.UpdateAssignment(id, assignments);
            var result = new AssignmentModel
            {
                Id = updadedAssignments.Id,
                SubjectId= updadedAssignments.SubjectId,
                GroupId= updadedAssignments.GroupId,
                TeacherId= updadedAssignments.TeacherId,
                Title = updadedAssignments.Title,
                Deadline = updadedAssignments.Deadline,
            };
            return result;
        }
    }
}
