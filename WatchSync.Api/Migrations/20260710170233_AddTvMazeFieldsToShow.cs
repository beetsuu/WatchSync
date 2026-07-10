using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WatchSync.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTvMazeFieldsToShow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Runtime",
                table: "Shows",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TvMazeId",
                table: "Shows",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Runtime",
                table: "Shows");

            migrationBuilder.DropColumn(
                name: "TvMazeId",
                table: "Shows");
        }
    }
}
