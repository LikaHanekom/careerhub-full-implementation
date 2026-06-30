import "@testing-library/jest-dom";
import { vi, beforeEach } from "vitest";

//global mock applied to every test file
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

beforeEach(() => {
  localStorage.clear();
});