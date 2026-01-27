using EduTrackDataAccess;
using Microsoft.EntityFrameworkCore;
using EduTrackDataAccess.Repositories.Subjects;
using EduTrack.Services;
using EduTrackDataAccess.Repositories.Users;
using EduTrackDataAccess.Repositories.TeacherSubjectGroups;
using EduTrackDataAccess.Repositories.Teachers;
using EduTrackDataAccess.Repositories.Submissions;
using EduTrackDataAccess.Repositories.Students;
using EduTrackDataAccess.Repositories.Parents;
using EduTrackDataAccess.Repositories.NotificationLogs;
using EduTrackDataAccess.Repositories.Grades;
using EduTrackDataAccess.Repositories.AttendanceEvents;
using EduTrackDataAccess.Repositories.Groups;
using EduTrackDataAccess.Repositories.Assignments;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<EdutrackDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddScoped<ISubjectRepository, SubjectRepository>();
builder.Services.AddScoped<SubjectService>();

builder.Services.AddScoped<IUserReporitory, UserRepository>();
builder.Services.AddScoped<UserService>();

builder.Services.AddScoped<ITeacherSubjectGroupRepository, TeacherSubjectGroupRepository>();
builder.Services.AddScoped<TSGService>();

builder.Services.AddScoped<ITeacherReppository, TeacherRepository>();
builder.Services.AddScoped<TeacherService>();

builder.Services.AddScoped<ISubmissionsRepository, SubmissionRepository>();
builder.Services.AddScoped<SubmissionService>();

builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<StudentService>();

builder.Services.AddScoped<IParentRepository, ParentRepository>();
builder.Services.AddScoped<ParentService>();

builder.Services.AddScoped<INotificationLogRepository, NotificationLogRepository>();
builder.Services.AddScoped<NotificationLogService>();

builder.Services.AddScoped<IGroupsRepository, GroupRepository>();
builder.Services.AddScoped<GroupService>();

builder.Services.AddScoped<IGradeRepository, GradeRepository>();
builder.Services.AddScoped<GradeService>();

builder.Services.AddScoped<IAttendanceEventRepository, AttendanceEventRepository>();
builder.Services.AddScoped<AttendanceEventService>();

builder.Services.AddScoped<IAssignmentRepository, AssignmentRepository>();
builder.Services.AddScoped<AssignmentService>();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();

app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();