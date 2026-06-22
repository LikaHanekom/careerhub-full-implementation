//mock backend
import {NextResponse} from 'next/server';
import { JobListing } from '../../../types';

export async function GET() {
  // Matches Assignment 1.1 seed data
  const jobs: JobListing[] = [
    {
      id: "1",
      title: "Frontend Engineer",
      company: "Tech Solutions",
      location: "Cape Town",
      employmentType: "FullTime",
      salaryMin: 50000,
      salaryMax: 70000,
      postedAt: "2026-06-15T08:00:00Z",
      isActive: true,
      applicantCount: 5,
      isAvailable: true,
    },
    {
      id: "2",
      title: "Junior Designer",
      company: "Creative Agency",
      location: "Johannesburg",
      employmentType: "Internship",
      salaryMin: 12000,
      salaryMax: 18000,
      postedAt: "2026-06-16T14:30:00Z",
      isActive: false,
      applicantCount: 0,
      isAvailable: true,
    },
    {
      id: "3",
      title: "Junior Software Engineer",
      company: "BitCube",
      location: "Bloemfontein",
      employmentType: "Internship",
      salaryMin: 12000,
      salaryMax: 18000,
      postedAt: "2026-06-16T14:30:00Z",
      isActive: true,
      applicantCount: 0,
      isAvailable: true,
    },
    {
      id: "4",
      title: "Junior Technical Support",
      company: "University of the Free State",
      location: "Bloemfontein",
      employmentType: "PartTime",
      salaryMin: 12000,
      salaryMax: 18000,
      postedAt: "2026-06-16T14:30:00Z",
      isActive: false,
      applicantCount: 0,
      isAvailable: true,
    },
    {
      id: "5",
      title: "Front End Developer",
      company: "Absa Bank",
      location: "CapeTown",
      employmentType: "FullTime",
      salaryMin: 12000,
      salaryMax: 18000,
      postedAt: "2026-06-16T14:30:00Z",
      isActive: false,
      applicantCount: 0,
      isAvailable: true,
    },
    {
      id: "6",
      title: "Senior Software Engineer",
      company: "Standard Bank",
      location: "Johannesburg",
      employmentType: "Contract",
      salaryMin: 12000,
      salaryMax: 18000,
      postedAt: "2026-05-16T14:30:00Z",
      isActive: true,
      applicantCount: 0,
      isAvailable: true,
    },
  ];
  

  return NextResponse.json(jobs);
}