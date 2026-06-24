import { NextResponse } from "next/server";
import { jobs } from "@/data/jobs";

// Applications counts
const mockStats = jobs.map(job => ({
  jobId: job.id,
  applicationCount: Math.floor(Math.random() * 50) + 1 // 1-50 applications
}));

export async function GET() {
  // If no jobs, return empty array
  if (mockStats.length === 0) {
    return NextResponse.json([]);
  }
  return NextResponse.json(mockStats);
}

export async function POST() {
  return NextResponse.json(
    {
      title: "Method Not Allowed",
      detail: "POST is not supported for this endpoint",
      status: 405
    },
    { status: 405 }
  );
}