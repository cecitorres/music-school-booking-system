using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicSchoolBookingSystem.Models
{
    public class User
    {
        [Key] // Primary key
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Auto-increment
        public int Id { get; set; }
        
        [Required] 
        [MaxLength(255)]
        public required string FirstName { get; set; }

        [Required]
        [MaxLength(255)]
        public required string LastName { get; set; }

        [Required]
        [MaxLength(255)]
        [EmailAddress]
        public required string Email { get; set; }
        
        [Required]
        [MaxLength(255)]
        [DataType(DataType.Password)]
        public required string PasswordHash { get; set; }

        [Required]
        [MaxLength(15)]
        public required string PhoneNumber { get; set; }
        
        [Required]
        // Student, Teacher, Admin
        [MaxLength(50)]
        public required string Role { get; set; }
        
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Auto-generated timestamp
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Student Student { get; set; }
        public Teacher Teacher { get; set; }
    }
}