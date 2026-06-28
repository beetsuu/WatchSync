namespace WatchSync.Api.Models
{
    public class Show
    {
        public int ShowId { get; set; }
        public int AddedByUserId {  get; set; }
        public string Title { get; set; } = string.Empty;
        public int TotalEpisodes { get; set; }
        public int CurrentEpisode { get; set; }
        public string? CoverUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User AddedByUser { get; set; } = null!;

    }
}
