namespace WatchSync.Api.DTOs
{
    public class UpdateShowDto
    {
        public int ShowId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int TotalEpisodes { get; set; }
        public int CurrentEpisode { get; set; }
        public string? CoverUrl { get; set; }


    }
}
