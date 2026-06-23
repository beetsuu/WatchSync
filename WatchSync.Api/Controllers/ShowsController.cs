using Microsoft.AspNetCore.Mvc;
using WatchSync.Api.Data;
using WatchSync.Api.DTOs;
using WatchSync.Api.Models;

namespace WatchSync.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
            var shows = _context.Shows.ToList();
            return Ok(shows);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var show = _context.Shows.FirstOrDefault(s => s.ShowId == id);
            if (show == null) return NotFound();
            return Ok(show);
        }

        // POST api/shows
        [HttpPost]
        public IActionResult Create([FromBody]CreateShowDto showDto)
        {
            var show = new Show
            {
                WatchPartyId = showDto.WatchPartyId,
                AddedByUserId = showDto.AddedByUserId,
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

        // PUT api/shows/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Show updated)
        {
            var show = _context.Shows.FirstOrDefault(s => s.ShowId == id);
            if (show == null) return NotFound();

            show.Title = updated.Title;
            show.TotalEpisodes = updated.TotalEpisodes;
            show.CurrentEpisode = updated.CurrentEpisode;
            if (updated.CoverUrl != null) show.CoverUrl = updated.CoverUrl;
            _context.SaveChanges();
            return Ok(show);
        }

        // DELETE api/shows/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var show = _context.Shows.FirstOrDefault(s => s.ShowId == id);
            if (show == null) return NotFound();

            _context.Shows.Remove(show);
            _context.SaveChanges();
            return NoContent();
        }


    }
}
