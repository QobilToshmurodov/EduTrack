namespace EduTrackDataAccess.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }

        public Student Student { get; set; }
        public Teacher Teacher { get; set; }
    }
}
