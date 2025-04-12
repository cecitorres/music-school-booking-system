using Microsoft.AspNetCore.Mvc;


namespace MusicSchoolBookingSystem.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JwtService _jwtService;

        public AuthController(JwtService jwtService)
        {
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Replace this with your actual user validation logic
            if (request.Username == "teacher" && request.Password == "password123")
            {
                var token = _jwtService.GenerateToken(
                    request.Username,
                    "Teacher");

                return Ok(new { Token = token });
            }

            return Unauthorized("Invalid username or password");
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
