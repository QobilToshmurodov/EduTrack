using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduTrackDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class SimplifyAdminPassword : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$HE9bO.tPAnA99BAnD9VlreO99BAnD9VlreO99BAnD9VlreO99BAnD");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$9G7eR6v7S1tF.Gf2BfF3GuU1y5i0Z/n7k5vVpP5Z6oGz4R3W3.z2q");
        }
    }
}
