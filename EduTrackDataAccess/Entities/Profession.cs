using System.Collections.Generic;

namespace EduTrackDataAccess.Entities
{
    public class Profession
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public ICollection<Group> Groups { get; set; } = new List<Group>();
    }
}
