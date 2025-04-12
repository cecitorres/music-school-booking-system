using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicSchoolBookingSystem.Models
{
    public class Student
    {
        [Key] // Primary key
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Auto-increment
        public int Id { get; set; }

        [Required] // Name is required
        [MaxLength(255)] // Limit the name length
        public string Name { get; set; } = null!;

        [Required]
        [EmailAddress] // Ensure a valid email format
        public string Email { get; set; } = null!;

        [MaxLength(15)] // Limit phone number length
        public string? Phone { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
