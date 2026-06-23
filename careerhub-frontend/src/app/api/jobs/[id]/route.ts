import { NextRequest, NextResponse } from 'next/server';
import { jobs } from '@/data/jobs'; 

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Use Promise for App Router
) {
  // Await the params to resolve the ID
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ detail: "ID is missing" }, { status: 400 });
  }

  const job = jobs.find((j) => j.id === id);

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