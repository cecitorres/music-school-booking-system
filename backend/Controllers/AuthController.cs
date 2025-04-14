using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MusicSchoolBookingSystem.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;


namespace MusicSchoolBookingSystem.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JwtService _jwtService;

        private readonly ApplicationDbContext _context;

        public AuthController(JwtService jwtService , ApplicationDbContext context)
        {
            _jwtService = jwtService;
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Validate the user input
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Email and password are required.");
            }
            // Check if the user exists
            var user = _context.Users.SingleOrDefault(u => u.Email == request.Email);
            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }
            // Check if the password is correct
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized("Invalid email or password.");
            }
            // Generate JWT token
            var token = _jwtService.GenerateToken(user.Email, user.Role);

                // return Ok(new { Token = token });
            // Return the token and user information
            return Ok(new
            {
                Token = token,
                User = new
                {
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    user.Email,
                    user.PhoneNumber,
                    user.Role,
                    user.CreatedAt
                }
            });
        }

        // Register endpoint
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
        {
            // Validate the user input
            if (string.IsNullOrEmpty(registerRequest.Email) || string.IsNullOrEmpty(registerRequest.Password))
            {
                return BadRequest("Email and password are required.");
            }
            if (await _context.Users.AnyAsync(u => u.Email == registerRequest.Email))
            {
                return Conflict("Email already exists.");
            }
            if (string.IsNullOrEmpty(registerRequest.Role))
            {
                return BadRequest("Role is required.");
            }
            if (string.IsNullOrEmpty(registerRequest.PhoneNumber))
            {
                return BadRequest("Phone number is required.");
            }
            if (string.IsNullOrEmpty(registerRequest.FirstName))
            {
                return BadRequest("First name is required.");
            }
            if (string.IsNullOrEmpty(registerRequest.LastName))
            {
                return BadRequest("Last name is required.");
            }

            // Hash the password (you should use a proper hashing algorithm)
            var user = new User
            {
                Email = registerRequest.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(registerRequest.Password),
                Role = registerRequest.Role,
                PhoneNumber = registerRequest.PhoneNumber,
                FirstName = registerRequest.FirstName,
                LastName = registerRequest.LastName,
                CreatedAt = DateTime.UtcNow
            };

            // Save the user to the database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Login), new { email = user.Email }, user);
        }

        // Edit user endpoint
        [HttpPut("edit")]
        [Authorize (Roles = "Admin, Teacher, Student")]
        public async Task<IActionResult> EditUser([FromBody] User user)
        {
            // Validate the user input
            if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("Email and password are required.");
            }
            if (await _context.Users.AnyAsync(u => u.Email == user.Email && u.Id != user.Id))
            {
                return Conflict("Email already exists.");
            }

            // Update the user in the database
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        // User endpoint
        [HttpGet("user/{id}")]
        [Authorize (Roles = "Admin, Teacher, Student")]
        public async Task<IActionResult> GetUser(int id)
        {
            // Get the user from the database
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Return the user information
            return Ok(new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.PhoneNumber,
                user.Role,
                user.CreatedAt
            });
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } // e.g., "Teacher", "Student"
        public string PhoneNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
