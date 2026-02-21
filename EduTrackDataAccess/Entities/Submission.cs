using System;

namespace EduTrackDataAccess.Entities
{
    public class Submission
    {
        public int Id { get; set; }
        public int AssignmentId { get; set; }
        public int StudentId { get; set; }
        public string? Description { get; set; }
        public string? FilePath { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        public Assignment Assignment { get; set; } = null!;
        public Student Student { get; set; } = null!;
        public Grade? Grade { get; set; }
    }
}
