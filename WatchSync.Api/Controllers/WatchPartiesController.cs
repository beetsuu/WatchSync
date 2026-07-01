using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchSync.Api.Data;
using WatchSync.Api.DTOs;
using WatchSync.Api.Models;

namespace WatchSync.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WatchPartiesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WatchPartiesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var watchParties = _context.WatchParties
                .Where(wp => wp.WatchPartyMembers.Any(m => m.UserId == userId))
                .ToList();
            return Ok(watchParties);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var watchParty = _context.WatchParties
                .FirstOrDefault(wp => wp.WatchPartyId == id
                    && wp.WatchPartyMembers.Any(m => m.UserId == userId));
            if (watchParty == null) return NotFound();
            return Ok(watchParty);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateWatchPartyDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var wp = new WatchParty
            {
                Name = dto.Name,
                TurnLimit = dto.TurnLimit,
                CurrentTurnOrder = 1,
                CurrentTurnCount = 0,
                CreatedAt = DateTime.UtcNow
            };

            _context.WatchParties.Add(wp);
            _context.SaveChanges();

            // Creator automatisch als erstes Mitglied hinzufügen
            var member = new WatchPartyMember
            {
                WatchPartyId = wp.WatchPartyId,
                UserId = userId,
                TurnOrder = 1,
                JoinedAt = DateTime.UtcNow
            };
            _context.WatchPartyMembers.Add(member);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = wp.WatchPartyId }, wp);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] CreateWatchPartyDto updated)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var watchParty = _context.WatchParties
                .FirstOrDefault(wp => wp.WatchPartyId == id
                    && wp.WatchPartyMembers.Any(m => m.UserId == userId));
            if (watchParty == null) return NotFound();

            watchParty.Name = updated.Name;
            watchParty.TurnLimit = updated.TurnLimit;
            _context.SaveChanges();
            return Ok(watchParty);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var watchParty = _context.WatchParties
                .FirstOrDefault(wp => wp.WatchPartyId == id
                    && wp.WatchPartyMembers.Any(m => m.UserId == userId));
            if (watchParty == null) return NotFound();

            _context.WatchParties.Remove(watchParty);
            _context.SaveChanges();
            return NoContent();
        }
    }
}