namespace EduTrack.Domain.Entities
{
    public enum AttendanceEventType
    {
        Enter,
        Exit,
        Manual,
        QR
    }

    public enum AttendanceSource
    {
        Manual,
        QR,
        Device_Future
    }

    public class AttendanceEvent
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int? TeacherId { get; set; }
        public DateTime Timestamp { get; set; }
        public AttendanceEventType EventType { get; set; }
        public AttendanceSource Source { get; set; }

        public Student Student { get; set; } = null!;
        public Teacher? Teacher { get; set; }
    }
}
