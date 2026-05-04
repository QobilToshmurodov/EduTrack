using System;
using System.Collections.Generic;

namespace EduTrackDataAccess.Entities
{
    public class Assignment
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? FilePath { get; set; }
        public DateTime DueDate { get; set; }
        public int SubjectId { get; set; }
        public int GroupId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Subject Subject { get; set; } = null!;
        public Group Group { get; set; } = null!;
        public Employee Employee { get; set; } = null!;
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    }
}
