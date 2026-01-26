using System.Collections.Generic;

namespace EduTrackDataAccess.Entities
{
    public class Subject
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<Assignment> Assignments { get; set; }
        public ICollection<TeacherSubjectGroup> TeacherSubjectGroups { get; set; }
    }
}
