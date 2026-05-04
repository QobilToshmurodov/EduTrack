namespace EduTrackDataAccess.Entities
{
    public class EmployeeSubjectGroup
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int SubjectId { get; set; }
        public int GroupId { get; set; }

        public Employee Employee { get; set; } = null!;
        public Subject Subject { get; set; } = null!;
        public Group Group { get; set; } = null!;
    }
}
