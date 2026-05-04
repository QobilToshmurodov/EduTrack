using System.Collections.Generic;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;

namespace EduTrackDataAccess.Repositories.Professions
{
    public interface IProfessionRepository
    {
        Task<IEnumerable<Profession>> GetAllAsync();
        Task<Profession?> GetByIdAsync(int id);
        Task<Profession> CreateAsync(Profession profession);
        Task<Profession> UpdateAsync(int id, Profession profession);
        Task<bool> DeleteAsync(int id);
    }
}
