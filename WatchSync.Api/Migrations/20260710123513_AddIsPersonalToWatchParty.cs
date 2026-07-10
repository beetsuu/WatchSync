using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WatchSync.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIsPersonalToWatchParty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPersonal",
                table: "WatchParties",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPersonal",
                table: "WatchParties");
        }
    }
}
