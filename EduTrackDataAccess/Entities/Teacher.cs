using System.Collections.Generic;

namespace EduTrackDataAccess.Entities
{
    public class Teacher
    {
        public int Id { get; set; } 
        public int UserId { get; set; }
        public string Fullname { get; set; }
        
        public User User { get; set; }

        public ICollection<Assignment> Assignments { get; set; }
        public ICollection<TeacherSubjectGroup> TeacherSubjectGroups { get; set; }
    }
}
