using EduTrackDataAccess.Entities;
using EduTrackDataAccess.Repositories.AttendanceEvents;

namespace EduTrack.Services
{
    public class AttendanceEventService
    {
        private readonly IAttendanceEventRepository _repository;
        public AttendanceEventService(IAttendanceEventRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<AttendanceEvent>> GetAllAttendanceEventAsync()
        {
            return await _repository.GetAllAttendanceEvent();
        }

        public async Task<AttendanceEvent> GetAttendanceEventByIdAsync(int id)
        {
            return await _repository.GetAttendanceEvent(id);
        }

        public async Task<AttendanceEvent> CreateAttendanceEventAsync(AttendanceEvent model)
        {
            return await _repository.CreateAttendanceEvent(model);
        }

        public async Task<AttendanceEvent> UpdateAttendanceEventAsync(int id, AttendanceEvent model)
        {
            var existing = await _repository.GetAttendanceEvent(id);
            if (existing == null) return null;

            existing.TeacherId = model.TeacherId;
            existing.StudentId = model.StudentId;
            existing.Timestamp = model.Timestamp;
            existing.EventType = model.EventType;
            existing.Sourse = model.Sourse;

            return await _repository.UpdateAttendanceEvent(id, existing);
        }

        public async Task<bool> DeleteAttendanceEventAsync(int id)
        {
            return await _repository.DeleteAttendanceEvent(id);
        }
    }
}
