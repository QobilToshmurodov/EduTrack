using EduTrackDataAccess;
using Microsoft.EntityFrameworkCore;
using EduTrackDataAccess.Repositories.Subjects;
using EduTrack.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<EdutrackDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddScoped<ISubjectRepository, SubjectRepository>();
builder.Services.AddScoped<SubjectService>();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();

app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();