using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CareerHub.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddApplicationDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AvailableImmediately",
                table: "applications",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "CoverLetter",
                table: "applications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "applications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "applications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LinkedInUrl",
                table: "applications",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NoticePeriodWeeks",
                table: "applications",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "applications",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "YearsOfExperience",
                table: "applications",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvailableImmediately",
                table: "applications");

            migrationBuilder.DropColumn(
                name: "CoverLetter",
                table: "applications");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "applications");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "applications");

            migrationBuilder.DropColumn(
                name: "LinkedInUrl",
                table: "applications");

            migrationBuilder.DropColumn(
                name: "NoticePeriodWeeks",
                table: "applications");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "applications");

            migrationBuilder.DropColumn(
                name: "YearsOfExperience",
                table: "applications");
        }
    }
}
