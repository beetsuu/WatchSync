using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WatchSync.Api.Data;
using WatchSync.Api.Models;
using WatchSync.Api.DTOs;
using Microsoft.OpenApi.Validations;

namespace WatchSync.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
            var watchPartyMembers = _context.WatchPartyMembers.ToList();
            return Ok(watchPartyMembers);
        }

        // GET api/watchPartyMembers/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var watchPartyMember = _context.WatchPartyMembers.FirstOrDefault(wpm => wpm.WatchPartyMemberId == id);
            if (watchPartyMember == null) return NotFound();
            return Ok(watchPartyMember);
        }

        // POST api/watchPartyMembers
        [HttpPost]
        public IActionResult Create([FromBody] CreateWatchPartyMemberDto watchPartyMemberDto)
        {
            var watchPartyMember = new WatchPartyMember
            {
                WatchPartyId = watchPartyMemberDto.WatchPartyId,
                UserId = watchPartyMemberDto.UserId,
                TurnOrder = watchPartyMemberDto.TurnOrder,
            };

            watchPartyMember.JoinedAt = DateTime.UtcNow;
            _context.WatchPartyMembers.Add(watchPartyMember);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = watchPartyMember.WatchPartyMemberId }, watchPartyMember);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] WatchPartyMember updated)
        {
            var watchPartyMember = _context.WatchPartyMembers.FirstOrDefault(wpm => wpm.WatchPartyMemberId == id);
            if (watchPartyMember == null) return NotFound();
            watchPartyMember.TurnOrder = updated.TurnOrder;

            _context.SaveChanges();
            return Ok(watchPartyMember);
        }


        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var watchPartyMembers = _context.WatchPartyMembers.FirstOrDefault(wpm => wpm.WatchPartyMemberId == id);
            if (watchPartyMembers == null) return NotFound();

            _context.WatchPartyMembers.Remove(watchPartyMembers);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
