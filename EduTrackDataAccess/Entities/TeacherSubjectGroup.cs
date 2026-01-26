namespace EduTrackDataAccess.Entities
{
    public class TeacherSubjectGroup
    {
        public int Id { get; set; }
        public int TeacherId { get; set; }
        public int SubjectId { get; set; }
        public int GroupId { get; set; }

        public Teacher Teacher { get; set; }
        public Subject Subject { get; set; }
        public Group Group { get; set; }
    }
}
