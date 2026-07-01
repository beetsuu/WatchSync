namespace WatchSync.Api.DTOs
{
    public class CreateWatchEntryDto
    {
        public int WatchPartyId { get; set; }
        public int ShowId { get; set; }
        public int PartyTurnCountAfter { get; set; }

    }
}
