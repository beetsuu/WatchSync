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
    public class WatchPartyMembersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WatchPartyMembersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var members = _context.WatchPartyMembers
                .Where(m => m.WatchParty.WatchPartyMembers.Any(wpm => wpm.UserId == userId))
                .ToList();
            return Ok(members);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var member = _context.WatchPartyMembers
                .FirstOrDefault(m => m.WatchPartyMemberId == id
                    && m.WatchParty.WatchPartyMembers.Any(wpm => wpm.UserId == userId));
            if (member == null) return NotFound();
            return Ok(member);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateWatchPartyMemberDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var isMember = _context.WatchPartyMembers.Any(m => m.WatchPartyId == dto.WatchPartyId && m.UserId == userId);
            if (!isMember) return Forbid();

                var member = new WatchPartyMember
            {
                WatchPartyId = dto.WatchPartyId,
                UserId = dto.UserId,
                TurnOrder = dto.TurnOrder,
                JoinedAt = DateTime.UtcNow
            };

            _context.WatchPartyMembers.Add(member);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = member.WatchPartyMemberId }, member);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] CreateWatchPartyMemberDto updated)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var member = _context.WatchPartyMembers
                .FirstOrDefault(m => m.WatchPartyMemberId == id
                    && m.WatchParty.WatchPartyMembers.Any(wpm => wpm.UserId == userId));
            if (member == null) return NotFound();
            member.TurnOrder = updated.TurnOrder;

            _context.SaveChanges();
            return Ok(member);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var member = _context.WatchPartyMembers
                .FirstOrDefault(m => m.WatchPartyMemberId == id
                    && m.WatchParty.WatchPartyMembers.Any(wpm => wpm.UserId == userId));
            if (member == null) return NotFound();

            _context.WatchPartyMembers.Remove(member);
            _context.SaveChanges();
            return NoContent();
        }
    }
}