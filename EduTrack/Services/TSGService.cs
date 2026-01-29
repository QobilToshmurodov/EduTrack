using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.TeacherSubjectGroups;

namespace EduTrack.Services
{
    public class TSGService : IGenericService<TSGModel>
    {
        private readonly ITeacherSubjectGroupRepository _repository;
        public TSGService(ITeacherSubjectGroupRepository repository )
        {
            _repository = repository;
        }

        public async Task<TSGModel> Create(TSGModel model)
        {
            var TSGs = new TeacherSubjectGroup
            {
                Id = model.Id,
                TeacherId = model.TeacherId,
                SubjectId = model.SubjectId,
                GroupId = model.GroupId,
            };
            var createdTSGs = await _repository.CreateTeacherSubjectGroup(TSGs);
            var result = new TSGModel()
            {
                Id = createdTSGs.Id,
                TeacherId = createdTSGs.TeacherId,  
                SubjectId= createdTSGs.SubjectId,
                GroupId= createdTSGs.GroupId,
            };
            return result;
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.DeleteTeacherSubjectGroup(id);
        }

        public async Task<TSGModel> Get(int id)
        {
            var TSGs = await _repository.GetTeacherSubjectGroup(id);
            var model = new TSGModel
            {
                Id = TSGs.Id,
                TeacherId=TSGs.TeacherId,
                SubjectId=TSGs.SubjectId,
                GroupId=TSGs.GroupId,

            };
            return model;

        }

        public async Task<IEnumerable<TSGModel>> GetAll()
        {
            var result = new List<TSGModel>();
            var TSGs = await _repository.GetAllTeacherSubjectGroup();
            foreach (var TSG in TSGs)
            {
                var model = new TSGModel
                {
                    Id = TSG.Id,
                    TeacherId = TSG.TeacherId,
                    SubjectId=TSG.SubjectId,
                    GroupId=TSG.GroupId,
                };
                result.Add(model);
            }
            return result;
        }

        public async Task<TSGModel> Update(int id, TSGModel model)
        {
            var TSGs = new TeacherSubjectGroup
            {
                Id = model.Id,
                TeacherId=model.TeacherId,
                SubjectId=model.SubjectId,
                GroupId = model.GroupId,
            };
            var updadedTSGs = await _repository.UpdateTeacherSubjectGroup(id, TSGs);
            var result = new TSGModel
            {
                Id = updadedTSGs.Id,
                TeacherId= updadedTSGs.TeacherId,
                SubjectId=updadedTSGs.SubjectId,
                GroupId=updadedTSGs.GroupId,
            };
            return result;
        }
    }
}
