namespace EduTrack.Models
{
    public class GradeModel
    {
        public int Id { get; set; }
        public int SubmissionId { get; set; }
        public int TeacherId { get; set; }
        public int Score { get; set; }
    }
}
