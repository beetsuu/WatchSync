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
                .Select(m => new
                {
                    m.WatchPartyMemberId,
                    m.WatchPartyId,
                    m.UserId,
                    DisplayName = m.User.DisplayName,
                    m.TurnOrder,
                    m.JoinedAt,
                    IsOwner = m.WatchParty.OwnerId == m.UserId
                })
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

        [HttpGet("party/{watchPartyId}")]
        public IActionResult GetPartyMembers(int watchPartyId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var isMember = _context.WatchPartyMembers
                .Any(m => m.WatchPartyId == watchPartyId && m.UserId == userId);

            if (!isMember)
                return Forbid();

            var ownerId = _context.WatchParties
                .Where(w => w.WatchPartyId == watchPartyId)
                .Select(w => w.OwnerId)
                .First();

            var members = _context.WatchPartyMembers
                .Where(m => m.WatchPartyId == watchPartyId)
                .Select(m => new WatchPartyMemberDto
                {
                    WatchPartyMemberId = m.WatchPartyMemberId,
                    UserId = m.UserId,
                    DisplayName = m.User.DisplayName,
                    AvatarUrl = m.User.AvatarUrl,
                    TurnOrder = m.TurnOrder,
                    IsOwner = m.UserId == ownerId
                })
                .ToList();

            return Ok(members);
        }

        [HttpPut("party/{watchPartyId}")]
        public IActionResult UpdatePartyMembers(int watchPartyId, [FromBody] List<string> userIds)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var watchParty = _context.WatchParties
                .FirstOrDefault(w => w.WatchPartyId == watchPartyId);

            if (watchParty == null)
                return NotFound();

            if (watchParty.OwnerId != currentUserId)
                return Forbid();

            var currentMembers = _context.WatchPartyMembers
                .Where(m => m.WatchPartyId == watchPartyId)
                .ToList();
            
            if (!userIds.Contains(watchParty.OwnerId))
            {
                userIds.Add(watchParty.OwnerId);
            }

            var removeMembers = currentMembers
                .Where(m =>
                    m.UserId != watchParty.OwnerId &&
                    !userIds.Contains(m.UserId)
                )
                .ToList();

            _context.WatchPartyMembers.RemoveRange(removeMembers);

            foreach (var id in userIds)
            {
                if (!currentMembers.Any(m => m.UserId == id))
                {
                    var maxTurn = currentMembers
                        .Select(m => m.TurnOrder)
                        .DefaultIfEmpty(0)
                        .Max();

                    _context.WatchPartyMembers.Add(new WatchPartyMember
                    {
                        WatchPartyId = watchPartyId,
                        UserId = id,
                        TurnOrder = maxTurn + 1,
                        JoinedAt = DateTime.UtcNow
                    });
                }
            }


            _context.SaveChanges();

            return Ok();
        }

        [HttpDelete("party/{watchPartyId}/leave")]
        public IActionResult Leave(int watchPartyId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var watchParty = _context.WatchParties
                .FirstOrDefault(wp => wp.WatchPartyId == watchPartyId);

            if (watchParty == null)
                return NotFound();


            if (watchParty.OwnerId == userId)
                return BadRequest(new { message = "Owner can't leave the watch party." });


            var member = _context.WatchPartyMembers
                .FirstOrDefault(m =>
                    m.WatchPartyId == watchPartyId &&
                    m.UserId == userId
                );


            if (member == null)
                return NotFound();


            _context.WatchPartyMembers.Remove(member);
            _context.SaveChanges();


            return NoContent();
        }
    }
}