using System;

namespace EduTrackDataAccess.Entities
{
    public class Grade
    {
        public int Id { get; set; }
        public int SubmissionId { get; set; }
        public int StudentId { get; set; }
        public int EmployeeId { get; set; }
        public decimal Value { get; set; }
        public string? Comment { get; set; }
        public DateTime GradedAt { get; set; } = DateTime.UtcNow;

        public Submission Submission { get; set; } = null!;
        public Student Student { get; set; } = null!;
        public Employee Employee { get; set; } = null!;
    }
}
