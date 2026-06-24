/**
 * Base URL for Next.js Route Handlers (mock /api/* routes in this app).
 * NEXT_PUBLIC_API_URL points at the .NET backend; these routes live on the Next app.
 */
export function getInternalApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

export async function fetchInternalApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${getInternalApiBaseUrl()}${path}`, options);

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }

  return res.json();
}
