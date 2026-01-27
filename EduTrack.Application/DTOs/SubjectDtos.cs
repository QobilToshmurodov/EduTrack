namespace EduTrack.Application.DTOs
{
    public class SubjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }

    public class SubjectCreateDto
    {
        public string Name { get; set; } = null!;
    }

    public class SubjectUpdateDto
    {
        public string Name { get; set; } = null!;
    }
}
