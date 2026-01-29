using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.NotificationLogs;

namespace EduTrack.Services
{
    public class NotificationLogService : IGenericService<NotificationLogModel>
    {
        private readonly INotificationLogRepository _repository;
        public NotificationLogService(INotificationLogRepository repository)
        {
            _repository = repository;
        }

        public async Task<NotificationLogModel> Create(NotificationLogModel model)
        {
            var notificationLogs = new NotificationLog
            {
                Id = model.Id,
                ParentId = model.ParentId,
                EventId = model.EventId,
                StudentId = model.StudentId,

            };
            var createdNotificationLogs = await _repository.CreateNotificationLog(notificationLogs);
            var result = new NotificationLogModel()
            {
                Id = createdNotificationLogs.Id,
                ParentId= createdNotificationLogs.ParentId,
                EventId = createdNotificationLogs.EventId,
                StudentId = createdNotificationLogs.StudentId,
            };
            return result;
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.DeleteNotificationLog(id);
        }

        public async Task<NotificationLogModel> Get(int id)
        {
            var notificationLogs = await _repository.GetNotificationLog(id);
            var model = new NotificationLogModel
            {
                Id = notificationLogs.Id,
                ParentId=notificationLogs.ParentId,
                EventId = notificationLogs.EventId,
                StudentId = notificationLogs.StudentId,
            };
            return model;

        }

        public async Task<IEnumerable<NotificationLogModel>> GetAll()
        {
            var result = new List<NotificationLogModel>();
            var notificationLogs = await _repository.GetAllNotificationLog();
            foreach (var notificationLog in notificationLogs)
            {
                var model = new NotificationLogModel
                {
                    Id = notificationLog.Id,
                    ParentId = notificationLog.ParentId,
                    EventId = notificationLog.EventId,
                    StudentId = notificationLog.StudentId,
                };
                result.Add(model);
            }
            return result;
        }

        public async Task<NotificationLogModel> Update(int id, NotificationLogModel model)
        {
            var notificationLogs = new NotificationLog
            {
                Id = model.Id,
                ParentId= model.ParentId,
                EventId = model.EventId,
                StudentId = model.StudentId,
            };
            var updadedNotificationLogs = await _repository.UpdateNotificationLog(id, notificationLogs);
            var result = new NotificationLogModel
            {
                Id = updadedNotificationLogs.Id,
                ParentId= updadedNotificationLogs.ParentId,
                EventId = updadedNotificationLogs.EventId,
                StudentId = updadedNotificationLogs.StudentId,
            };
            return result;
        }
    }
}
