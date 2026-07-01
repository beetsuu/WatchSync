using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WatchSync.Api.Models;

namespace WatchSync.Api.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<Show> Shows { get; set; }
        public DbSet<WatchEntry> WatchEntries { get; set; }
        public DbSet<WatchParty> WatchParties { get; set; }
        public DbSet<WatchPartyMember> WatchPartyMembers { get; set; }

    }
}
