using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MusicSchoolBookingSystem.Migrations
{
    /// <inheritdoc />
    public partial class RenameUserPassword2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PasswordHash",
                table: "Users",
                newName: "Password");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
