using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.AttendanceEvents
{
    public class AttendanceEventRepository : IAttendanceEventRepository
    {
        private readonly EdutrackDbContext _dbContext;

        public AttendanceEventRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext; 
        }

        public async Task<AttendanceEvent> CreateAttendanceEvent(AttendanceEvent attendanceEvent)
        {
            await _dbContext.AttendanceEvents.AddAsync(attendanceEvent);
            await _dbContext.SaveChangesAsync();
            return attendanceEvent;
        }


        public async Task<bool> DeleteAttendanceEvent(int id)
        {
            var attendanceEvent = await _dbContext.AttendanceEvents.FindAsync(id);
            if (attendanceEvent != null)
            {
                _dbContext.AttendanceEvents.Remove(attendanceEvent);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }


        public async Task<IEnumerable<AttendanceEvent>> GetAllAttendanceEvent()
        {
            return await _dbContext.AttendanceEvents.ToListAsync();;
        }

        public async Task<AttendanceEvent> GetAttendanceEvent(int id)
        {
            return await _dbContext.AttendanceEvents.FindAsync(id);
        }

        public async Task<AttendanceEvent> UpdateAttendanceEvent(int id, AttendanceEvent attendanceEvent)
        {
             var updateattendanceEvent = _dbContext.AttendanceEvents.Attach(attendanceEvent);
            updateattendanceEvent.State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return attendanceEvent;
        }
    }
}
