using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicSchoolBookingSystem.Models
{
    public class Booking
    {
        [Key] // Primary key
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Auto-increment
        public int Id { get; set; }

        [Required]
        public int CalendarId { get; set; } // Foreign key linking to Calendar

        [Required]
        public int StudentId { get; set; } // Foreign key linking to Student

        [Required]
        public DateTime StartTime { get; set; } // Booking start time

        [Required]
        public DateTime EndTime { get; set; } // Booking end time

        [Required]
        [MaxLength(50)] // Limit status to 50 characters
        public string Status { get; set; } = "Pending"; // Default status

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("CalendarId")]
        public Calendar Calendar { get; set; } = null!;

        [ForeignKey("StudentId")]
        public Student Student { get; set; } = null!;
    }
}
