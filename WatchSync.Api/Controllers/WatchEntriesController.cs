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
    public class WatchEntriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WatchEntriesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var entries = _context.WatchEntries
                .Where(e => e.WatchParty.WatchPartyMembers.Any(m => m.UserId == userId))
                .ToList();
            return Ok(entries);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var entry = _context.WatchEntries
                .FirstOrDefault(e => e.WatchEntryId == id
                    && e.WatchParty.WatchPartyMembers.Any(m => m.UserId == userId));
            if (entry == null) return NotFound();
            return Ok(entry);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateWatchEntryDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            // Prüfen ob User Mitglied der WatchParty ist
            var isMember = _context.WatchPartyMembers
                .Any(m => m.WatchPartyId == dto.WatchPartyId && m.UserId == userId);
            if (!isMember) return Forbid();

            var entry = new WatchEntry
            {
                WatchPartyId = dto.WatchPartyId,
                UserId = userId,
                ShowId = dto.ShowId,
                PartyTurnCountAfter = dto.PartyTurnCountAfter,
                WatchedAt = DateTime.UtcNow
            };

            _context.WatchEntries.Add(entry);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = entry.WatchEntryId }, entry);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] CreateWatchEntryDto updated)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var entry = _context.WatchEntries
                .FirstOrDefault(e => e.WatchEntryId == id
                    && e.WatchParty.WatchPartyMembers.Any(m => m.UserId == userId));
            if (entry == null) return NotFound();

            entry.PartyTurnCountAfter = updated.PartyTurnCountAfter;
            _context.SaveChanges();
            return Ok(entry);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var entry = _context.WatchEntries
                .FirstOrDefault(e => e.WatchEntryId == id
                    && e.WatchParty.WatchPartyMembers.Any(m => m.UserId == userId));
            if (entry == null) return NotFound();

            _context.WatchEntries.Remove(entry);
            _context.SaveChanges();
            return NoContent();
        }
    }
}