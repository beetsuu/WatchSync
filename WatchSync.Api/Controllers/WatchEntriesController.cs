using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WatchSync.Api.Data;
using WatchSync.Api.DTOs;
using WatchSync.Api.Models;

namespace WatchSync.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
            var watchEntries = _context.WatchEntries.ToList();
            return Ok(watchEntries);
        }

        // GET api/watchEntries/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var watchEntry = _context.WatchEntries.FirstOrDefault(we => we.WatchEntryId == id);
            if (watchEntry == null) return NotFound();
            return Ok(watchEntry);
        }

        // POST api/watchEntries
        [HttpPost]
        public IActionResult Create([FromBody] CreateWatchEntryDto watchEntryDto)
        {
            var watchEntry = new WatchEntry
            {
                WatchPartyId = watchEntryDto.WatchPartyId,
                UserId = watchEntryDto.UserId,
                ShowId = watchEntryDto.ShowId,
                PartyTurnCountAfter = watchEntryDto.PartyTurnCountAfter,
            };

            watchEntry.WatchedAt = DateTime.UtcNow;
            _context.WatchEntries.Add(watchEntry);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = watchEntry.WatchEntryId }, watchEntry);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] WatchEntry updated)
        {
            var watchEntry = _context.WatchEntries.FirstOrDefault(we => we.WatchEntryId == id);
            if (watchEntry == null) return NotFound();
            watchEntry.PartyTurnCountAfter = updated.PartyTurnCountAfter;

            _context.SaveChanges();
            return Ok(watchEntry);
        }


        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var watchEntries = _context.WatchEntries.FirstOrDefault(we => we.WatchEntryId == id);
            if (watchEntries == null) return NotFound();

            _context.WatchEntries.Remove(watchEntries);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
