using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WatchSync.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddWatchPartyIdBackToShow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shows_WatchParties_WatchPartyId",
                table: "Shows");

            migrationBuilder.AlterColumn<int>(
                name: "WatchPartyId",
                table: "Shows",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Shows_WatchParties_WatchPartyId",
                table: "Shows",
                column: "WatchPartyId",
                principalTable: "WatchParties",
                principalColumn: "WatchPartyId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shows_WatchParties_WatchPartyId",
                table: "Shows");

            migrationBuilder.AlterColumn<int>(
                name: "WatchPartyId",
                table: "Shows",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Shows_WatchParties_WatchPartyId",
                table: "Shows",
                column: "WatchPartyId",
                principalTable: "WatchParties",
                principalColumn: "WatchPartyId");
        }
    }
}
