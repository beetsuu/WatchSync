namespace WatchSync.Api.DTOs;

public class ShowDetailsDto
{
    public int ExternalId { get; set; }
    public string Title { get; set; } = "";
    public string? CoverUrl { get; set; }
    public int TotalEpisodes { get; set; }
    public int? Runtime { get; set; }
}
