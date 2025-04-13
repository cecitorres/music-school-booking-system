using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MusicSchoolBookingSystem.Models
{
    public class Student
    {
        [Key] // Primary key
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Auto-increment
        public int Id { get; set; }

        [Required] // UserId is required
        public int UserId { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property for the related User
        [ForeignKey("UserId")] // Foreign key relationship
        [JsonIgnore]
        public User User { get; set; } = null!; // Non-nullable reference type
    }
}
