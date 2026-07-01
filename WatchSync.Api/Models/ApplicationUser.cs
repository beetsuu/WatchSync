using Microsoft.AspNetCore.Identity;

namespace WatchSync.Api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Show> Shows { get; set; } = new List<Show>();
        public ICollection<WatchEntry> WatchEntries { get; set; } = new List<WatchEntry>();
        public ICollection<WatchPartyMember> WatchPartyMembers { get; set; } = new List<WatchPartyMember>();
    }
}
