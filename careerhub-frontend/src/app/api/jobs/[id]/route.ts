import { NextRequest, NextResponse } from "next/server";
import { jobs } from "@/data/jobs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const job = jobs.find((j) => j.id === params.id);

  if (!job) {
    return NextResponse.json(
      {
        title: "Not Found",
        detail: `No job with id "${params.id}"`,
        status: 404,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(job);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const job = jobs.find((j) => j.id === params.id);

  if (!job) {
    return NextResponse.json(
      {
        title: "Not Found",
        detail: `No job with id "${params.id}"`,
        status: 404,
      },
      { status: 404 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        title: "Bad Request",
        detail: "Request body must be valid JSON",
        status: 400,
      },
      { status: 400 }
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("isActive" in body) ||
    typeof (body as Record<string, unknown>).isActive !== "boolean"
  ) {
    return NextResponse.json(
      {
        title: "Bad Request",
        detail: '"isActive" field is required and must be a boolean',
        status: 400,
      },
      { status: 400 }
    );
  }

  // Mutate in place — persists for the server process lifetime
  job.isActive = (body as { isActive: boolean }).isActive;

  return NextResponse.json(job);
}