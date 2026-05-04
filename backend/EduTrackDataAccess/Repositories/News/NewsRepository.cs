using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace EduTrackDataAccess.Repositories.News
{
    public class NewsRepository : INewsRepository
    {
        private readonly EdutrackDbContext _dbContext;

        public NewsRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Entities.News>> GetAllAsync()
        {
            return await _dbContext.News
                .OrderByDescending(n => n.CreatedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Entities.News>> GetLatestAsync(int count)
        {
            return await _dbContext.News
                .Where(n => n.IsPublished)
                .OrderByDescending(n => n.CreatedDate)
                .Take(count)
                .ToListAsync();
        }

        public async Task<Entities.News?> GetByIdAsync(int id)
        {
            return await _dbContext.News.FindAsync(id);
        }

        public async Task<Entities.News> CreateAsync(Entities.News news)
        {
            await _dbContext.News.AddAsync(news);
            await _dbContext.SaveChangesAsync();
            return news;
        }

        public async Task<Entities.News> UpdateAsync(int id, Entities.News news)
        {
            var existing = await _dbContext.News.FindAsync(id);
            if (existing == null) throw new Exception("News not found");
            existing.Title = news.Title;
            existing.Content = news.Content;
            existing.ImageUrl = news.ImageUrl;
            existing.IsPublished = news.IsPublished;
            await _dbContext.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var news = await _dbContext.News.FindAsync(id);
            if (news == null) return false;
            _dbContext.News.Remove(news);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}