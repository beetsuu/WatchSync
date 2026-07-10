namespace WatchSync.Api.Models
{
    public class WatchParty
    {
        public int WatchPartyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string InviteCode { get; set; } = string.Empty;
        public int? TurnLimit { get; set; }
        public int CurrentTurnOrder { get; set; }
        public int CurrentTurnCount { get; set; }
        public bool IsPersonal { get; set; } = false;
        public string OwnerId { get; set; } = string.Empty;
        public ApplicationUser Owner { get; set; } = null!;
        public DateTime CreatedAt { get; set; }

        public ICollection<Show> Shows { get; set; } = new List<Show>();
        public ICollection<WatchEntry> WatchEntries { get; set; } = new List<WatchEntry>();
        public ICollection<WatchPartyMember> WatchPartyMembers { get; set; } = new List<WatchPartyMember>();


    }
}
