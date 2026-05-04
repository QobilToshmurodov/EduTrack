using System.Collections.Generic;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;

namespace EduTrackDataAccess.Repositories.News
{
    public interface INewsRepository
    {
        Task<IEnumerable<Entities.News>> GetAllAsync();
        Task<IEnumerable<Entities.News>> GetLatestAsync(int count);
        Task<Entities.News?> GetByIdAsync(int id);
        Task<Entities.News> CreateAsync(Entities.News news);
        Task<Entities.News> UpdateAsync(int id, Entities.News news);
        Task<bool> DeleteAsync(int id);
    }
}