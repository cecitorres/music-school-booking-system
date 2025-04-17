using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicSchoolBookingSystem.Models;

namespace MusicSchoolBookingSystem.Controllers
{
    [Route("api/teachers")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TeachersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/teachers
        [Authorize(Roles = "Admin, Teacher, Student")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Teacher>>> GetTeachers()
        {
            // Get List of Teachers, and add info from Users table
            var teachers = await _context.Teachers
                .Include(t => t.User) // Include the User navigation property
                .Select(t => new TeacherResponse
                {
                    Id = t.Id,
                    FullName = $"{t.User.FirstName} {t.User.LastName}",
                    Email = t.User.Email,
                    PhoneNumber = t.User.PhoneNumber,
                    Instruments = string.IsNullOrEmpty(t.Instruments) ? "Not specified" : t.Instruments
                })
                .ToListAsync();

            return Ok(teachers);
        }

        // GET: api/teachers/5        
        [Authorize(Roles = "Admin, Teacher, Student")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Teacher>> GetTeacher(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            

            if (teacher == null)
            {
                return NotFound();
            }

            // Include the User navigation property to get user details
            var teacherDetails = await _context.Teachers
                .Include(t => t.User) // Include the User navigation property
                .Where(t => t.Id == id)
                .Select(t => new TeacherResponse
                {
                    Id = t.Id,
                    FullName = $"{t.User.FirstName} {t.User.LastName}",
                    Email = t.User.Email,
                    PhoneNumber = t.User.PhoneNumber,
                    Instruments = string.IsNullOrEmpty(t.Instruments) ? "Not specified" : t.Instruments
                })
                .FirstOrDefaultAsync();

            return Ok(teacherDetails);
        }

        // PUT: api/teachers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "Admin, Teacher")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTeacher(int id, Teacher teacher)
        {
            if (id != teacher.Id)
            {
                return BadRequest();
            }

            _context.Entry(teacher).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeacherExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/teachers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Teacher>> PostTeacher(Teacher teacher)
        {
            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTeacher", new { id = teacher.Id }, teacher);
        }

        // DELETE: api/teachers/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null)
            {
                return NotFound();
            }

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/teachers/{teacherId}/calendars
        [Authorize(Roles = "Admin, Teacher")]
        [HttpPost("{teacherId}/calendars")]
        public async Task<ActionResult> AddCalendarSlots(int teacherId, List<CalendarSlotRequest> slots)
        {
            if (slots == null || !slots.Any())
            {
                return BadRequest("No calendar slots provided.");
            }

            try
            {
                // Check if the teacher exists
                var teacher = await _context.Teachers.FindAsync(teacherId);
                if (teacher == null)
                {
                    return NotFound($"Teacher with ID {teacherId} not found.");
                }

                // Validate and add each slot
                foreach (var slot in slots)
                {
                    // Validate StartTime and EndTime
                    if (slot.StartTime >= slot.EndTime)
                    {
                        return BadRequest($"Invalid time range for slot: StartTime must be before EndTime.");
                    }

                    // Ensure DateTime values are in UTC
                    var startTimeUtc = slot.StartTime.ToUniversalTime();
                    var endTimeUtc = slot.EndTime.ToUniversalTime();

                    // Check for overlapping slots
                    var overlappingSlot = await _context.Calendars
                        .AnyAsync(c => c.TeacherId == teacherId &&
                                    c.StartTime < endTimeUtc &&
                                    c.EndTime > startTimeUtc);

                    if (overlappingSlot)
                    {
                        return BadRequest($"Overlapping slot detected for teacher ID {teacherId}.");
                    }

                    // Create a new Calendar entity
                    var calendar = new Calendar
                    {
                        StartTime = startTimeUtc,
                        EndTime = endTimeUtc,
                        TeacherId = teacherId
                    };

                    // Add the slot to the context
                    _context.Calendars.Add(calendar);
                }

                // Save all changes to the database
                await _context.SaveChangesAsync();

                // Return a success response
                return Ok(new { message = "Calendar slots added successfully." });
            }
            catch (Exception ex)
            {
                // Log the exception (you can use a logging framework like Serilog or NLog)
                // Example: _logger.LogError(ex, "An error occurred while adding calendar slots.");

                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        // GET: api/teachers/{teacherId}/calendars
        [Authorize(Roles = "Admin, Teacher, Student")]
        [HttpGet("{teacherId}/calendars")]
        public async Task<ActionResult<IEnumerable<CalendarSlotResponse>>> GetTeacherCalendarSlots(int teacherId)
        {
            try
            {
                // Check if the teacher exists
                var teacher = await _context.Teachers.FindAsync(teacherId);
                if (teacher == null)
                {
                    return NotFound($"Teacher with ID {teacherId} not found.");
                }

                // Get all available calendar slots for the teacher
                var availableSlots = await _context.Calendars
                    .Where(c => c.TeacherId == teacherId) // Filter by teacherId
                    .Select(c => new CalendarSlotResponse
                    {
                        Id = c.Id,
                        StartTime = c.StartTime,
                        EndTime = c.EndTime
                    })
                    .ToListAsync();

                // Return the list of available slots
                return Ok(availableSlots);
            }
            catch (Exception ex)
            {
                // Log the exception (you can use a logging framework like Serilog or NLog)
                // Example: _logger.LogError(ex, "An error occurred while fetching calendar slots.");

                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        private bool TeacherExists(int id)
        {
            return _context.Teachers.Any(e => e.Id == id);
        }
    }

    // Request model for calendar slots
    public class CalendarSlotRequest
    {
        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }
    }

    // Response model for calendar slots
    public class CalendarSlotResponse
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }

    public class TeacherResponse
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Instruments { get; set; }
    }
}