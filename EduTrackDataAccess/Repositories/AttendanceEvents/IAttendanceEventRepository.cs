using EduTrackDataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.AttendanceEvents
{
    public interface IAttendanceEventRepository 
    {
        Task<IEnumerable<AttendanceEvent>> GetAllAttendanceEvent();
        Task<AttendanceEvent> GetAttendanceEvent(int id);
        Task<AttendanceEvent> CreateAttendanceEvent(AttendanceEvent attendanceEvent);
        Task<AttendanceEvent> UpdateAttendanceEvent(int id, AttendanceEvent attendanceEvent);
        Task<bool> DeleteAttendanceEvent(int id);
    }
}
