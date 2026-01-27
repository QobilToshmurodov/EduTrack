using EduTrack.Domain.Entities;

namespace EduTrack.Domain.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task AddAsync(T entity, CancellationToken cancellationToken = default);
        void Update(T entity);
        void Delete(T entity);
        Task SaveChangesAsync(CancellationToken cancellationToken = default);
    }

    public interface IStudentRepository : IRepository<Student> { }
    public interface ITeacherRepository : IRepository<Teacher> { }
    public interface IGroupRepository : IRepository<Group> { }
    public interface ISubjectRepository : IRepository<Subject> { }
    public interface IAssignmentRepository : IRepository<Assignment> { }
    public interface ISubmissionRepository : IRepository<Submission> { }
    public interface IGradeRepository : IRepository<Grade> { }
    public interface IAttendanceEventRepository : IRepository<AttendanceEvent> { }
    public interface IParentRepository : IRepository<Parent> { }
}
