using System.Collections.Generic;

namespace EduTrackDataAccess.Entities
{
    public class Employee
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int? ProfessionId { get; set; }

        public User User { get; set; } = null!;
        public Profession? Profession { get; set; }
        public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
        public ICollection<EmployeeSubjectGroup> EmployeeSubjectGroups { get; set; } = new List<EmployeeSubjectGroup>();
    }
}
