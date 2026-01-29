namespace EduTrack.Models
{
    public class AttendanceEventModel
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int TeacherId { get; set; }
        public DateTime Timestamp { get; set; }
        public string EventType { get; set; }
        public string Sourse { get; set; }
    }
}
