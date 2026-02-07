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
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Parent> Parents { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<TeacherSubjectGroup> TeacherSubjectGroups { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<AttendanceEvent> AttendanceEvents { get; set; }
        public DbSet<NotificationLog> NotificationLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // USERS
            modelBuilder.Entity<User>()
                .HasKey(u => u.Id);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();


            //  TEACHER 
            modelBuilder.Entity<Teacher>()
                .HasOne(t => t.User)
                .WithOne(u => u.Teacher)
                .HasForeignKey<Teacher>(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            //  STUDENT
            modelBuilder.Entity<Student>()
                .HasOne(s => s.Group)
                .WithMany(g => g.Students)
                .HasForeignKey(s => s.GroupId);

            modelBuilder.Entity<Student>()
               .HasOne(s => s.User)
               .WithOne(u => u.Student)
               .HasForeignKey<Student>(s => s.UserId)
               .OnDelete(DeleteBehavior.Cascade);

            // PARENT 
            modelBuilder.Entity<Parent>()
                .HasOne(p => p.Student)
                .WithOne(s => s.Parent)
                .HasForeignKey<Parent>(p => p.StudentId);

            // TEACHER-SUBJECT-GROUP 
            modelBuilder.Entity<TeacherSubjectGroup>()
                .HasOne(tsg => tsg.Teacher)
                .WithMany(t => t.TeacherSubjectGroups)
                .HasForeignKey(tsg => tsg.TeacherId);

            modelBuilder.Entity<TeacherSubjectGroup>()
                .HasOne(tsg => tsg.Subject)
                .WithMany(s => s.TeacherSubjectGroups)
                .HasForeignKey(tsg => tsg.SubjectId);

            modelBuilder.Entity<TeacherSubjectGroup>()
                .HasOne(tsg => tsg.Group)
                .WithMany(g => g.TeacherSubjectGroups)
                .HasForeignKey(tsg => tsg.GroupId);

            // ASSIGNMENT
            modelBuilder.Entity<Assignment>()
                .HasOne(a => a.Subject)
                .WithMany(s => s.Assignments)
                .HasForeignKey(a => a.SubjectId);

            modelBuilder.Entity<Assignment>()
                .HasOne(a => a.Group)
                .WithMany(g => g.Assignments)
                .HasForeignKey(a => a.GroupId);

            modelBuilder.Entity<Assignment>()
                .HasOne(a => a.Teacher)
                .WithMany(t => t.Assignments)
                .HasForeignKey(a => a.TeacherId);

            // SUBMISSION 
            modelBuilder.Entity<Submission>()
                .HasOne(s => s.Assignment)
                .WithMany(a => a.Submissions)
                .HasForeignKey(s => s.AssignmentId);

            modelBuilder.Entity<Submission>()
                .HasOne(s => s.Student)
                .WithMany(st => st.Submissions)
                .HasForeignKey(s => s.StudentId);

            //  GRADE 
            modelBuilder.Entity<Grade>()
                .HasOne(g => g.Submission)
                .WithOne(s => s.Grade)
                .HasForeignKey<Grade>(g => g.SubmissionId);

            modelBuilder.Entity<Grade>()
                .HasOne(g => g.Teacher)
                .WithMany()
                .HasForeignKey(g => g.TeacherId);

            // ATTENDANCE EVENT
            modelBuilder.Entity<AttendanceEvent>()
                .HasOne(ae => ae.Student)
                .WithMany(s => s.AttendanceEvents)
                .HasForeignKey(ae => ae.StudentId);

            modelBuilder.Entity<AttendanceEvent>()
                .HasOne(ae => ae.Teacher)
                .WithMany()
                .HasForeignKey(ae => ae.TeacherId)
                .IsRequired(false);

            // NOTIFICATION LOG
            modelBuilder.Entity<NotificationLog>()
                .HasOne(n => n.Parent)
                .WithMany(p => p.NotificationLogs)
                .HasForeignKey(n => n.ParentId);

            modelBuilder.Entity<NotificationLog>()
                .HasOne(n => n.Student)
                .WithMany()
                .HasForeignKey(n => n.StudentId);

            modelBuilder.Entity<NotificationLog>()
                .HasOne(n => n.Event)
                .WithMany()
                .HasForeignKey(n => n.EventId);

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