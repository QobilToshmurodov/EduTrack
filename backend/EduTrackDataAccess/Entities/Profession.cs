using System.Collections.Generic;

namespace EduTrackDataAccess.Entities
{
    public class Profession
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }

        // O'qish muddati (yil hisobida). Default 2.
        public int DurationYears { get; set; } = 2;

        // Landing sahifasida ko'rsatiladigan emoji (masalan: 👶, 📚, ⚽).
        // Bo'sh bo'lishi mumkin — UI'da default ikonka qo'llaniladi.
        public string? IconEmoji { get; set; }

        public ICollection<Group> Groups { get; set; } = new List<Group>();
    }
}
