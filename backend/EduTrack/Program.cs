using EduTrackDataAccess;
using Microsoft.EntityFrameworkCore;
using EduTrack.Services;
using EduTrackDataAccess.Repositories.Users;
using EduTrackDataAccess.Repositories.Submissions;
using EduTrackDataAccess.Repositories.Students;
using EduTrackDataAccess.Repositories.Groups;
using EduTrackDataAccess.Repositories.Grades;
using EduTrackDataAccess.Repositories.Assignments;
using EduTrackDataAccess.Repositories.Subjects;
using EduTrackDataAccess.Repositories.Professions;
using EduTrackDataAccess.Repositories.Employees;
using EduTrackDataAccess.Repositories.EmployeeSubjectGroups;
using EduTrackDataAccess.Repositories.News;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// SQLite database path
string dbPath;
if (builder.Environment.IsDevelopment())
{
    // In development, put it in the project root
    dbPath = Path.Combine(Directory.GetCurrentDirectory(), "edutrack.db");
}
else
{
    // In production, put it next to the executable
    dbPath = Path.Combine(AppContext.BaseDirectory, "edutrack.db");
}

builder.Services.AddDbContext<EdutrackDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

// builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
// builder.WebHost.UseUrls("http://localhost:7000");

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200",
                    "https://localhost:7010",
                    "http://localhost:7010",
                    "http://edutrack.warehouse-system.uz",
                    "https://edutrack.warehouse-system.uz")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// Repositories
builder.Services.AddScoped<IUserReporitory, UserRepository>();
builder.Services.AddScoped<IProfessionRepository, ProfessionRepository>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<IGroupsRepository, GroupRepository>();
builder.Services.AddScoped<ISubjectRepository, SubjectRepository>();
builder.Services.AddScoped<IEmployeeSubjectGroupRepository, EmployeeSubjectGroupRepository>();
builder.Services.AddScoped<IAssignmentRepository, AssignmentRepository>();
builder.Services.AddScoped<ISubmissionsRepository, SubmissionRepository>();
builder.Services.AddScoped<IGradeRepository, GradeRepository>();
builder.Services.AddScoped<INewsRepository, NewsRepository>();

// Services
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
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "EduTrack API", Version = "v1" });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header. Example: 'Bearer {token}'"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Auto-migrate database on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<EdutrackDbContext>();
    db.Database.Migrate();
}

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
});

// app.UseDefaultFiles();
// app.UseStaticFiles();

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

// CRITICAL: Authentication MUST come BEFORE Authorization
app.UseAuthentication();
app.UseAuthorization();

// Serve uploaded files
var uploadsPath = Path.Combine(AppContext.BaseDirectory, "Uploads");
if (!Directory.Exists(uploadsPath))
    Directory.CreateDirectory(uploadsPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/Uploads"
});

app.MapControllers();
// app.MapFallbackToFile("index.html");

app.Run();
