namespace EduTrack.Domain.Entities
{
    public class Group
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int Year { get; set; }

        public ICollection<Student> Students { get; set; } = new List<Student>();
        public ICollection<TeacherSubjectGroup> TeacherSubjectGroups { get; set; } = new List<TeacherSubjectGroup>();
        public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    }
}
