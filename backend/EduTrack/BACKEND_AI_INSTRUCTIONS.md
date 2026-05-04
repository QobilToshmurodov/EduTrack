# EduTrack Backend - AI Agent Instructions

## Project Overview
EduTrack is a college/technical school management system built with .NET 8, Entity Framework Core, and PostgreSQL. This document provides complete context for AI agents working on the backend.

---

## Technology Stack

- **Framework:** .NET 8
- **ORM:** Entity Framework Core 8
- **Database:** PostgreSQL 14+
- **Authentication:** JWT Bearer tokens
- **Password Hashing:** BCrypt.Net-Next
- **API Pattern:** RESTful API with Repository Pattern

---

## Project Structure

```
EduTrack/
├── EduTrack/                      # Main API Project
│   ├── Controllers/               # API Endpoints (13 controllers)
│   ├── Models/                    # DTOs for API requests/responses
│   ├── Services/                  # Business logic layer
│   ├── Program.cs                 # Application startup
│   └── appsettings.json          # Configuration
│
└── EduTrackDataAccess/           # Data Access Layer
    ├── Entities/                 # Database models (12 entities)
    ├── Repositories/             # Data access repositories
    ├── Migrations/               # EF Core migrations
    └── EduTrackDbContext.cs      # DbContext configuration
```

---

## Database Schema

### Core Entities

#### 1. User (Authentication)
```csharp
public class User
{
    public int Id { get; set; }
    public string Username { get; set; }      // Unique
    public string PasswordHash { get; set; }  // BCrypt hashed
    public string Role { get; set; }          // "Admin", "Teacher", "Student"
    
    // Navigation
    public Student Student { get; set; }      // One-to-One
    public Teacher Teacher { get; set; }      // One-to-One
}
```

#### 2. Student
```csharp
public class Student
{
    public int Id { get; set; }
    public int UserId { get; set; }           // FK to User
    public int? GroupId { get; set; }         // FK to Group (nullable)
    public int? ParentId { get; set; }        // FK to Parent (nullable)
    
    // Navigation
    public User User { get; set; }
    public Group Group { get; set; }
    public Parent Parent { get; set; }
    public ICollection<Submission> Submissions { get; set; }
    public ICollection<AttendanceEvent> AttendanceEvents { get; set; }
}
```

#### 3. Teacher
```csharp
public class Teacher
{
    public int Id { get; set; }
    public int UserId { get; set; }           // FK to User
    public string Fullname { get; set; }
    
    // Navigation
    public User User { get; set; }
    public ICollection<Assignment> Assignments { get; set; }
    public ICollection<TeacherSubjectGroup> TeacherSubjectGroups { get; set; }
}
```

#### 4. Parent (For Telegram notifications)
```csharp
public class Parent
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string ChatId { get; set; }        // Telegram Chat ID
    public int StudentId { get; set; }        // FK to Student
    
    // Navigation
    public Student Student { get; set; }
    public ICollection<NotificationLog> NotificationLogs { get; set; }
}
```

#### 5. Group
```csharp
public class Group
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    // Navigation
    public ICollection<Student> Students { get; set; }
    public ICollection<Assignment> Assignments { get; set; }
    public ICollection<TeacherSubjectGroup> TeacherSubjectGroups { get; set; }
}
```

#### 6. Subject
```csharp
public class Subject
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    // Navigation
    public ICollection<Assignment> Assignments { get; set; }
    public ICollection<TeacherSubjectGroup> TeacherSubjectGroups { get; set; }
}
```

#### 7. TeacherSubjectGroup (Junction Table)
```csharp
public class TeacherSubjectGroup
{
    public int Id { get; set; }
    public int TeacherId { get; set; }        // FK
    public int SubjectId { get; set; }        // FK
    public int GroupId { get; set; }          // FK
    
    // Navigation
    public Teacher Teacher { get; set; }
    public Subject Subject { get; set; }
    public Group Group { get; set; }
}
```

#### 8. Assignment
```csharp
public class Assignment
{
    public int Id { get; set; }
    public int SubjectId { get; set; }        // FK
    public int GroupId { get; set; }          // FK
    public int TeacherId { get; set; }        // FK
    public string Title { get; set; }
    public DateTime Deadline { get; set; }
    
    // Navigation
    public Subject Subject { get; set; }
    public Group Group { get; set; }
    public Teacher Teacher { get; set; }
    public ICollection<Submission> Submissions { get; set; }
}
```

#### 9. Submission
```csharp
public class Submission
{
    public int Id { get; set; }
    public int AssignmentId { get; set; }     // FK
    public int StudentId { get; set; }        // FK
    public string FileUrl { get; set; }       // File location
    
    // Navigation
    public Assignment Assignment { get; set; }
    public Student Student { get; set; }
    public Grade Grade { get; set; }          // One-to-One
}
```

