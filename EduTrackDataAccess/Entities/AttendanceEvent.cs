using System;

namespace EduTrackDataAccess.Entities
{
    public class AttendanceEvent
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int? TeacherId { get; set; }
        public DateTime Timestamp { get; set; }
        public string EventType { get; set; }
        public string Sourse { get; set; }


        public Student Student { get; set; }
        public Teacher Teacher { get; set; }
    }
}
