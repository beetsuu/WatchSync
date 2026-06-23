using Microsoft.AspNetCore.Mvc;
using WatchSync.Api.Data;
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
        public IActionResult Create([FromBody] WatchParty watchParty)
        {
            watchParty.CreatedAt = DateTime.UtcNow;
            _context.WatchParties.Add(watchParty);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = watchParty.WatchPartyId }, watchParty);
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
