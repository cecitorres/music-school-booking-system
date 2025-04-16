using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MusicSchoolBookingSystem.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.Security.Claims;

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
            var token = _jwtService.GenerateToken(user);

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
        [Authorize(Roles = "Admin, Teacher")]
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
            if (string.IsNullOrEmpty(registerRequest.Role))
            {
                return BadRequest("Role is required.");
            }
            if (registerRequest.Role != "Admin" && registerRequest.Role != "Teacher" && registerRequest.Role != "Student")
            {
                return BadRequest("Invalid role.");
            }

            // Admins can register other Admins, Teachers, and Students
            // Teachers can register only Students
            var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
            
            if (currentUserRole == "Teacher" && registerRequest.Role != "Student")
            {
                return Forbid("You are not authorized to register this role.");
            }

            // Hash the password
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
            
            // We need to create a new Teacher or Student entity based on the role
            // And use the user ID to link them
            if (registerRequest.Role == "Teacher")
            {
                var teacher = new Teacher
                {
                    UserId = user.Id,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Teachers.Add(teacher);
            }
            else if (registerRequest.Role == "Student")
            {
                var student = new Student
                {
                    UserId = user.Id,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Students.Add(student);
            }
            await _context.SaveChangesAsync();

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

        // Edit user endpoint
        [HttpPut("edit")]
        [Authorize(Roles = "Admin, Teacher, Student")]
        public async Task<IActionResult> EditUser([FromBody] EditUserRequest editUserRequest)
        {
            // Validate the user input
            if (string.IsNullOrEmpty(editUserRequest.Email) || string.IsNullOrEmpty(editUserRequest.Password))
            {
                return BadRequest("Email and password are required.");
            }
            if (await _context.Users.AnyAsync(u => u.Email == editUserRequest.Email && u.Id != editUserRequest.Id))
            {
                return Conflict("Email already exists.");
            }

            // Find the user in the database
            var user = await _context.Users.FindAsync(editUserRequest.Id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Update only the fields that are allowed to be edited
            user.FirstName = editUserRequest.FirstName;
            user.LastName = editUserRequest.LastName;
            user.Email = editUserRequest.Email;
            user.Password = BCrypt.Net.BCrypt.HashPassword(editUserRequest.Password); // Hash the password
            user.PhoneNumber = editUserRequest.PhoneNumber;
            user.Role = editUserRequest.Role;

            // Save changes to the database
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

    public class EditUserRequest
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string PhoneNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
