namespace WatchSync.Api.Models
{
    public class WatchEntry
    {
        public int WatchEntryId { get; set; }
        public int WatchPartyId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int ShowId { get; set; }
        public int PartyTurnCountAfter { get; set; }
        public DateTime WatchedAt { get; set; }

        public WatchParty WatchParty { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
        public Show Show { get; set; } = null!;
    }
}
