namespace WatchSync.Api.DTOs
{
    public class CreateWatchPartyDto
    {
        public string Name { get; set; } = string.Empty;
        public int? TurnLimit { get; set; } = null;
    }
}
