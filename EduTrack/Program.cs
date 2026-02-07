using EduTrackDataAccess;
using Microsoft.EntityFrameworkCore;
using EduTrackDataAccess.Repositories.Subjects;
using EduTrack.Services;
using EduTrack.Models;
using EduTrackDataAccess.Repositories.Users;
using EduTrackDataAccess.Repositories.TeacherSubjectGroups;
using EduTrackDataAccess.Repositories.Submissions;
using EduTrackDataAccess.Repositories.Teachers;
using EduTrackDataAccess.Repositories.Students;
using EduTrackDataAccess.Repositories.Parents;
using EduTrackDataAccess.Repositories.NotificationLogs;
using EduTrackDataAccess.Repositories.Groups;
using EduTrackDataAccess.Repositories.Grades;
using EduTrackDataAccess.Repositories.AttendanceEvents;
using EduTrackDataAccess.Repositories.Assignments;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<EdutrackDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:7010", "https://localhost:7010")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

builder.Services.AddScoped<ISubjectRepository, SubjectRepository>();
builder.Services.AddScoped<SubjectService>();

builder.Services.AddScoped<IUserReporitory, UserRepository>();
builder.Services.AddScoped<UserService>();

builder.Services.AddScoped<ITeacherSubjectGroupRepository, TeacherSubjectGroupRepository>();
builder.Services.AddScoped<TSGService>();

builder.Services.AddScoped<ISubmissionsRepository, SubmissionRepository>();
builder.Services.AddScoped<SubmissionService>();

builder.Services.AddScoped<ITeacherReppository, TeacherRepository>();
builder.Services.AddScoped<TeacherService>();

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

builder.Services.AddScoped<IJWTService, JWTService>();

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            )
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();

app.UseSwaggerUI();

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseAuthentication();

app.MapControllers();

app.Run();