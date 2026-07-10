namespace WatchSync.Api.DTOs
{
    public class CreateWatchPartyDto
    {
        public string Name { get; set; } = "";
        public int? TurnLimit { get; set; }

        public int CurrentTurnCount { get; set; }
        public int CurrentTurnOrder { get; set; }
    }
}
