using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Entities
{
    public class Parent
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string ChatId { get; set; } = null!;
        public int StudentId { get; set; }

        public Student Student { get; set; } = null!;

        public ICollection<NotificationLog> NotificationLogs { get; set; }
    }
}
