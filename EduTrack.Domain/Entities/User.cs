using EduTrack.Domain.Enums;

namespace EduTrack.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public UserRole Role { get; set; }

        public Student? Student { get; set; }
        public Teacher? Teacher { get; set; }
    }
}
