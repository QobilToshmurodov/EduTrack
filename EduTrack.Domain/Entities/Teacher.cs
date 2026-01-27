namespace EduTrack.Domain.Entities
{
    public class Teacher
    {
        public int Id { get; set; } // FK to User
        public string FullName { get; set; } = null!;

        public User User { get; set; } = null!;
        public ICollection<TeacherSubjectGroup> TeacherSubjectGroups { get; set; } = new List<TeacherSubjectGroup>();
        public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    }
}
