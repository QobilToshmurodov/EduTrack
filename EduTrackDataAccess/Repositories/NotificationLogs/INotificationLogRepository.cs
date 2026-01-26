using EduTrackDataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.NotificationLogs
{
    public interface INotificationLogRepository 
    {
        Task<IEnumerable<NotificationLog>> GetAllNotificationLog();
        Task<NotificationLog> GetNotificationLog(int id);
        Task<NotificationLog> CreateNotificationLog(NotificationLog notificationLog);
        Task<NotificationLog> UpdateNotificationLog(int id, NotificationLog notificationLog);
        Task<bool> DeleteNotificationLog(int id);
    }
}
