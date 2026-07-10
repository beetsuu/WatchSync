namespace WatchSync.Api.Models
{
    public class TvMazeShowCache
    {
        public int Id { get; set; }

        public int TvMazeId { get; set; }

        public string Title { get; set; } = string.Empty;

        public int? Runtime { get; set; }

        public int? EpisodeCount { get; set; }

        public string? CoverUrl { get; set; }

        public DateTime CachedAt { get; set; }
    }
}
