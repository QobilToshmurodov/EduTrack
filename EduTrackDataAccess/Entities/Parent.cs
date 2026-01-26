using System.Collections.Generic;

namespace EduTrackDataAccess.Entities
{
    public class Parent
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string ChatId { get; set; }
        public int StudentId { get; set; }

        public Student Student { get; set; }

        public ICollection<NotificationLog> NotificationLogs { get; set; }
    }
}
