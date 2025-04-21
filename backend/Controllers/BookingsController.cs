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
            if (bookingRequest.Duration != 60)
            {
                return BadRequest(new { message = "Booking duration must be 60 minutes." });
            }

            var teacher = await _context.Teachers.FindAsync(bookingRequest.TeacherId);
            if (teacher == null)
            {
                return NotFound(new { message = "Teacher not found." });
            }

            var bookingEndTime = bookingRequest.StartTime.AddMinutes(bookingRequest.Duration);
            var calendar = await _context.Calendars
                .Where(c => c.TeacherId == bookingRequest.TeacherId && c.StartTime <= bookingRequest.StartTime && c.EndTime >= bookingEndTime)
                .FirstOrDefaultAsync();

            if (calendar == null)
            {
                return BadRequest(new { message = "Teacher is not available for the requested time." });
            }

            var duplicateBooking = await _context.Bookings
                .Where(b => b.StudentId == bookingRequest.StudentId
                    && b.CalendarId == calendar.Id
                    && b.StartTime == bookingRequest.StartTime
                    && b.EndTime == bookingEndTime)
                .FirstOrDefaultAsync();

            if (duplicateBooking != null)
            {
                return BadRequest(new { message = "You have already requested a booking for this time slot." });
            }

            var existingBooking = await _context.Bookings
                .Where(b => b.CalendarId == calendar.Id
                    && b.Status == "Accepted"
                    && b.StartTime < bookingEndTime
                    && bookingRequest.StartTime < b.EndTime)
                .FirstOrDefaultAsync();

            if (existingBooking != null)
            {
                return BadRequest(new { message = "Booking overlaps with an existing booking." });
            }

            var booking = new Booking
            {
                CalendarId = calendar.Id,
                StudentId = bookingRequest.StudentId,
                StartTime = bookingRequest.StartTime,
                EndTime = bookingEndTime,
                Status = "Pending"
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, new
            {
                Id = booking.Id,
                StartTime = booking.StartTime,
                EndTime = booking.EndTime,
                Status = booking.Status
            });
        }

        // GET: /api/bookings/me
        [Authorize(Roles = "Teacher, Student")]
        [HttpGet("me")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetMyUpcomingBookings()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            var now = DateTime.UtcNow;

            // Base query
            IQueryable<Booking> query = _context.Bookings
                .Include(b => b.Student)
                    .ThenInclude(s => s.User)
                .Include(b => b.Calendar)
                    .ThenInclude(c => c.Teacher)
                        .ThenInclude(t => t.User)
                .Where(b =>
                    b.Status != "Cancelled" &&
                    b.EndTime >= now
                );

            if (User.IsInRole("Student"))
            {
                var student = await _context.Students
                    .FirstOrDefaultAsync(s => s.UserId.ToString() == userId);

                if (student == null) return NotFound("Student profile not found.");

                query = query.Where(b => b.StudentId == student.Id);
            }
            else if (User.IsInRole("Teacher"))
            {
                var teacher = await _context.Teachers
                    .FirstOrDefaultAsync(t => t.UserId.ToString() == userId);

                if (teacher == null) return NotFound("Teacher profile not found.");

                query = query.Where(b => b.Calendar.TeacherId == teacher.Id);
            }

            var bookings = await query
                .OrderBy(b => b.StartTime)
                .ToListAsync();

            return Ok(bookings.Select(b => new BookingResponseDto
            {
                Id = b.Id,
                TeacherName = $"{b.Calendar.Teacher.User.FirstName} {b.Calendar.Teacher.User.LastName}",
                StudentName = $"{b.Student.User.FirstName} {b.Student.User.LastName}",
                StartTime = b.StartTime,
                EndTime = b.EndTime,
                Status = b.Status
            }));
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
                return Unauthorized(new { message = "You are not authorized to view this booking status." });
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
            try
            {
                if (statusUpdateRequest == null || string.IsNullOrEmpty(statusUpdateRequest.Status))
                {
                    return BadRequest(new { message = "Invalid status update request." });
                }

                // Include related entities
                var booking = await _context.Bookings
                    .Include(b => b.Calendar)
                        .ThenInclude(c => c.Teacher) // Include Teacher to access UserId
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (booking == null)
                {
                    return NotFound(new { message = "Booking not found." });
                }

                // Check if the booking is already accepted or rejected
                if (booking.Status == "Accepted" || booking.Status == "Rejected")
                {
                    return BadRequest(new { message = "Booking status has already been updated." });
                }

                // Check if the user is authorized to update the booking status
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId) || 
                    (User.IsInRole("Teacher") && (booking.Calendar == null || booking.Calendar.Teacher.UserId.ToString() != userId)))
                {
                    return Unauthorized(new { message = "You are not authorized to update this booking status." });
                }

                // Update the booking status
                booking.Status = statusUpdateRequest.Status;
                _context.Entry(booking).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Id = booking.Id,
                    Status = booking.Status
                });
            }
            catch (Exception ex)
            {
                // Log the exception (you can replace this with your logging mechanism)
                Console.WriteLine($"Error in UpdateBookingStatus: {ex.Message}");

                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        public class StatusUpdateRequest
        {
            public string Status { get; set; }
        }

        // DELETE: api/Bookings/5
        [Authorize(Roles = "Admin, Teacher, Student")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.Calendar)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null)
            {
                return NotFound();
            }

            // Check if booking is in the past
            if (booking.EndTime <= DateTime.UtcNow)
            {
                return BadRequest("Cannot cancel a booking that has already ended.");
            }

            // Check if booking is less than 2 hours away
            if (booking.StartTime <= DateTime.UtcNow.AddHours(2))
            {
                return BadRequest("You cannot cancel a class less than 2 hours before it starts.");
            }

            // Check if booking is already cancelled
            if (booking.Status == "Cancelled")
            {
                return BadRequest("Booking is already cancelled.");
            }

            // Check if booking is Pending
            if (booking.Status == "Pending")
            {
                return BadRequest("Booking is still pending and cannot be cancelled.");
            }

            // Check if booking is Rejected
            if (booking.Status == "Rejected")
            {
                return BadRequest("Booking is already rejected and cannot be cancelled.");
            }

            // Check if the user is authorized to delete the booking
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (User.IsInRole("Student") && booking.StudentId.ToString() != userId)
            {
                return Unauthorized(new { message = "Students can only cancel their own bookings." });
            }

            if (User.IsInRole("Teacher") && booking.Calendar.TeacherId.ToString() != userId)
            {
                return Unauthorized(new { message = "Teachers can only cancel their own calendar bookings." });
            }


            booking.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: /api/bookings/history
        [Authorize(Roles = "Teacher, Student")]
        [HttpGet("history")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingHistory()
        {
            try {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var now = DateTime.UtcNow;

                IQueryable<Booking> query;

                if (User.IsInRole("Student"))
                {
                    var student = await _context.Students
                        .FirstOrDefaultAsync(s => s.UserId.ToString() == userId);

                    if (student == null)
                        return NotFound("Student profile not found.");

                    Console.WriteLine("User is a Student with ID: " + student.Id + " and UserId: " + userId);
                    query = _context.Bookings
                        .Where(b => b.StudentId == student.Id &&
                                    (b.Status == "Completed" || b.Status == "Cancelled") &&
                                    b.EndTime <= now);
                }
                else if (User.IsInRole("Teacher"))
                {
                    var teacher = await _context.Teachers
                        .FirstOrDefaultAsync(t => t.UserId.ToString() == userId);

                    if (teacher == null)
                        return NotFound("Teacher profile not found.");

                    query = _context.Bookings
                        .Where(b => b.Calendar.TeacherId == teacher.Id &&
                                    (b.Status == "Completed" || b.Status == "Cancelled") &&
                                    b.EndTime <= now);
                }
                else
                {
                    return Forbid();
                }

                var bookings = await query
                    .Include(b => b.Student)
                        .ThenInclude(s => s.User)
                    .Include(b => b.Calendar)
                        .ThenInclude(c => c.Teacher)
                            .ThenInclude(t => t.User)
                    .ToListAsync();

                // Format the bookings to include student and teacher names
                var bookingHistory = bookings.Select(b => new BookingResponseDto
                {
                    Id = b.Id,
                    TeacherName = $"{b.Calendar.Teacher.User.FirstName} {b.Calendar.Teacher.User.LastName}",
                    StudentName = $"{b.Student.User.FirstName} {b.Student.User.LastName}",
                    StartTime = b.StartTime,
                    EndTime = b.EndTime,
                    Status = b.Status
                }).ToList();
                return Ok(bookingHistory);
            } catch (Exception ex) {                
                return StatusCode(500, "An error occurred while processing your request.");
            }
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
