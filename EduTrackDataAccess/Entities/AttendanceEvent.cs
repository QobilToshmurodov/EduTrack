using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
