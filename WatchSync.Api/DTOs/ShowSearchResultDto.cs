namespace WatchSync.Api.DTOs;

public class ShowSearchResultDto
{
    public int ExternalId { get; set; }
    public string Title { get; set; } = "";
    public string? CoverUrl { get; set; }
    public int? Runtime { get; set; }

}