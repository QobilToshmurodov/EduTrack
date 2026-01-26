namespace EduTrackDataAccess.Entities
{
    public class NotificationLog
    {
        public int Id { get; set; }
        public int ParentId { get; set; }
        public int StudentId { get; set; }
        public int EventId { get; set; }

        public Parent Parent { get; set; }
        public Student Student { get; set; }
        public AttendanceEvent Event { get; set; }
    }
}
