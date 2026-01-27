namespace EduTrack.Domain.Entities
{
    public class Assignment
    {
        public int Id { get; set; }
        public int SubjectId { get; set; }
        public int GroupId { get; set; }
        public int TeacherId { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime Deadline { get; set; }
        public DateTime CreatedAt { get; set; }

        public Subject Subject { get; set; } = null!;
        public Group Group { get; set; } = null!;
        public Teacher Teacher { get; set; } = null!;
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    }
}
