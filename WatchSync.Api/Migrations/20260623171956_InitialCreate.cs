using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WatchSync.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    AvatarUrl = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "WatchParties",
                columns: table => new
                {
                    WatchPartyId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    TurnLimit = table.Column<int>(type: "integer", nullable: false),
                    CurrentTurnOrder = table.Column<int>(type: "integer", nullable: false),
                    CurrentTurnCount = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WatchParties", x => x.WatchPartyId);
                });

            migrationBuilder.CreateTable(
                name: "Shows",
                columns: table => new
                {
                    ShowId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    WatchPartyId = table.Column<int>(type: "integer", nullable: false),
                    AddedByUserId = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    TotalEpisodes = table.Column<int>(type: "integer", nullable: false),
                    CurrentEpisode = table.Column<int>(type: "integer", nullable: false),
                    CoverUrl = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shows", x => x.ShowId);
                    table.ForeignKey(
                        name: "FK_Shows_Users_AddedByUserId",
                        column: x => x.AddedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Shows_WatchParties_WatchPartyId",
                        column: x => x.WatchPartyId,
                        principalTable: "WatchParties",
                        principalColumn: "WatchPartyId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WatchPartyMembers",
                columns: table => new
                {
                    WatchPartyMemberId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    WatchPartyId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    TurnOrder = table.Column<int>(type: "integer", nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WatchPartyMembers", x => x.WatchPartyMemberId);
                    table.ForeignKey(
                        name: "FK_WatchPartyMembers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WatchPartyMembers_WatchParties_WatchPartyId",
                        column: x => x.WatchPartyId,
                        principalTable: "WatchParties",
                        principalColumn: "WatchPartyId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WatchEntries",
                columns: table => new
                {
                    WatchEntryId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    WatchPartyId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    ShowId = table.Column<int>(type: "integer", nullable: false),
                    WatchedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PartyTurnCountAfter = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WatchEntries", x => x.WatchEntryId);
                    table.ForeignKey(
                        name: "FK_WatchEntries_Shows_ShowId",
                        column: x => x.ShowId,
                        principalTable: "Shows",
                        principalColumn: "ShowId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WatchEntries_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WatchEntries_WatchParties_WatchPartyId",
                        column: x => x.WatchPartyId,
                        principalTable: "WatchParties",
                        principalColumn: "WatchPartyId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Shows_AddedByUserId",
                table: "Shows",
                column: "AddedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Shows_WatchPartyId",
                table: "Shows",
                column: "WatchPartyId");

            migrationBuilder.CreateIndex(
                name: "IX_WatchEntries_ShowId",
                table: "WatchEntries",
                column: "ShowId");

            migrationBuilder.CreateIndex(
                name: "IX_WatchEntries_UserId",
                table: "WatchEntries",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_WatchEntries_WatchPartyId",
                table: "WatchEntries",
                column: "WatchPartyId");

            migrationBuilder.CreateIndex(
                name: "IX_WatchPartyMembers_UserId",
                table: "WatchPartyMembers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_WatchPartyMembers_WatchPartyId",
                table: "WatchPartyMembers",
                column: "WatchPartyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WatchEntries");

            migrationBuilder.DropTable(
                name: "WatchPartyMembers");

            migrationBuilder.DropTable(
                name: "Shows");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "WatchParties");
        }
    }
}
