namespace EduTrack.Domain.Entities
{
    public enum NotificationStatus
    {
        Sent,
        Failed
    }

    public class NotificationLog
    {
        public int Id { get; set; }
        public int ParentId { get; set; }
        public int StudentId { get; set; }
        public int EventId { get; set; }
        public DateTime SentAt { get; set; }
        public NotificationStatus Status { get; set; }

        public Parent Parent { get; set; } = null!;
        public Student Student { get; set; } = null!;
        public AttendanceEvent Event { get; set; } = null!;
    }
}
