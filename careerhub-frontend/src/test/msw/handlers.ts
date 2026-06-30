import { http, HttpResponse } from "msw";

const API = process.env.NEXT_PUBLIC_API_URL;

export const handlers = [
  http.post(`${API}/api/v1/applications/apply`, () => {
    return HttpResponse.json(
      {
        id: "app-123",
        jobId: "job-1",
        email: "jane@example.com",
        submittedAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  // Close job listing — used by CloseJobButton tests
  http.patch(`${API}/api/v1/jobs/:jobId`, () => {
    return HttpResponse.json(
      {
        id: "job-1",
        title: "Senior Developer",
        company: "Acme Inc",
        location: "Remote",
        description: "",
        type: "FullTime",
        salaryMin: null,
        salaryMax: null,
        postedAt: new Date().toISOString(),
        isActive: false,
        applicationCount: 0,
      },
      { status: 200 }
    );
  }),
];