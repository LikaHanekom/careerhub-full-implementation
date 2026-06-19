export type EmploymentType = "Full-Time" | "Part-Time" | "Contract" | "Internship" | "Freelance";
//defines the shape of the data 
export interface JobListing {
    id: string; // GUID format
    title: string;
    company: string;
    location: string;
    employmentType: EmploymentType; 
    salaryMin: number;
    salaryMax: number;
    postedAt: string; // ISO 8601 date
    isActive: boolean;
    applicantCount: number;
    isAvailable: boolean;
}
