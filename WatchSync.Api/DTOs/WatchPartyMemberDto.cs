namespace WatchSync.Api.DTOs
{
    public class WatchPartyMemberDto
    {
        public int WatchPartyMemberId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public int TurnOrder { get; set; }
        public bool IsOwner { get; set; }
    }
}