using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WatchSync.Api.Data;
using WatchSync.Api.DTOs;
using WatchSync.Api.Models;
using WatchSync.Api.Services;

namespace WatchSync.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ShowsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ShowsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var shows = _context.Shows
                .Where(s => s.WatchParty.WatchPartyMembers.Any(m => m.UserId == userId))
                .Select(s => new
                {
                    s.ShowId,
                    s.WatchPartyId,
                    s.AddedByUserId,
                    AddedByUserName = s.AddedByUser.DisplayName,
                    s.Title,
                    s.TotalEpisodes,
                    s.CurrentEpisode,
                    s.CoverUrl,
                    s.CreatedAt
                })
                .ToList();
            return Ok(shows);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var show = _context.Shows
                .FirstOrDefault(s => s.ShowId == id
                    && s.WatchParty.WatchPartyMembers.Any(m => m.UserId == userId));
            if (show == null) return NotFound();
            return Ok(show);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateShowDto showDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            // Prüfen ob User Mitglied der WatchParty ist
            var isMember = _context.WatchPartyMembers
                .Any(m => m.WatchPartyId == showDto.WatchPartyId && m.UserId == userId);
            if (!isMember) return Forbid();

            var show = new Show
            {
                WatchPartyId = showDto.WatchPartyId,
                AddedByUserId = userId,
                Title = showDto.Title,
                TotalEpisodes = showDto.TotalEpisodes,
                CurrentEpisode = showDto.CurrentEpisode,
                CoverUrl = showDto.CoverUrl,
                CreatedAt = DateTime.UtcNow
            };

            _context.Shows.Add(show);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = show.ShowId }, show);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UpdateShowDto updated)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var show = _context.Shows
                .FirstOrDefault(s => s.ShowId == id
                    && s.WatchParty.WatchPartyMembers.Any(m => m.UserId == userId));
            if (show == null) return NotFound();
            show.Title = updated.Title;
            show.TotalEpisodes = updated.TotalEpisodes;
            show.CurrentEpisode = updated.CurrentEpisode;
            if (updated.CoverUrl != null) show.CoverUrl = updated.CoverUrl;
            _context.SaveChanges();
            return Ok(show);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var show = _context.Shows
                .FirstOrDefault(s => s.ShowId == id
                    && s.WatchParty.WatchPartyMembers.Any(m => m.UserId == userId));
            if (show == null) return NotFound();
            _context.Shows.Remove(show);
            _context.SaveChanges();
            return NoContent();
        }


        [HttpGet("search")]
        public async Task<IActionResult> Search( string query,[FromServices] TvMazeService service)
        {
            if (string.IsNullOrWhiteSpace(query) || query.Length < 3)
            {
                return BadRequest("Search query must contain at least 3 characters.");
            }

            var result = await service.Search(query);

            return Ok(result);
        }


        [HttpGet("details/{externalId}")]
        public async Task<IActionResult> Details(int externalId, [FromServices] TvMazeService service)
        {
            var result = await service.GetDetails(externalId);

            if (result == null)
                return NotFound();

            return Ok(result);
        }
    }
}