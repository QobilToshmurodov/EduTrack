using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduTrackDataAccess.Repositories.Professions
{
    public class ProfessionRepository : IProfessionRepository
    {
        private readonly EdutrackDbContext _dbContext;

        public ProfessionRepository(EdutrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Profession>> GetAllAsync()
        {
            return await _dbContext.Professions
                .Include(p => p.Groups)
                .ToListAsync();
        }

        public async Task<Profession?> GetByIdAsync(int id)
        {
            return await _dbContext.Professions
                .Include(p => p.Groups)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Profession> CreateAsync(Profession profession)
        {
            await _dbContext.Professions.AddAsync(profession);
            await _dbContext.SaveChangesAsync();
            return profession;
        }

        public async Task<Profession> UpdateAsync(int id, Profession profession)
        {
            var existing = await _dbContext.Professions.FindAsync(id);
            if (existing == null) throw new KeyNotFoundException("Profession not found");
            existing.Name = profession.Name;
            existing.Code = profession.Code;
            existing.Description = profession.Description;
            await _dbContext.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var profession = await _dbContext.Professions.FindAsync(id);
            if (profession == null) return false;
            _dbContext.Professions.Remove(profession);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
