using System;

namespace EduTrackDataAccess.Entities
{
    public class News
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public bool IsPublished { get; set; } = true;
    }
}