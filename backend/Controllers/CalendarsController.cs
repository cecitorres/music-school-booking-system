using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicSchoolBookingSystem.Models;

namespace MusicSchoolBookingSystem.Controllers
{
    [Route("api/calendars")]
    [ApiController]
    public class CalendarsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CalendarsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/calendars
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Calendar>>> GetCalendars()
        {
            return await _context.Calendars.ToListAsync();
        }

        // GET: api/calendars/5
        [HttpGet("{teacherId}")]
        public async Task<ActionResult<IEnumerable<Calendar>>> GetCalendar(int teacherId)
        {
            try
            {
                // Check if teacher exists
                var teacher = await _context.Teachers.FindAsync(teacherId);

                if (teacher == null)
                {
                    return NotFound($"Teacher with ID {teacherId} not found.");
                }

                // Get the teacher's calendar slots
                var calendarSlots = await _context.Calendars
                    .Where(c => c.TeacherId == teacherId)
                    .ToListAsync();

                // Return the list of calendar slots (even if it's empty)
                return Ok(calendarSlots);
            }
            catch (Exception ex)
            {
                // Log the exception (you can use a logging framework like Serilog or NLog)
                // Example: _logger.LogError(ex, "An error occurred while fetching calendar slots.");

                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        // PUT: api/calendars/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCalendar(int id, Calendar calendar)
        {
            if (id != calendar.Id)
            {
                return BadRequest();
            }

            _context.Entry(calendar).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CalendarExists(id))
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

        // POST: api/calendars
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Calendar>> PostCalendar(Calendar calendar)
        {
            _context.Calendars.Add(calendar);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCalendar", new { id = calendar.Id }, calendar);
        }

        // DELETE: api/calendars/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCalendar(int id)
        {
            var calendar = await _context.Calendars.FindAsync(id);
            if (calendar == null)
            {
                return NotFound();
            }

            _context.Calendars.Remove(calendar);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        

        private bool CalendarExists(int id)
        {
            return _context.Calendars.Any(e => e.Id == id);
        }
    }
}
