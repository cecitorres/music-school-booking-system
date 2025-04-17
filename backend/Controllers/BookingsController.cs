using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicSchoolBookingSystem.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace MusicSchoolBookingSystem.Controllers
{
    [Route("api/bookings")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Bookings
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
        {
            
            // Get List of Bookings, and add info from Users table
            var bookings = await _context.Bookings
                .Include(b => b.Calendar)
                .ThenInclude(c => c.Teacher)
                .Include(b => b.Student)
                .Select(b => new BookingResponseDto
                {
                    Id = b.Id,
                    TeacherName = $"{b.Calendar.Teacher.User.FirstName} {b.Calendar.Teacher.User.LastName}",
                    StudentName = $"{b.Student.User.FirstName} {b.Student.User.LastName}",
                    StartTime = b.StartTime,
                    EndTime = b.EndTime,
                    Status = b.Status
                })
                .ToListAsync();

            return Ok(bookings);
        }

        // GET: api/Bookings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);

            if (booking == null)
            {
                return NotFound();
            }

            return booking;
        }

        // PUT: api/Bookings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBooking(int id, Booking booking)
        {
            if (id != booking.Id)
            {
                return BadRequest();
            }

            _context.Entry(booking).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingExists(id))
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

        // Student booking a calendar slot
        [HttpPost]
        public async Task<ActionResult<Booking>> PostBooking(BookingRequest bookingRequest)
        {
            // Validate booking request is for 60 minutes only (we only support 60 minutes for now)
            if (bookingRequest.Duration != 60)
            {
                return BadRequest("Booking duration must be 60 minutes.");
            }

            // Validate the teacher exists
            var teacher = await _context.Teachers.FindAsync(bookingRequest.TeacherId);
            if (teacher == null)
            {
                return NotFound("Teacher not found.");
            }

            // Validate the teacher's availability            
            var bookingEndTime = bookingRequest.StartTime.AddMinutes(bookingRequest.Duration);
            var calendar = await _context.Calendars
                .Where(c => c.TeacherId == bookingRequest.TeacherId && c.StartTime <= bookingRequest.StartTime && c.EndTime >= bookingEndTime)
                .FirstOrDefaultAsync();

            if (calendar == null)
            {
                return BadRequest("Teacher is not available for the requested time.");
            }

            // Validate the student does not already have a booking for this time slot
            var duplicateBooking = await _context.Bookings
                .Where(b => b.StudentId == bookingRequest.StudentId
                    && b.CalendarId == calendar.Id
                    && b.StartTime == bookingRequest.StartTime
                    && b.EndTime == bookingEndTime)
                .FirstOrDefaultAsync();

            if (duplicateBooking != null)
            {
                return BadRequest("You have already requested a booking for this time slot.");
            }

            // Validate the booking does not overlap with existing bookings
            var existingBooking = await _context.Bookings
                .Where(b => b.CalendarId == calendar.Id
                    && b.Status == "Accepted"
                    && b.StartTime < bookingEndTime
                    && bookingRequest.StartTime < b.EndTime)
                .FirstOrDefaultAsync();
            if (existingBooking != null)
            {
                return BadRequest("Booking overlaps with an existing booking.");
            }

            // Create a new booking
            var booking = new Booking
            {
                CalendarId = calendar.Id,
                StudentId = bookingRequest.StudentId,
                StartTime = bookingRequest.StartTime,
                EndTime = bookingEndTime,
                Status = "Pending"
            };

            // Add the booking to the database
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            // Return booking id, student id, start time, end time, status with a 201 Created response

            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, new 
            {
                Id = booking.Id,                
                StartTime = booking.StartTime,
                EndTime = booking.EndTime,
                Status = booking.Status
            });
            // return CreatedAtAction(nameof(PostBooking), new { id = booking.Id }, booking);
        }

        // See my next bookings for a teacher or student , identified by userId in token bearer auth
        [HttpGet("me")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetMyBookings()
        {
            // Assuming you have a way to get the userId from the token bearer auth
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            // Fetch bookings for the user (either as a teacher or student)
            var bookings = await _context.Bookings
                .Where(b => b.StudentId.ToString() == userId || b.Calendar.TeacherId.ToString() == userId)
                .ToListAsync();

            return Ok(bookings);
        }

        // GET /api/bookings/{id}/status
        [Authorize(Roles = "Admin, Teacher, Student")]
        [HttpGet("{id}/status")]
        public async Task<IActionResult> GetBookingStatus(int id)
        {
            // try catch
            try {
            // Include Student Name and Teacher Name in the response
            var booking = await _context.Bookings
                .Include(b => b.Student)
                    .ThenInclude(s => s.User) // Include Student's User
                .Include(b => b.Calendar)
                    .ThenInclude(c => c.Teacher)
                        .ThenInclude(t => t.User) // Include Teacher's User
                .FirstOrDefaultAsync(b => b.Id == id);
            
            if (booking == null)
            {
                return NotFound();
            }

            // Check if the user is authorized to view the booking status
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null || (User.IsInRole("Teacher") && booking.Calendar.TeacherId.ToString() != userId) &&
                (User.IsInRole("Student") && booking.StudentId.ToString() != userId))
            {
                return Forbid("You are not authorized to view this booking status.");
            }

            return Ok(new {
                Id = booking.Id,
                Status = booking.Status,
                StudentName = $"{booking.Student.User.FirstName} {booking.Student.User.LastName}",
                TeacherName = $"{booking.Calendar.Teacher.User.FirstName} {booking.Calendar.Teacher.User.LastName}",
                StartTime = booking.StartTime,
                EndTime = booking.EndTime,
            });
            } catch (Exception ex) {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        // PATCH /api/bookings/{id}/status
        [Authorize(Roles = "Admin, Teacher")]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] StatusUpdateRequest statusUpdateRequest)
        {
            // Validate the status
            if (statusUpdateRequest.Status != "Accepted" && statusUpdateRequest.Status != "Rejected")
            {
                return BadRequest("Invalid status. Only 'Accepted' or 'Rejected' are allowed.");
            }

            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            // Check if the booking is already accepted or rejected
            if (booking.Status == "Accepted" || booking.Status == "Rejected")
            {
                return BadRequest("Booking status has already been updated.");
            }

            // Check if the user is authorized to update the booking status
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null || (User.IsInRole("Teacher") && booking.Calendar.TeacherId.ToString() != userId))
            {
                return Forbid("You are not authorized to update this booking status.");
            }

            // Update the booking status
            booking.Status = statusUpdateRequest.Status;
            _context.Entry(booking).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        public class StatusUpdateRequest
        {
            public string Status { get; set; }
        }

        // DELETE: api/Bookings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookingExists(int id)
        {
            return _context.Bookings.Any(e => e.Id == id);
        }

        // Booking request for a calendar slot
        public class BookingRequest
        {
            public int TeacherId { get; set; } // Foreign key linking to Teacher
            public int StudentId { get; set; } // Foreign key linking to Student
            public DateTime StartTime { get; set; } // Booking start time
            public int Duration { get; set; } // Duration in minutes
        }

        public class BookingResponseDto
        {
            public int Id { get; set; }
            public string TeacherName { get; set; }
            public string StudentName { get; set; }
            public DateTime StartTime { get; set; }
            public DateTime EndTime { get; set; }
            public string Status { get; set; }
        }
    }
}
