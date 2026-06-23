namespace WatchSync.Api.Models
{
    public class WatchPartyMember
    {
        public int WatchPartyMemberId { get; set; }
        public int WatchPartyId { get; set; }
        public int UserId { get; set; }
        public int TurnOrder { get; set; }
        public DateTime JoinedAt { get; set; }

        public WatchParty WatchParty { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
