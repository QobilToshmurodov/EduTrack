using EduTrack.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EduTrack.Infrastructure.Persistence.Repositories
{
    public class StudentRepository : GenericRepository<Domain.Entities.Student>, IStudentRepository 
    { 
        public StudentRepository(ApplicationDbContext context) : base(context) { } 
    }

    public class TeacherRepository : GenericRepository<Domain.Entities.Teacher>, ITeacherRepository 
    { 
        public TeacherRepository(ApplicationDbContext context) : base(context) { } 
    }

    public class GroupRepository : GenericRepository<Domain.Entities.Group>, IGroupRepository 
    { 
        public GroupRepository(ApplicationDbContext context) : base(context) { } 
    }

    public class SubjectRepository : GenericRepository<Domain.Entities.Subject>, ISubjectRepository 
    { 
        public SubjectRepository(ApplicationDbContext context) : base(context) { } 
    }

    public class AssignmentRepository : GenericRepository<Domain.Entities.Assignment>, IAssignmentRepository 
    { 
        public AssignmentRepository(ApplicationDbContext context) : base(context) { } 
    }

    public class SubmissionRepository : GenericRepository<Domain.Entities.Submission>, ISubmissionRepository 
    { 
        public SubmissionRepository(ApplicationDbContext context) : base(context) { } 
    }

    public class GradeRepository : GenericRepository<Domain.Entities.Grade>, IGradeRepository 
    { 
        public GradeRepository(ApplicationDbContext context) : base(context) { } 
    }

    public class AttendanceEventRepository : GenericRepository<Domain.Entities.AttendanceEvent>, IAttendanceEventRepository 
    { 
        public AttendanceEventRepository(ApplicationDbContext context) : base(context) { } 
    }

    public class ParentRepository : GenericRepository<Domain.Entities.Parent>, IParentRepository 
    { 
        public ParentRepository(ApplicationDbContext context) : base(context) { } 
    }
}
