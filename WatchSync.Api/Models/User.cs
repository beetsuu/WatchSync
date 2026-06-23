namespace WatchSync.Api.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        = string.Empty;
        public string? AvatarUrl { get; set; }

        public DateTime CreatedAt { get; set; }

        public ICollection<Show> Shows { get; set; } = new List<Show>();
        public ICollection<WatchEntry> WatchEntries { get; set; } = new List<WatchEntry>();
        public ICollection<WatchPartyMember> WatchPartyMembers { get; set; } = new List<WatchPartyMember>();
    }
}
