namespace EduTrackDataAccess.Entities
{
    public  class Grade
    {

        public int Id { get; set; }
        public int SubmissionId { get; set; }
        public int TeacherId { get; set; }
        public int Score { get; set; }

        public Submission Submission { get; set; }
        public Teacher Teacher { get; set; }
    }
}
