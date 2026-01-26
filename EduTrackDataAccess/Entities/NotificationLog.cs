using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Entities
{
    public class NotificationLog
    {
        public int Id { get; set; }
        public int ParentId { get; set; }
        public int StudentId { get; set; }
        public int EventId { get; set; }

        public Parent Parent { get; set; } = null!;
        public Student Student { get; set; } = null!;
        public AttendanceEvent Event { get; set; }
    }
}
