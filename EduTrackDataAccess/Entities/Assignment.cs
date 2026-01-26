using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Entities
{
    public class Assignment
    {
        public int Id { get; set; }
        public int SubjectId { get; set; }
        public int GroupId { get; set; }
        public int TeacherId { get; set; }
        public string Title { get; set; }
        public DateTime Deadline { get; set; }

        public Subject Subject { get; set; }
        public Group Group { get; set; }
        public Teacher Teacher { get; set; }

        public ICollection<Submission> Submissions { get; set; }
    }
}
