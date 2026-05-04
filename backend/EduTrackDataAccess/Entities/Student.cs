using System.Collections.Generic;

namespace EduTrackDataAccess.Entities
{
    public class Student
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public int? GroupId { get; set; }

        public User User { get; set; } = null!;
        public Group? Group { get; set; }
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
        public ICollection<Grade> Grades { get; set; } = new List<Grade>();
    }
}
