using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.Parents;

namespace EduTrack.Services
{
    public class ParentService :    IGenericService<ParentModel>
    {
        private readonly IParentRepository _repository;
        public ParentService(IParentRepository repository)
        {
            _repository = repository;
        }

        public async Task<ParentModel> Create(ParentModel model)
        {
            var parents = new Parent
            {
                Id = model.Id,
                FullName = model.FullName,
                ChatId = model.ChatId,
                StudentId = model.StudentId,

            };
            var createdParents = await _repository.CreateParent(parents);
            var result = new ParentModel()
            {
                Id = createdParents.Id,
                FullName= createdParents.FullName,
                ChatId = createdParents.ChatId,
                StudentId = createdParents.StudentId,
            };
            return result;
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.DeleteParent(id);
        }

        public async Task<ParentModel> Get(int id)
        {
            var parents = await _repository.GetParent(id);
            var model = new ParentModel
            {
                Id = parents.Id,
                FullName= parents.FullName,
                ChatId = parents.ChatId,
                StudentId = parents.StudentId,
            };
            return model;

        }

        public async Task<IEnumerable<ParentModel>> GetAll()
        {
            var result = new List<ParentModel>();
            var parents = await _repository.GetAllParent();
            foreach (var parent in parents)
            {
                var model = new ParentModel
                {
                    Id = parent.Id,
                    FullName = parent.FullName,
                    ChatId = parent.ChatId,
                    StudentId= parent.StudentId,
                };
                result.Add(model);
            }
            return result;
        }

        public async Task<ParentModel> Update(int id, ParentModel model)
        {
            var parents = new Parent
            {
                Id = model.Id,
                FullName= model.FullName,
                ChatId = model.ChatId,
                StudentId = model.StudentId,
            };
            var updadedParents = await _repository.UpdateParent(id, parents);
            var result = new ParentModel
            {
                Id = updadedParents.Id,
                FullName= updadedParents.FullName,
                ChatId= updadedParents.ChatId,
                StudentId= updadedParents.StudentId,
            };
            return result;
        }
    }
}
