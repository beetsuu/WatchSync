using Microsoft.AspNetCore.Mvc;
using WatchSync.Api.Data;
using WatchSync.Api.DTOs;
using WatchSync.Api.Models;

namespace WatchSync.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
            var watchParties = _context.WatchParties.ToList();
            return Ok(watchParties);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id) 
        {
            var watchParty = _context.WatchParties.FirstOrDefault(wp => wp.WatchPartyId == id);
            if (watchParty == null) return NotFound();
            return Ok(watchParty);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateWatchPartyDto dto)
        {
            var wp = new WatchParty
            {
                Name = dto.Name,
                TurnLimit = dto.TurnLimit,
                CurrentTurnOrder = 1,
                CurrentTurnCount = 0,
                CreatedAt = DateTime.UtcNow
            };
            wp.CreatedAt = DateTime.UtcNow;
            _context.WatchParties.Add(wp);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = wp.WatchPartyId }, wp);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] WatchParty updated) 
        {
            var watchParty = _context.WatchParties.FirstOrDefault(wp => wp.WatchPartyId == id);
            if (watchParty == null) return NotFound();
            watchParty.Name = updated.Name;
            watchParty.TurnLimit = updated.TurnLimit;
            watchParty.CurrentTurnOrder = updated.CurrentTurnOrder;
            watchParty.CurrentTurnCount = updated.CurrentTurnCount;
            _context.SaveChanges();
            return Ok(watchParty);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var watchParty = _context.WatchParties.FirstOrDefault(wp => wp.WatchPartyId == id);
            if (watchParty == null) return NotFound();

            _context.WatchParties.Remove(watchParty);
            _context.SaveChanges();
            return NoContent();
        }


    }
}
