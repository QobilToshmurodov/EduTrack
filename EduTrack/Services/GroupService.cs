using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Groups;

namespace EduTrack.Services
{
    public class GroupService
    {
        private readonly IGroupsRepository _repository;
        public GroupService(IGroupsRepository repository)
        {  
            _repository = repository;
        }

        public async Task<IEnumerable<Group>> GetAllGroupAsync()
        {
            return await _repository.GetAllGroup();
        }

        public async Task<Group> GetGroupByIdAsync(int id)
        {
            return await _repository.GetGroup(id);
        }

        public async Task<Group> CreateGroupAsync(Group model)
        {
            return await _repository.CreateGroup(model);
        }

        public async Task<Group> UpdateGroupAsync(int id, Group model)
        {
            var existing = await _repository.GetGroup(id);
            if (existing == null) return null;

            existing.Name = model.Name;

            return await _repository.UpdateGroup(id, existing);
        }

        public async Task<bool> DeleteGroupAsync(int id)
        {
            return await _repository.DeleteGroup(id);
        }
    }
}
