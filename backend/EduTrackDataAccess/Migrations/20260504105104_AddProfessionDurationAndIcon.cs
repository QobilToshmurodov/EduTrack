using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduTrackDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddProfessionDurationAndIcon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DurationYears",
                table: "Professions",
                type: "INTEGER",
                nullable: false,
                defaultValue: 2);

            migrationBuilder.AddColumn<string>(
                name: "IconEmoji",
                table: "Professions",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DurationYears",
                table: "Professions");

            migrationBuilder.DropColumn(
                name: "IconEmoji",
                table: "Professions");
        }
    }
}
