using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WatchSync.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddInviteCodeToWatchParty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "InviteCode",
                table: "WatchParties",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InviteCode",
                table: "WatchParties");
        }
    }
}
