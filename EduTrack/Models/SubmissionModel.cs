namespace EduTrack.Models
{
    public class SubmissionModel
    {
        public int Id { get; set; }
        public int AssignmentId { get; set; }
        public int StudentId { get; set; }
        public string FileUrl { get; set; }
    }
}
