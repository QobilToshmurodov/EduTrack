using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Parents;

namespace EduTrack.Services
{
    public class ParentService
    {
        private readonly IParentRepository _repository;
        public ParentService(IParentRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Parent>> GetAllParentAsync()
        {
            return await _repository.GetAllParent();
        }

        public async Task<Parent> GetParentByIdAsync(int id)
        {
            return await _repository.GetParent(id);
        }

        public async Task<Parent> CreateParentAsync(Parent model)
        {
            return await _repository.CreateParent(model);
        }

        public async Task<Parent> UpdateParentAsync(int id, Parent model)
        {
            var existing = await _repository.GetParent(id);
            if (existing == null) return null;

            existing.FullName = model.FullName;
            existing.ChatId = model.ChatId;
            existing.StudentId = model.StudentId;

            return await _repository.UpdateParent(id, existing);
        }

        public async Task<bool> DeleteParentAsync(int id)
        {
            return await _repository.DeleteParent(id);
        }
    }
}
