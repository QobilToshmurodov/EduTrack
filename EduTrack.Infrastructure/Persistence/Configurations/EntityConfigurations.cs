using EduTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduTrack.Infrastructure.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(u => u.Id);
            builder.HasIndex(u => u.Username).IsUnique();
            builder.Property(u => u.Username).IsRequired().HasMaxLength(50);
            builder.Property(u => u.PasswordHash).IsRequired();
            builder.Property(u => u.Role).IsRequired().HasConversion<string>();
        }
    }

    public class StudentConfiguration : IEntityTypeConfiguration<Student>
    {
        public void Configure(EntityTypeBuilder<Student> builder)
        {
            builder.HasKey(s => s.Id);
            builder.Property(s => s.FullName).IsRequired().HasMaxLength(100);

            builder.HasOne(s => s.User)
                .WithOne(u => u.Student)
                .HasForeignKey<Student>(s => s.Id)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(s => s.Group)
                .WithMany(g => g.Students)
                .HasForeignKey(s => s.GroupId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class TeacherConfiguration : IEntityTypeConfiguration<Teacher>
    {
        public void Configure(EntityTypeBuilder<Teacher> builder)
        {
            builder.HasKey(t => t.Id);
            builder.Property(t => t.FullName).IsRequired().HasMaxLength(100);

            builder.HasOne(t => t.User)
                .WithOne(u => u.Teacher)
                .HasForeignKey<Teacher>(t => t.Id)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class TeacherSubjectGroupConfiguration : IEntityTypeConfiguration<TeacherSubjectGroup>
    {
        public void Configure(EntityTypeBuilder<TeacherSubjectGroup> builder)
        {
            builder.HasKey(tsg => new { tsg.TeacherId, tsg.SubjectId, tsg.GroupId });

            builder.HasOne(tsg => tsg.Teacher)
                .WithMany(t => t.TeacherSubjectGroups)
                .HasForeignKey(tsg => tsg.TeacherId);

            builder.HasOne(tsg => tsg.Subject)
                .WithMany(s => s.TeacherSubjectGroups)
                .HasForeignKey(tsg => tsg.SubjectId);

            builder.HasOne(tsg => tsg.Group)
                .WithMany(g => g.TeacherSubjectGroups)
                .HasForeignKey(tsg => tsg.GroupId);
        }
    }

    public class ParentConfiguration : IEntityTypeConfiguration<Parent>
    {
        public void Configure(EntityTypeBuilder<Parent> builder)
        {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.FullName).IsRequired().HasMaxLength(100);

            builder.HasOne(p => p.Student)
                .WithOne(s => s.Parent)
                .HasForeignKey<Parent>(p => p.LinkedStudentId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class AssignmentConfiguration : IEntityTypeConfiguration<Assignment>
    {
        public void Configure(EntityTypeBuilder<Assignment> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Title).IsRequired().HasMaxLength(200);
            builder.Property(a => a.Description).IsRequired();

            builder.HasOne(a => a.Subject)
                .WithMany(s => s.Assignments)
                .HasForeignKey(a => a.SubjectId);

            builder.HasOne(a => a.Group)
                .WithMany(g => g.Assignments)
                .HasForeignKey(a => a.GroupId);

            builder.HasOne(a => a.Teacher)
                .WithMany(t => t.Assignments)
                .HasForeignKey(a => a.TeacherId);
        }
    }

    public class SubmissionConfiguration : IEntityTypeConfiguration<Submission>
    {
        public void Configure(EntityTypeBuilder<Submission> builder)
        {
            builder.HasKey(s => s.Id);
            builder.Property(s => s.FileUrl).IsRequired();
            builder.Property(s => s.Status).HasConversion<string>();

            builder.HasOne(s => s.Assignment)
                .WithMany(a => a.Submissions)
                .HasForeignKey(s => s.AssignmentId);

            builder.HasOne(s => s.Student)
                .WithMany(st => st.Submissions)
                .HasForeignKey(s => s.StudentId);
        }
    }

    public class GradeConfiguration : IEntityTypeConfiguration<Grade>
    {
        public void Configure(EntityTypeBuilder<Grade> builder)
        {
            builder.HasKey(g => g.Id);

            builder.HasOne(g => g.Submission)
                .WithOne(s => s.Grade)
                .HasForeignKey<Grade>(g => g.SubmissionId);

            builder.HasOne(g => g.Teacher)
                .WithMany()
                .HasForeignKey(g => g.TeacherId);
        }
    }

    public class AttendanceEventConfiguration : IEntityTypeConfiguration<AttendanceEvent>
    {
        public void Configure(EntityTypeBuilder<AttendanceEvent> builder)
        {
            builder.HasKey(ae => ae.Id);
            builder.Property(ae => ae.EventType).HasConversion<string>();
            builder.Property(ae => ae.Source).HasConversion<string>();

            builder.HasOne(ae => ae.Student)
                .WithMany(s => s.AttendanceEvents)
                .HasForeignKey(ae => ae.StudentId);

            builder.HasOne(ae => ae.Teacher)
                .WithMany()
                .HasForeignKey(ae => ae.TeacherId)
                .IsRequired(false);
        }
    }
}
