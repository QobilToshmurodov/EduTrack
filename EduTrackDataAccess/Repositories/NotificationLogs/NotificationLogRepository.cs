using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.NotificationLogs
{
    public class NotificationLogRepository : INotificationLogRepository
    {
        private readonly EdutrackDbContext _dbContext;
        public NotificationLogRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<NotificationLog> CreateNotificationLog(NotificationLog notificationLog)
        {
           await _dbContext.AddAsync(notificationLog);
            await _dbContext.SaveChangesAsync();
            return notificationLog;
        }

        public async Task<bool> DeleteNotificationLog(int id)
        {
            var notificationLog = await _dbContext.NotificationLogs.FindAsync(id);
            if (notificationLog != null)
            {
                _dbContext.NotificationLogs.Remove(notificationLog);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<NotificationLog>> GetAllNotificationLog()
        {
            return await _dbContext.NotificationLogs.ToListAsync();
        }

        public async Task<NotificationLog> GetNotificationLog(int id)
        {
            return await _dbContext.NotificationLogs.FindAsync(id);
        }

        public async Task<NotificationLog> UpdateNotificationLog(int id, NotificationLog notificationLog)
        {
            var updatenotificationLog = _dbContext.NotificationLogs.Attach(notificationLog);
            updatenotificationLog.State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return notificationLog;
        }
    }
}
