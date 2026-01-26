using EduTrackDataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduTrackDataAccess.Repositories.Grades
{
    public interface IGradeRepository
    {
        Task<IEnumerable<Grade>> GetAllGrade();
        Task<Grade> GetGrade(int id);
        Task<Grade> CreateGrade(Grade grade);
        Task<Grade> UpdateGrade(int id, Grade grade);
        Task<bool> DeleteGrade(int id);
    }
}
