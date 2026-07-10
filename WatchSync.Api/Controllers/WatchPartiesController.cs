using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchSync.Api.Data;
using WatchSync.Api.DTOs;
using WatchSync.Api.Models;
using WatchSync.Api.Utils;

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
                InviteCode = CodeGenerator.GenerateInviteCode(),
                TurnLimit = dto.TurnLimit,
                CurrentTurnOrder = 1,
                CurrentTurnCount = 0,
                CreatedAt = DateTime.UtcNow,
                OwnerId = userId
            };
            _context.WatchParties.Add(wp);
            _context.SaveChanges();

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

        [HttpPost("join")]
        public IActionResult Join([FromBody] JoinWatchPartyDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var wp = _context.WatchParties
                .FirstOrDefault(w => w.InviteCode == dto.InviteCode);

            if (wp == null)
                return NotFound(new { message = "Invalid invite code" });

            // Prüfen ob User schon Mitglied ist
            var alreadyMember = _context.WatchPartyMembers
                .Any(m => m.WatchPartyId == wp.WatchPartyId && m.UserId == userId);

            if (alreadyMember)
                return BadRequest(new { message = "You are already a member of this watch party" });

            // Nächste TurnOrder berechnen
            var maxTurnOrder = _context.WatchPartyMembers
                .Where(m => m.WatchPartyId == wp.WatchPartyId)
                .Max(m => (int?)m.TurnOrder) ?? 0;

            var member = new WatchPartyMember
            {
                WatchPartyId = wp.WatchPartyId,
                UserId = userId,
                TurnOrder = maxTurnOrder + 1,
                JoinedAt = DateTime.UtcNow
            };

            _context.WatchPartyMembers.Add(member);
            _context.SaveChanges();

            return Ok(wp);
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

            watchParty.CurrentTurnCount = updated.CurrentTurnCount;
            watchParty.CurrentTurnOrder = updated.CurrentTurnOrder;

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

            if (watchParty.IsPersonal)
                return BadRequest(new { message = "This WatchParty can't be deleted." });

            _context.WatchParties.Remove(watchParty);
            _context.SaveChanges();
            return NoContent();
        }


    }
}