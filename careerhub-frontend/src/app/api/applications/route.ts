import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

interface ProblemDetails {
  title: string;
  detail: string;
  status: number;
}

export async function POST(request: Request) {
  // Simulate network delay (800ms)
  await new Promise<void>((resolve) => setTimeout(resolve, 800));

  try {
    const body = await request.json();
    const { jobId, email } = body;

    // Validate required fields
    if (!jobId || !email) {
      const error: ProblemDetails = {
        title: 'Validation Error',
        detail: 'jobId and email are required',
        status: 400,
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Validate email format (simple validation)
    if (!email.includes('@')) {
      const error: ProblemDetails = {
        title: 'Validation Error',
        detail: 'Invalid email format',
        status: 400,
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Success response
    const response = {
      id: randomUUID(),
      jobId,
      email,
      submittedAt: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const errorResponse: ProblemDetails = {
      title: 'Server Error',
      detail: 'Failed to process application',
      status: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Handle GET requests 
export async function GET() {
  return NextResponse.json(
    {
      title: 'Method Not Allowed',
      detail: 'GET requests are not supported for applications',
      status: 405,
    },
    { status: 405 }
  );
}