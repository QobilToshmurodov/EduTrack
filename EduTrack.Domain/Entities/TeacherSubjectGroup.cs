namespace EduTrack.Domain.Entities
{
    public class TeacherSubjectGroup
    {
        public int TeacherId { get; set; }
        public int SubjectId { get; set; }
        public int GroupId { get; set; }

        public Teacher Teacher { get; set; } = null!;
        public Subject Subject { get; set; } = null!;
        public Group Group { get; set; } = null!;
    }
}
