import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, employerSession } from "./utils";
import { ApplicationWizard } from "@/components/ApplicationWizard";

function renderWizard(props: Partial<React.ComponentProps<typeof ApplicationWizard>> = {}) {
  return renderWithProviders(
    <ApplicationWizard
      jobId="job-1"
      jobTitle="Senior Developer"
      applicantId="test-candidate-id"
      isEmployer={false}
      {...props}
    />
  );
}

describe("ApplicationWizard", () => {
  // Test 1: Renders Step 1 heading on mount
  it("renders the step 1 heading on mount", () => {
    renderWizard();
    expect(screen.getByRole("heading", { name: "Your Details" })).toBeInTheDocument();
  });

  // Test 2: Blocks advancement when requires step1 fields are empty
  it("blocks advancement when required step 1 fields are empty", async () => {
    const user = userEvent.setup();
    renderWizard();

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(
      await screen.findByText(/full name must be at least 2 characters/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Your Details" })).toBeInTheDocument();
  });

  // Test 3: Advances to step 2 when step 1 required fields are filled
  it("advances to step 2 when step 1 required fields are filled", async () => {
    const user = userEvent.setup();
    renderWizard();

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email address/i), "jane@example.com");

    // Debug check — confirm the value actually landed
    expect(screen.getByLabelText(/email address/i)).toHaveValue("jane@example.com");

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(await screen.findByRole("heading", { name: "Your Application" })).toBeInTheDocument();
    });

  // Test 4: Back button preserves step 1 values
  it("preserves step 1 values when Back is clicked", async () => {
    const user = userEvent.setup();
    renderWizard();

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email address/i), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /next/i }));

    await screen.findByRole("heading", { name: "Your Application" });
    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(screen.getByDisplayValue("Jane Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("jane@example.com")).toBeInTheDocument();
  });
  //Test Auth Gate
  // Test 5:
  it("shows the sign-in message when Next is clicked and user is not authenticated", async () => {
    const user = userEvent.setup();
    renderWizard({ applicantId: null });

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email address/i), "jane@example.com");

    expect(screen.getByText(/you need to be signed in as a candidate/i)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Your Application" })).not.toBeInTheDocument();
  });

  // Test 6 : 
  it("advances normally when the user is authenticated as a Candidate", async () => {
    const user = userEvent.setup();
    renderWizard({ applicantId: "test-candidate-id" });

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email address/i), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(await screen.findByRole("heading", { name: "Your Application" })).toBeInTheDocument();
  });

  // Employer variant (per assignment note — gated at component level, not at Next)
  it("shows 'Employers cannot apply' message when rendered for an employer", () => {
    renderWizard({ isEmployer: true });
    expect(screen.getByText(/employers cannot apply for jobs/i)).toBeInTheDocument();
  });

  // Test 7: Review step
  it("review step shows all entered values, with 'Not provided' for empty optional fields", async () => {
    const user = userEvent.setup();
    renderWizard();

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email address/i), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /next/i }));

    await screen.findByRole("heading", { name: "Your Application" });
    await user.selectOptions(screen.getByLabelText(/how did you hear/i), "linkedin");
    // Cover letter and LinkedIn URL left blank intentionally
    await user.click(screen.getByRole("button", { name: /next/i }));

    await screen.findByRole("heading", { name: "Review & Submit" });

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getAllByText("Not provided").length).toBeGreaterThan(0);
  });
});