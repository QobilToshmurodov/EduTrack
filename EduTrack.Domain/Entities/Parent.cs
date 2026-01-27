namespace EduTrack.Domain.Entities
{
    public class Parent
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string? TelegramChatId { get; set; }
        public int LinkedStudentId { get; set; }

        public Student Student { get; set; } = null!;
        public ICollection<NotificationLog> NotificationLogs { get; set; } = new List<NotificationLog>();
    }
}
