namespace WatchSync.Api.Models
{
    public class Show
    {
        public int ShowId { get; set; }
        public int WatchPartyId { get; set; }
        public string AddedByUserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public int TotalEpisodes { get; set; }
        public int CurrentEpisode { get; set; }
        public string? CoverUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public WatchParty WatchParty { get; set; } = null!;
        public ApplicationUser AddedByUser { get; set; } = null!;

    }
}
