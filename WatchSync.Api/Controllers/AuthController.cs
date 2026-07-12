using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WatchSync.Api.Data;
using WatchSync.Api.DTOs;
using WatchSync.Api.Models;
using WatchSync.Api.Utils;


namespace WatchSync.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public AuthController(UserManager<ApplicationUser> userManager, IConfiguration configuration, AppDbContext context)
        {
            _userManager = userManager;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var user = new ApplicationUser
            {
                UserName = dto.DisplayName,
                Email = dto.Email,
                DisplayName = dto.DisplayName,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                if (result.Errors.Any(e => e.Code == "DuplicateUserName"))
                    return BadRequest(new { message = "Dieser Name ist bereits vergeben." });
                if (result.Errors.Any(e => e.Code == "DuplicateEmail"))
                    return BadRequest(new { message = "Diese E-Mail wird bereits verwendet." });
                return BadRequest(new { message = result.Errors.First().Description });
            }

            var personalWp = new WatchParty
            {
                Name = "Personal",
                InviteCode = CodeGenerator.GenerateInviteCode(),
                IsPersonal = true,
                TurnLimit = 0,
                CurrentTurnOrder = 1,
                CurrentTurnCount = 0,
                CreatedAt = DateTime.UtcNow,
                OwnerId = user.Id
            };
            _context.WatchParties.Add(personalWp);
            _context.SaveChanges();

            var member = new WatchPartyMember
            {
                WatchPartyId = personalWp.WatchPartyId,
                UserId = user.Id,
                TurnOrder = 1,
                JoinedAt = DateTime.UtcNow
            };
            _context.WatchPartyMembers.Add(member);
            _context.SaveChanges();

            return Ok(new { message = "User registered successfully" });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByNameAsync(dto.Username);
            if (user == null)
                return Unauthorized(new { message = "Invalid username or password" });

            var validPassword = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!validPassword)
                return Unauthorized(new { message = "Invalid username or password" });

            var token = GenerateJwtToken(user);
            return Ok(new { token, user = new { id = user.Id, email = user.Email, displayName = user.DisplayName, avatarUrl = user.AvatarUrl } });
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound();

            user.DisplayName = dto.DisplayName;
            user.Email = dto.Email;
            user.AvatarUrl = dto.AvatarUrl;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                displayName = user.DisplayName,
                avatarUrl = user.AvatarUrl
            });
        }

        [Authorize]
        [HttpPost("avatar")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file uploaded" });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound();

            var allowedExtensions = new[]{ ".png",".jpg",".jpeg",".webp"};

            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
                return BadRequest(new { message = "Invalid file type" });

            if (file.Length > 5 * 1024 * 1024)
                return BadRequest(new { message = "File too large" });

            var fileName = $"{Guid.NewGuid()}{extension}";

            var uploadPath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "uploads",
                "avatars"
            );

            Directory.CreateDirectory(uploadPath);

            var filePath = Path.Combine(
                uploadPath,
                fileName
            );

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            user.AvatarUrl = $"/uploads/avatars/{fileName}";

            await _userManager.UpdateAsync(user);

            return Ok(new
            {
                avatarUrl = user.AvatarUrl
            });
        }

        private object GenerateJwtToken(ApplicationUser user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!));

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id),
                new(ClaimTypes.Email, user.Email!),
                new("displayName",  user.DisplayName)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
