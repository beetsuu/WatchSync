namespace WatchSync.Api.DTOs
{
    public class CreateWatchPartyMemberDto
    {
        public int WatchPartyId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int TurnOrder { get; set; }
    }
}
