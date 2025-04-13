using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MusicSchoolBookingSystem.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserModelAndRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Step 1: Create Users table
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FirstName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    LastName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    PhoneNumber = table.Column<string>(type: "character varying(15)", maxLength: 15, nullable: false),
                    Role = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            // Step 2: Add UserId columns
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Teachers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Students",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            // Step 3: Insert and map data from Teachers and Students into Users
            migrationBuilder.Sql(@"
                -- Insert Users from Teachers
                INSERT INTO ""Users"" (""FirstName"", ""LastName"", ""Email"", ""PasswordHash"", ""PhoneNumber"", ""Role"", ""CreatedAt"")
                SELECT
                    split_part(""Name"", ' ', 1),
                    split_part(""Name"", ' ', 2),
                    ""Email"",
                    '', -- default hash
                    COALESCE(""PhoneNumber"", ''),
                    'Teacher',
                    now()
                FROM ""Teachers"";

                -- Link Teachers to their new UserId
                UPDATE ""Teachers"" t
                SET ""UserId"" = u.""Id""
                FROM ""Users"" u
                WHERE t.""Email"" = u.""Email"" AND u.""Role"" = 'Teacher';

                -- Insert Users from Students
                INSERT INTO ""Users"" (""FirstName"", ""LastName"", ""Email"", ""PasswordHash"", ""PhoneNumber"", ""Role"", ""CreatedAt"")
                SELECT
                    split_part(""Name"", ' ', 1),
                    split_part(""Name"", ' ', 2),
                    ""Email"",
                    '',
                    COALESCE(""Phone"", ''),
                    'Student',
                    now()
                FROM ""Students"";

                -- Link Students to their new UserId
                UPDATE ""Students"" s
                SET ""UserId"" = u.""Id""
                FROM ""Users"" u
                WHERE s.""Email"" = u.""Email"" AND u.""Role"" = 'Student';
            ");

            // Step 4: Create indexes
            migrationBuilder.CreateIndex(
                name: "IX_Teachers_UserId",
                table: "Teachers",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Students_UserId",
                table: "Students",
                column: "UserId",
                unique: true);

            // Step 5: Create foreign key constraints
            migrationBuilder.AddForeignKey(
                name: "FK_Students_Users_UserId",
                table: "Students",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Teachers_Users_UserId",
                table: "Teachers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            // Step 6: Drop old columns
            migrationBuilder.DropColumn(name: "Email", table: "Teachers");
            migrationBuilder.DropColumn(name: "Name", table: "Teachers");
            migrationBuilder.DropColumn(name: "PhoneNumber", table: "Teachers");

            migrationBuilder.DropColumn(name: "Email", table: "Students");
            migrationBuilder.DropColumn(name: "Name", table: "Students");
            migrationBuilder.DropColumn(name: "Phone", table: "Students");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Students_Users_UserId", table: "Students");
            migrationBuilder.DropForeignKey(name: "FK_Teachers_Users_UserId", table: "Teachers");

            migrationBuilder.DropTable(name: "Users");

            migrationBuilder.DropIndex(name: "IX_Teachers_UserId", table: "Teachers");
            migrationBuilder.DropIndex(name: "IX_Students_UserId", table: "Students");

            migrationBuilder.DropColumn(name: "UserId", table: "Teachers");
            migrationBuilder.DropColumn(name: "UserId", table: "Students");

            migrationBuilder.AddColumn<string>(
                name: "Email", table: "Teachers", type: "character varying(255)", maxLength: 255, nullable: false, defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name", table: "Teachers", type: "character varying(255)", maxLength: 255, nullable: false, defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber", table: "Teachers", type: "character varying(15)", maxLength: 15, nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email", table: "Students", type: "text", nullable: false, defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name", table: "Students", type: "character varying(255)", maxLength: 255, nullable: false, defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Phone", table: "Students", type: "character varying(15)", maxLength: 15, nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Teachers_Email", table: "Teachers", column: "Email", unique: true);
        }
    }
}
