namespace EduTrack.Domain.Entities
{
    public class Subject
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public ICollection<TeacherSubjectGroup> TeacherSubjectGroups { get; set; } = new List<TeacherSubjectGroup>();
        public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    }
}
