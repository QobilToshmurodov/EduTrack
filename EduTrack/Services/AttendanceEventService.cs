using EduTrack.Models;
using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.AttendanceEvents;

namespace EduTrack.Services
{
    public class AttendanceEventService : IGenericService<AttendanceEventModel>
    {
        private readonly IAttendanceEventRepository _repository;
        public AttendanceEventService(IAttendanceEventRepository repository)
        {
            _repository = repository;
        }

        public async Task<AttendanceEventModel> Create(AttendanceEventModel model)
        {
            var attendanceEvents = new AttendanceEvent
            {
                Id = model.Id,
                StudentId = model.StudentId,
                TeacherId = model.TeacherId,
                Timestamp = model.Timestamp,
                EventType = model.EventType,
                Sourse = model.Sourse,

            };
            var createdAttendanceEvents = await _repository.CreateAttendanceEvent(attendanceEvents);
            var result = new AttendanceEventModel()
            {
                Id = createdAttendanceEvents.Id,
                StudentId= createdAttendanceEvents.StudentId,
                TeacherId= createdAttendanceEvents.TeacherId,
                Timestamp= createdAttendanceEvents.Timestamp,
                EventType = createdAttendanceEvents.EventType,
                Sourse= createdAttendanceEvents.Sourse,
            };
            return result;
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.DeleteAttendanceEvent(id);
        }

        public async Task<AttendanceEventModel> Get(int id)
        {
            var attendanceEvents = await _repository.GetAttendanceEvent(id);
            var model = new AttendanceEventModel
            {
                Id = attendanceEvents.Id,
                StudentId= attendanceEvents.StudentId,
                TeacherId= attendanceEvents.TeacherId,
                Timestamp= attendanceEvents.Timestamp,
                EventType = attendanceEvents.EventType,
                Sourse = attendanceEvents.Sourse,
            };
            return model;

        }

        public async Task<IEnumerable<AttendanceEventModel>> GetAll()
        {
            var result = new List<AttendanceEventModel>();
            var attendanceEvents = await _repository.GetAllAttendanceEvent();
            foreach (var attendanceEvent in attendanceEvents)
            {
                var model = new AttendanceEventModel
                {
                    Id = attendanceEvent.Id,
                    StudentId = attendanceEvent.StudentId,
                    TeacherId = attendanceEvent.TeacherId,
                    Timestamp = attendanceEvent.Timestamp,
                    EventType = attendanceEvent.EventType,
                    Sourse= attendanceEvent.Sourse,

                };
                result.Add(model);
            }
            return result;
        }

        public async Task<AttendanceEventModel> Update(int id, AttendanceEventModel model)
        {
            var attendanceEvents = new AttendanceEvent
            {
                Id = model.Id,
                StudentId = model.StudentId,
                TeacherId = model.TeacherId,
                Timestamp = model.Timestamp,
                EventType = model.EventType,
                Sourse = model.Sourse,
            };
            var updadedAttendanceEvents = await _repository.UpdateAttendanceEvent(id, attendanceEvents);
            var result = new AttendanceEventModel
            {
                Id = updadedAttendanceEvents.Id,
                StudentId= updadedAttendanceEvents.StudentId,
                TeacherId= updadedAttendanceEvents.TeacherId,
                Timestamp= updadedAttendanceEvents.Timestamp,
                EventType= updadedAttendanceEvents.EventType,
                Sourse= updadedAttendanceEvents.Sourse,
            };
            return result;
        }
    }
}
