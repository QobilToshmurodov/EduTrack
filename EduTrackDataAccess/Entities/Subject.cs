using System.Collections.Generic;

namespace EduTrackDataAccess.Entities
{
    public class Subject
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public ICollection<EmployeeSubjectGroup> EmployeeSubjectGroups { get; set; } = new List<EmployeeSubjectGroup>();
    }
}