#### 10. Grade
```csharp
public class Grade
{
    public int Id { get; set; }
    public int SubmissionId { get; set; }     // FK (One-to-One)
    public int TeacherId { get; set; }        // FK
    public int Score { get; set; }
    
    // Navigation
    public Submission Submission { get; set; }
    public Teacher Teacher { get; set; }
}
```

#### 11. AttendanceEvent
```csharp
public class AttendanceEvent
{
    public int Id { get; set; }
    public int StudentId { get; set; }        // FK
    public int TeacherId { get; set; }        // FK
    public DateTime Timestamp { get; set; }
    public string EventType { get; set; }     // "arrived", "late", "left"
    public string Source { get; set; }        // "qr", "manual", "face" (NOTE: typo in original - "Sourse")
    
    // Navigation
    public Student Student { get; set; }
    public Teacher Teacher { get; set; }
}
```

#### 12. NotificationLog
```csharp
public class NotificationLog
{
    public int Id { get; set; }
    public int ParentId { get; set; }         // FK
    public int StudentId { get; set; }        // FK
    public int EventId { get; set; }          // FK to AttendanceEvent
    
    // Navigation
    public Parent Parent { get; set; }
    public Student Student { get; set; }
    public AttendanceEvent Event { get; set; }
}
```

---

## API Endpoints

### Authentication
```
POST /api/auth/login
Body: { "username": "string", "password": "string" }
Response: { "token": "jwt_token", "id": 1, "username": "admin", "role": "Admin" }
```

### Users (Admin only)
```
GET    /api/users           # Get all users
GET    /api/users/{id}      # Get user by ID
POST   /api/users           # Create user
PUT    /api/users/{id}      # Update user
DELETE /api/users/{id}      # Delete user
```

### Assignments
```
GET    /api/assignments
GET    /api/assignments/{id}
POST   /api/assignments
PUT    /api/assignments/{id}
DELETE /api/assignments/{id}

Request Body (POST/PUT):
{
    "subjectId": 1,
    "groupId": 2,
    "teacherId": 3,
    "title": "Assignment Title",
    "deadline": "2025-03-01T23:59:00"
}
```

### Attendance Events
```
GET    /api/attendanceevents
GET    /api/attendanceevents/{id}
POST   /api/attendanceevents
PUT    /api/attendanceevents/{id}
DELETE /api/attendanceevents/{id}

Request Body (POST):
{
    "studentId": 5,
    "teacherId": 3,
    "timestamp": "2025-02-07T08:15:00",
    "eventType": "arrived",
    "source": "manual"
}
```

### Submissions
```
GET    /api/submissions
GET    /api/submissions/{id}
POST   /api/submissions
PUT    /api/submissions/{id}
DELETE /api/submissions/{id}

Request Body (POST):
{
    "assignmentId": 1,
    "studentId": 5,
    "fileUrl": "/uploads/submission_123.pdf"
}
```

### Grades
```
GET    /api/grades
GET    /api/grades/{id}
POST   /api/grades
PUT    /api/grades/{id}
DELETE /api/grades/{id}

Request Body (POST):
{
    "submissionId": 10,
    "teacherId": 3,
    "score": 85
}
```

### Groups, Subjects, Students, Teachers, Parents
All follow standard CRUD pattern:
```
GET    /api/{entity}
GET    /api/{entity}/{id}
POST   /api/{entity}
PUT    /api/{entity}/{id}
DELETE /api/{entity}/{id}
```

---

## Authentication & Authorization

### JWT Configuration
```json
// appsettings.json
{
  "Jwt": {
    "Key": "your-secret-key-minimum-32-characters-long",
    "Issuer": "EduTrack",
    "Audience": "EduTrack-Users"
  }
}
```

### Password Hashing
```csharp
// Creating user
var passwordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword);

// Verifying password
var isValid = BCrypt.Net.BCrypt.Verify(plainPassword, storedHash);
```

### JWT Token Generation
```csharp
// In JWTService
var claims = new[]
{
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
    new Claim(ClaimTypes.Name, user.Username),
    new Claim(ClaimTypes.Role, user.Role)
};

var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

var token = new JwtSecurityToken(
    issuer: _configuration["Jwt:Issuer"],
    audience: _configuration["Jwt:Audience"],
    claims: claims,
    expires: DateTime.Now.AddDays(1),
    signingCredentials: creds
);

return new JwtSecurityTokenHandler().WriteToken(token);
```

---

## Database Configuration

### Connection String
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=edutrack_db;Username=postgres;Password=yourpassword"
  }
}
```

### Migrations
```bash
# Create migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Drop database (development only)
dotnet ef database drop

