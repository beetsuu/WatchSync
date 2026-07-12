namespace WatchSync.Api.DTOs
{
    public class UpdateProfileDto
    {
        public string DisplayName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
    }
}
