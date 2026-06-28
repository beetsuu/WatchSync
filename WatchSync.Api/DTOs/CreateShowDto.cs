namespace WatchSync.Api.DTOs
{
    public class CreateShowDto
    {
        public int AddedByUserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int TotalEpisodes { get; set; }
        public int CurrentEpisode { get; set; }
        public string? CoverUrl { get; set; }

    }
}
