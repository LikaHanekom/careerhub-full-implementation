using System;
using CareerHub.Api.Enums;

namespace CareerHub.Api.Models
{
    public class Application
    {
        public Guid Id { get; set; }

        public Guid JobListingId { get; set; }
        public Guid ApplicantId { get; set; }

        // New fields for application details
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public int YearsOfExperience { get; set; }
        public string CoverLetter { get; set; } = string.Empty;
        public string? LinkedInUrl { get; set; }
        public bool AvailableImmediately { get; set; }
        public int NoticePeriodWeeks { get; set; }

        public DateTime SubmittedAt { get; set; }
        public ApplicationStatus Status { get; set; } = ApplicationStatus.Submitted; 

        // Navigation properties
        public JobListing JobListing { get; set; } = null!;
        public Applicant Applicant { get; set; } = null!;
    }
}