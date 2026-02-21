using System.Collections.Generic;

namespace EduTrackDataAccess.Entities
{
    public class Group
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? ProfessionId { get; set; }

        public Profession? Profession { get; set; }
        public ICollection<Student> Students { get; set; } = new List<Student>();
        public ICollection<EmployeeSubjectGroup> EmployeeSubjectGroups { get; set; } = new List<EmployeeSubjectGroup>();
    }
}