# Remove last migration
dotnet ef migrations remove
```

### Seeding Initial Data
```csharp
// In OnModelCreating
modelBuilder.Entity<User>().HasData(new User
{
    Id = 1,
    Username = "admin",
    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
    Role = "Admin"
});
```

---

## Known Issues & TODO

### Issues:
1. **Typo in AttendanceEvent:** Property name is "Sourse" instead of "Source"
2. **Role as string:** Should be enum for type safety
3. **No file upload endpoint:** FileUrl is just a string, no actual upload mechanism
4. **No validation attributes:** Models lack [Required], [MaxLength], etc.
5. **No authorization attributes:** Controllers lack [Authorize(Roles = "...")]

### Missing Features (Post-MVP):
1. File upload/download endpoints
2. Statistics/analytics endpoints for directors
3. QR code generation/verification for attendance
4. Telegram bot integration
5. Pagination for list endpoints
6. Search/filter functionality
7. Batch operations
8. Soft delete
9. Audit logging

---

## Development Guidelines

### Adding New Entity:
1. Create entity in `Entities/` folder
2. Add DbSet in `EduTrackDbContext.cs`
3. Configure relationships in `OnModelCreating`
4. Create DTO in `Models/`
5. Create repository interface and implementation
6. Create service
7. Create controller
8. Register in `Program.cs`
9. Create migration

### Code Patterns:

**Controller Example:**
```csharp
[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly StudentService _service;
    
    public StudentsController(StudentService service)
    {
        _service = service;
    }
    
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await _service.GetAll());
    }
    
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] StudentModel model)
    {
        var created = await _service.Create(model);
        return CreatedAtRoute(new { id = created.Id }, created);
    }
}
```

**Service Example:**
```csharp
public class StudentService
{
    private readonly IStudentRepository _repository;
    
    public async Task<IEnumerable<StudentModel>> GetAll()
    {
        var entities = await _repository.GetAll();
        return entities.Select(MapToModel);
    }
    
    public async Task<StudentModel> Create(StudentModel model)
    {
        var entity = MapToEntity(model);
        var created = await _repository.Create(entity);
        return MapToModel(created);
    }
}
```

---

## Testing

### Sample Requests:

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Get Assignments (with auth):**
```bash
curl -X GET http://localhost:5000/api/assignments \
  -H "Authorization: Bearer {token}"
```

**Create Assignment:**
```bash
curl -X POST http://localhost:5000/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "subjectId": 1,
    "groupId": 2,
    "teacherId": 3,
    "title": "Math Homework",
    "deadline": "2025-03-01T23:59:00"
  }'
```

---

## Environment Setup

### Prerequisites:
- .NET 8 SDK
- PostgreSQL 14+
- Visual Studio 2022 or VS Code

### First Time Setup:
```bash
# Restore packages
dotnet restore

# Setup database
dotnet ef database update

# Run application
dotnet run
```

### Development:
```bash
# Watch mode (auto-reload)
dotnet watch run

# Run on specific port
dotnet run --urls="https://localhost:7001;http://localhost:5000"
```

---

## Security Considerations

1. **Never commit appsettings.json with real credentials**
2. **Use User Secrets for development:**
   ```bash
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "your-connection-string"
   dotnet user-secrets set "Jwt:Key" "your-secret-key"
   ```
3. **Enable CORS properly for frontend:**
   ```csharp
   builder.Services.AddCors(options => {
       options.AddDefaultPolicy(policy => {
           policy.WithOrigins("http://localhost:4200")
                 .AllowAnyHeader()
                 .AllowAnyMethod();
       });
   });
   ```
4. **Always hash passwords with BCrypt**
5. **Validate all inputs**
6. **Use HTTPS in production**

---

## AI Agent Instructions

When working on this backend:

1. **Follow existing patterns** - Use Repository pattern, Service layer
2. **Maintain consistency** - Match naming conventions
3. **Add migrations** - Always create migration after entity changes
4. **Hash passwords** - Never store plain text passwords
5. **Use DTOs** - Don't expose entities directly in API
6. **Handle errors** - Implement proper error handling
7. **Document changes** - Update this file when making architectural changes
8. **Test endpoints** - Verify all CRUD operations work
9. **Check relationships** - Ensure EF Core navigation properties are correct
10. **Consider performance** - Use async/await, avoid N+1 queries

---

## Contact & Support

For questions about backend architecture, refer to:
- Entity Framework Core documentation
- ASP.NET Core documentation
- This project's GitHub repository

---

**Last Updated:** 2025-02-07
**Version:** 1.0.0 MVP
**Status:** Active Development
