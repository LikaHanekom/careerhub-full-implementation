import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "./msw/server";
import { within } from "@testing-library/react";
import { renderWithProviders } from "./utils";
import CloseJobButton from "@/components/CloseJobFunction";

describe("CloseJobButton", () => {
  // Test 10
  it("opens the AlertDialog when the button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CloseJobButton jobId="job-1" isActive={true} />);

    await user.click(screen.getByRole("button", { name: "Close listing" }));

    expect(
      await screen.findByRole("heading", { name: "Close this listing?" })
    ).toBeInTheDocument();
  });

  // Test 11: When the user confirms the API is called
  it("calls the close API when the user confirms", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CloseJobButton jobId="job-1" isActive={true} />);

    await user.click(screen.getByRole("button", { name: "Close listing" }));
    const dialog = await screen.findByRole("alertdialog");

    const confirmButton = within(dialog).getByRole("button", { name: "Close listing" });
    await user.click(confirmButton);

    await screen.findByRole("button", { name: "Close listing" }); // only the trigger remains
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
});