import { NextRequest, NextResponse } from "next/server";
import { jobs } from "@/data/jobs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params since it's now a Promise
  const { id } = await params;
  const job = jobs.find(j => j.id === id);

  if (!job) {
    return NextResponse.json(
      {
        title: "Job Not Found",
        detail: `No job found with ID: ${id}`,
        status: 404
      },
      { status: 404 }
    );
  }

  return NextResponse.json(job);
}

// PATCH handler - updated for Next.js 16
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params since it's now a Promise
  const { id } = await params;
  const jobIndex = jobs.findIndex(j => j.id === id);

  if (jobIndex === -1) {
    return NextResponse.json(
      {
        title: "Job Not Found",
        detail: `No job found with ID: ${id}`,
        status: 404
      },
      { status: 404 }
    );
  }

  // Parse request body
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        title: "Bad Request",
        detail: "Invalid JSON body",
        status: 400
      },
      { status: 400 }
    );
  }

  // Check if status or isAvailable field is present
  if (!body.status && body.isAvailable === undefined) {
    return NextResponse.json(
      {
        title: "Bad Request",
        detail: "status or isAvailable field is required",
        status: 400
      },
      { status: 400 }
    );
  }

  // Update the job
  const updatedJob = { 
    ...jobs[jobIndex], 
    ...(body.status && { status: body.status }),
    ...(body.isAvailable !== undefined && { isAvailable: body.isAvailable })
  };
  jobs[jobIndex] = updatedJob;

  return NextResponse.json(updatedJob);
}

// POST handler - updated for Next.js 16
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