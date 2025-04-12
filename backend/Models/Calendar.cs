using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MusicSchoolBookingSystem.Models
{
    public class Calendar
    {
        [Key] // Primary key
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Auto-increment
        public int Id { get; set; }

        [Required] // TeacherId is required
        public int TeacherId { get; set; }

        [Required] // StartTime is required
        public DateTime StartTime { get; set; }

        [Required] // EndTime is required
        public DateTime EndTime { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Auto-generated timestamp
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property for the related Teacher
        [ForeignKey("TeacherId")] // Foreign key relationship
        [JsonIgnore] // Ignore this property during serialization
        public Teacher Teacher { get; set; } = null!; // Non-nullable reference type
    }
}