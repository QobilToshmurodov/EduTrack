using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Groups;

namespace EduTrack.Services
{
    public class GroupService :IGenericService<GroupModel>
    {
        private readonly IGroupsRepository _repository;
        public GroupService(IGroupsRepository repository)
        {  
            _repository = repository;
        }

        public async Task<GroupModel> Create(GroupModel model)
        {
            var groups = new Group
            {
                Id = model.Id,
                Name = model.Name,

            };
            var createdGroups = await _repository.CreateGroup(groups);
            var result = new GroupModel()
            {
                Id = createdGroups.Id,
                Name = createdGroups.Name,
            };
            return result;
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.DeleteGroup(id);
        }

        public async Task<GroupModel> Get(int id)
        {
            var groups = await _repository.GetGroup(id);
            var model = new GroupModel
            {
                Id = groups.Id,
                Name = groups.Name,
            };
            return model;

        }

        public async Task<IEnumerable<GroupModel>> GetAll()
        {
            var result = new List<GroupModel>();
            var groups = await _repository.GetAllGroup();
            foreach (var group in groups)
            {
                var model = new GroupModel
                {
                    Id = group.Id,
                    Name = group.Name,

                };
                result.Add(model);
            }
            return result;
        }

        public async Task<GroupModel> Update(int id, GroupModel model)
        {
            var groups = new Group
            {
                Id = model.Id,
                Name = model.Name,
            };
            var updadedGroups = await _repository.UpdateGroup(id, groups);
            var result = new GroupModel
            {
                Id = updadedGroups.Id,
                Name = updadedGroups.Name,
            };
            return result;
        }
    }
}
