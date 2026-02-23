using EduTrackDataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduTrackDataAccess
{
    public class EdutrackDbContext : DbContext
    {
        public EdutrackDbContext(DbContextOptions<EdutrackDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Profession> Professions { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<EmployeeSubjectGroup> EmployeeSubjectGroups { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<News> News { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // USER
            modelBuilder.Entity<User>()
                .HasKey(u => u.Id);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // PROFESSION
            modelBuilder.Entity<Profession>()
                .HasIndex(p => p.Code)
                .IsUnique();

            // EMPLOYEE
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.User)
                .WithOne(u => u.Employee)
                .HasForeignKey<Employee>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Profession)
                .WithMany()
                .HasForeignKey(e => e.ProfessionId)
                .OnDelete(DeleteBehavior.SetNull);

            // STUDENT
            modelBuilder.Entity<Student>()
                .HasOne(s => s.User)
                .WithOne(u => u.Student)
                .HasForeignKey<Student>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Student>()
                .HasOne(s => s.Group)
                .WithMany(g => g.Students)
                .HasForeignKey(s => s.GroupId)
                .OnDelete(DeleteBehavior.SetNull);

            // GROUP
            modelBuilder.Entity<Group>()
                .HasOne(g => g.Profession)
                .WithMany(p => p.Groups)
                .HasForeignKey(g => g.ProfessionId)
                .OnDelete(DeleteBehavior.SetNull);

            // EMPLOYEE-SUBJECT-GROUP
            modelBuilder.Entity<EmployeeSubjectGroup>()
                .HasIndex(esg => new { esg.EmployeeId, esg.SubjectId, esg.GroupId })
                .IsUnique();

            modelBuilder.Entity<EmployeeSubjectGroup>()
                .HasOne(esg => esg.Employee)
                .WithMany(e => e.EmployeeSubjectGroups)
                .HasForeignKey(esg => esg.EmployeeId);

            modelBuilder.Entity<EmployeeSubjectGroup>()
                .HasOne(esg => esg.Subject)
                .WithMany(s => s.EmployeeSubjectGroups)
                .HasForeignKey(esg => esg.SubjectId);

            modelBuilder.Entity<EmployeeSubjectGroup>()
                .HasOne(esg => esg.Group)
                .WithMany(g => g.EmployeeSubjectGroups)
                .HasForeignKey(esg => esg.GroupId);

            // ASSIGNMENT
            modelBuilder.Entity<Assignment>()
                .HasOne(a => a.Subject)
                .WithMany()
                .HasForeignKey(a => a.SubjectId);

            modelBuilder.Entity<Assignment>()
                .HasOne(a => a.Group)
                .WithMany()
                .HasForeignKey(a => a.GroupId);

            modelBuilder.Entity<Assignment>()
                .HasOne(a => a.Employee)
                .WithMany(e => e.Assignments)
                .HasForeignKey(a => a.EmployeeId);

            // SUBMISSION
            modelBuilder.Entity<Submission>()
                .HasIndex(s => new { s.AssignmentId, s.StudentId })
                .IsUnique();

            modelBuilder.Entity<Submission>()
                .HasOne(s => s.Assignment)
                .WithMany(a => a.Submissions)
                .HasForeignKey(s => s.AssignmentId);

            modelBuilder.Entity<Submission>()
                .HasOne(s => s.Student)
                .WithMany(st => st.Submissions)
                .HasForeignKey(s => s.StudentId);

            // GRADE
            modelBuilder.Entity<Grade>()
                .HasOne(g => g.Submission)
                .WithOne(s => s.Grade)
                .HasForeignKey<Grade>(g => g.SubmissionId);

            modelBuilder.Entity<Grade>()
                .HasOne(g => g.Student)
                .WithMany(s => s.Grades)
                .HasForeignKey(g => g.StudentId);

            modelBuilder.Entity<Grade>()
                .HasOne(g => g.Employee)
                .WithMany()
                .HasForeignKey(g => g.EmployeeId);

            // Seed Admin User
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = "Admin"
            });
        }
    }
}
