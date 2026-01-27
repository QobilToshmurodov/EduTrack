using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.NotificationLogs;

namespace EduTrack.Services
{
    public class NotificationLogService
    {
        private readonly INotificationLogRepository _repository;
        public NotificationLogService(INotificationLogRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<NotificationLog>> GetAllNotificationLogAsync()
        {
            return await _repository.GetAllNotificationLog();
        }

        public async Task<NotificationLog> GetNotificationLogByIdAsync(int id)
        {
            return await _repository.GetNotificationLog(id);
        }

        public async Task<NotificationLog> CreateNotificationLogAsync(NotificationLog model)
        {
            return await _repository.CreateNotificationLog(model);
        }

        public async Task<NotificationLog> UpdateNotificationLogAsync(int id, NotificationLog model)
        {
            var existing = await _repository.GetNotificationLog(id);
            if (existing == null) return null;

            existing.ParentId = model.ParentId;
            existing.StudentId = model.StudentId;
            existing.EventId = model.EventId;

            return await _repository.UpdateNotificationLog(id, existing);
        }

        public async Task<bool> DeleteNotificationLogAsync(int id)
        {
            return await _repository.DeleteNotificationLog(id);
        }
    }
}
