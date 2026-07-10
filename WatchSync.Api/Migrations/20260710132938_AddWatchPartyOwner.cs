using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WatchSync.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddWatchPartyOwner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "WatchParties",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_WatchParties_OwnerId",
                table: "WatchParties",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_WatchParties_AspNetUsers_OwnerId",
                table: "WatchParties",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WatchParties_AspNetUsers_OwnerId",
                table: "WatchParties");

            migrationBuilder.DropIndex(
                name: "IX_WatchParties_OwnerId",
                table: "WatchParties");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "WatchParties");
        }
    }
}
