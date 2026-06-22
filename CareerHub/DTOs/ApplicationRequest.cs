namespace CareerHub.Api.DTOs;

public class ApplicationRequest
{
    public Guid JobListingId { get; set; }
    public Guid ApplicantId { get; set; } // Keep this for the link, add profile fields below
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public int YearsOfExperience { get; set; }
    public string CoverLetter { get; set; } = string.Empty;
    public string? LinkedInUrl { get; set; }
    public bool AvailableImmediately { get; set; }
    public int NoticePeriodWeeks { get; set; }
}