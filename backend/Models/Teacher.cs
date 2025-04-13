using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MusicSchoolBookingSystem.Models
{
    public class Teacher
    {
        [Key] // Primary key
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Auto-increment
        public int Id { get; set; }

        [Required] // UserId is required
        public int UserId { get; set; }

        [MaxLength(255)] // Limit length to 255 characters
        public string? Instruments { get; set; } // Comma-separated list of instruments

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Auto-generated timestamp
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property for the related User
        [ForeignKey("UserId")] // Foreign key relationship
        [JsonIgnore]
        public User User { get; set; } = null!; // Non-nullable reference type
        
        // Navigation property for related Calendar entries
        public ICollection<Calendar> CalendarEntries { get; set; } = new List<Calendar>();
    }
}