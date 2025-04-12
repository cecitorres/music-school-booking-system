using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicSchoolBookingSystem.Models
{
    public class Teacher
    {
        [Key] // Primary key
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Auto-increment
        public int Id { get; set; }

        [Required] // Name is required
        [MaxLength(255)] // Limit length to 255 characters
        public required string Name { get; set; }

        [Required] // Email is required
        [MaxLength(255)] // Limit length to 255 characters
        [EmailAddress] // Validate email format
        public required string Email { get; set; }

        [MaxLength(15)] // Limit length to 15 characters
        public string? PhoneNumber { get; set; }

        [MaxLength(255)] // Limit length to 255 characters
        public string? Instruments { get; set; } // Comma-separated list of instruments

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Auto-generated timestamp
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property for related Calendar entries
        public ICollection<Calendar> CalendarEntries { get; set; } = new List<Calendar>();
    }
}