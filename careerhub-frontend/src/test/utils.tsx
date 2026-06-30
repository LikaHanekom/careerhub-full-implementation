import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import { useSession } from "next-auth/react";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

type Role = "candidate" | "employer";

interface FakeSession {
  user: {
    id: string;
    email: string;
    role: Role;
  };
  expires: string;
}

const defaultCandidateSession: FakeSession = {
  user: {
    id: "test-candidate-id",
    email: "candidate@test.com",
    role: "candidate",
  },
  expires: "2099-01-01T00:00:00.000Z",
};

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  session?: FakeSession | null;
}

export function renderWithProviders(
  ui: ReactElement,
  { session = defaultCandidateSession, ...renderOptions }: RenderWithProvidersOptions = {}
) {
  vi.mocked(useSession).mockReturnValue({
    data: session as any,
    status: session ? "authenticated" : "unauthenticated",
    update: vi.fn(),
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export { defaultCandidateSession };
export const employerSession: FakeSession = {
  user: {
    id: "test-employer-id",
    email: "employer@test.com",
    role: "employer",
  },
  expires: "2099-01-01T00:00:00.000Z",
};