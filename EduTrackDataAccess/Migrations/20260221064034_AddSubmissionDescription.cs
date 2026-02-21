using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduTrackDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddSubmissionDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Submissions",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$Vm3DbG.hL7FM.dmN1T//EuOKRyn5LXucMaIyGVAmDtQf94ED76RES");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Submissions");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$ysMyeog0DjDtJA8XfNjC.uN42CUJ2O.9NvTi/rngnMawwOwRfiu6W");
        }
    }
}
