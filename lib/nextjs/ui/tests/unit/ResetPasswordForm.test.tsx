/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ResetPasswordForm } from "../../components/forms/ResetPasswordForm";

describe("ResetPasswordForm", () => {
  it("renders email field and submit button", () => {
    const mockSubmit = jest.fn();
    render(<ResetPasswordForm onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset email/i })
    ).toBeInTheDocument();
  });

  it("validates required email field", async () => {
    const mockSubmit = jest.fn();
    render(<ResetPasswordForm onSubmit={mockSubmit} />);

    const submitButton = screen.getByRole("button", { name: /send reset email/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("validates email format", async () => {
    const mockSubmit = jest.fn();
    render(<ResetPasswordForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    const submitButton = screen.getByRole("button", { name: /send reset email/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("calls resetPassword() with email", async () => {
    const mockSubmit = jest.fn().mockResolvedValue({ error: null });
    render(<ResetPasswordForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /send reset email/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });
  });

  it("displays success message after sending email", async () => {
    const mockSubmit = jest.fn().mockResolvedValue({ error: null });
    render(<ResetPasswordForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /send reset email/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/check your email for a password reset link/i)
      ).toBeInTheDocument();
    });

    // Verify form is hidden and success UI is shown
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send to a different email/i })
    ).toBeInTheDocument();
  });

  it("allows sending to a different email after success", async () => {
    const mockSubmit = jest.fn().mockResolvedValue({ error: null });
    render(<ResetPasswordForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /send reset email/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/check your email for a password reset link/i)
      ).toBeInTheDocument();
    });

    // Click "Send to a different email"
    const tryAgainButton = screen.getByRole("button", {
      name: /send to a different email/i,
    });
    fireEvent.click(tryAgainButton);

    // Form should be visible again
    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/check your email for a password reset link/i)
      ).not.toBeInTheDocument();
    });
  });

  it("displays error message from server", async () => {
    const mockSubmit = jest
      .fn()
      .mockResolvedValue({ error: "Failed to send email" });
    render(<ResetPasswordForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /send reset email/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to send email/i)).toBeInTheDocument();
    });
  });

  it("disables form during submission", async () => {
    const mockSubmit = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ error: null }), 100))
      );
    render(<ResetPasswordForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /send reset email/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(emailInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });
});
