using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduTrackDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDatabaseAfterFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$X51/d3djweud2S0KtOn6QO2AG.RSt8MjtglXkTcpyjKnfY4De1t5S");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "123456789");
        }
    }
}
