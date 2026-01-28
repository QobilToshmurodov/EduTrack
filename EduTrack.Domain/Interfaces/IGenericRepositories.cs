using EduTrack.Domain.Entities;

namespace EduTrack.Domain.Interfaces
{
    public interface IRepository<T> where T : class
    {
        IQueryable<T> Query(bool trackChanges = false);
        Task<IEnumerable<T>> GetAllAsync(bool trackChanges = false, CancellationToken cancellationToken = default);
        Task<T?> GetByIdAsync(object id, CancellationToken cancellationToken = default);
        Task AddAsync(T entity, CancellationToken cancellationToken = default);
        void Update(T entity);
        void Remove(T entity);
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
