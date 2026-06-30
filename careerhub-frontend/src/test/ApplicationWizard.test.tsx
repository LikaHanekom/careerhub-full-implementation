import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./utils";
import { ApplicationWizard } from "@/components/ApplicationWizard";

describe("ApplicationWizard", () => {
  it("renders the step 1 heading on mount", () => {
    renderWithProviders(
      <ApplicationWizard
        jobId="job-1"
        jobTitle="Senior Developer"
        applicantId="test-candidate-id"
        isEmployer={false}
      />
    );

    expect(
      screen.getByRole("heading", { name: /apply for senior developer/i })
    ).toBeInTheDocument();
  });
});