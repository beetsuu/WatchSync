namespace WatchSync.Api.Models
{
    public class WatchPartyMember
    {
        public int WatchPartyMemberId { get; set; }
        public int WatchPartyId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int TurnOrder { get; set; }
        public DateTime JoinedAt { get; set; }

        public WatchParty WatchParty { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
    }
}
