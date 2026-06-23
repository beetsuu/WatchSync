namespace WatchSync.Api.Models
{
    public class WatchEntry
    {
        public int WatchEntryId { get; set; }
        public int WatchPartyId { get; set; }
        public int UserId { get; set; }
        public int ShowId { get; set; }
        public int PartyTurnCountAfter { get; set; }
        public DateTime WatchedAt { get; set; }

        public WatchParty WatchParty { get; set; } = null!;
        public User User { get; set; } = null!;
        public Show Show { get; set; } = null!;
    }
}
