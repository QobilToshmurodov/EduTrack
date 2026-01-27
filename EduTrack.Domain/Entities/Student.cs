namespace EduTrack.Domain.Entities
{
    public class Student
    {
        public int Id { get; set; } // FK to User
        public string FullName { get; set; } = null!;
        public int GroupId { get; set; }
        public int? ParentId { get; set; }

        public User User { get; set; } = null!;
        public Group Group { get; set; } = null!;
        public Parent? Parent { get; set; }
        
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
        public ICollection<AttendanceEvent> AttendanceEvents { get; set; } = new List<AttendanceEvent>();
    }
}
