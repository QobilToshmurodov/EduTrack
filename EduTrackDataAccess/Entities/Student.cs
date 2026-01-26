using System.Collections.Generic;

namespace EduTrackDataAccess.Entities
{
    public class Student
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? GroupId { get; set; }
        public int? ParentId { get; set; }

        public User User { get; set; } = null!;
        public Group? Group { get; set; }
        public Parent? Parent { get; set; }

        public ICollection<Submission> Submissions { get; set; }
        public ICollection<AttendanceEvent> AttendanceEvents { get; set; }
    }
}
