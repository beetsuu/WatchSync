using System.ComponentModel.DataAnnotations;

namespace WatchSync.Api.DTOs
{
    public class CreateShowDto
    {
        public int WatchPartyId { get; set; }
        public string Title { get; set; } = string.Empty;

        [Range(1, 10000, ErrorMessage = "TotalEpisodes must be at least 1")]
        public int TotalEpisodes { get; set; }
        public int CurrentEpisode { get; set; }
        public string? CoverUrl { get; set; }
    }
}