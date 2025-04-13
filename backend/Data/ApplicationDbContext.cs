using Microsoft.EntityFrameworkCore;

namespace MusicSchoolBookingSystem.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Teacher> Teachers { get; set; } = null!;
        public DbSet<Calendar> Calendars { get; set; } = null!;
        public DbSet<Student> Students { get; set; } = null!;
        public DbSet<Booking> Bookings { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Student>()
                .HasOne(s => s.User)
                .WithOne(u => u.Student)
                .HasForeignKey<Student>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Teacher>()
                .HasOne(t => t.User)
                .WithOne(u => u.Teacher)
                .HasForeignKey<Teacher>(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Define the relationship between Teacher and Calendar
            modelBuilder.Entity<Teacher>()
                .HasMany(t => t.CalendarEntries) // A Teacher has many Calendar entries
                .WithOne(c => c.Teacher) // A Calendar entry belongs to one Teacher
                .HasForeignKey(c => c.TeacherId); // Foreign key is TeacherId

            modelBuilder.Entity<Calendar>()
                .HasIndex(c => new { c.TeacherId, c.StartTime, c.EndTime })
                .IsUnique(); // Ensure no overlapping slots for the same teacher

            // Define relationships between Booking, Calendar, and Student
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Calendar)
                .WithMany()
                .HasForeignKey(b => b.CalendarId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Student)
                .WithMany()
                .HasForeignKey(b => b.StudentId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}