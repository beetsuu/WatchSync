namespace WatchSync.Api.DTOs
{
    public class CreateWatchPartyMemberDto
    {
        public int WatchPartyId { get; set; }
        public int UserId { get; set; }
        public int TurnOrder { get; set; }
        public DateTime JoinedAt { get; set; }
    }
}
