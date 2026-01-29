namespace EduTrack.Models
{
    public class AssignmentModel
    {
        public int Id { get; set; }
        public int SubjectId { get; set; }
        public int GroupId { get; set; }
        public int TeacherId { get; set; }
        public string Title { get; set; }
        public DateTime Deadline { get; set; }
    }
}
