namespace EduTrack.Domain.Entities
{
    public enum SubmissionStatus
    {
        Submitted,
        Graded
    }

    public class Submission
    {
        public int Id { get; set; }
        public int AssignmentId { get; set; }
        public int StudentId { get; set; }
        public string FileUrl { get; set; } = null!;
        public DateTime UploadedAt { get; set; }
        public SubmissionStatus Status { get; set; }

        public Assignment Assignment { get; set; } = null!;
        public Student Student { get; set; } = null!;
        public Grade? Grade { get; set; }
    }
}
