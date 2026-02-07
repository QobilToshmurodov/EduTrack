using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduTrackDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "PasswordHash", "Role", "Username" },
                values: new object[] { 1, "$2a$11$9G7eR6v7S1tF.Gf2BfF3GuU1y5i0Z/n7k5vVpP5Z6oGz4R3W3.z2q", "Admin", "admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
