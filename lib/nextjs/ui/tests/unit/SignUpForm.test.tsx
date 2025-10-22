/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignUpForm } from "../../components/forms/SignUpForm";

describe("SignUpForm", () => {
  it("renders all required fields", () => {
    const mockSubmit = jest.fn();
    render(<SignUpForm onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  it("validates email format", async () => {
    const mockSubmit = jest.fn();
    render(<SignUpForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/^email$/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    const submitButton = screen.getByRole("button", { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("validates password strength requirements", async () => {
    const mockSubmit = jest.fn();
    render(<SignUpForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    // Test: too short
    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.change(confirmInput, { target: { value: "short" } });

    const submitButton = screen.getByRole("button", { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("validates password complexity (uppercase, lowercase, number)", async () => {
    const mockSubmit = jest.fn();
    render(<SignUpForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    // Test: no uppercase
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmInput, { target: { value: "password123" } });

    const submitButton = screen.getByRole("button", { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/password must contain uppercase, lowercase, and number/i)
      ).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("validates password confirmation matches", async () => {
    const mockSubmit = jest.fn();
    render(<SignUpForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });
    fireEvent.change(confirmInput, { target: { value: "DifferentPass123" } });

    const submitButton = screen.getByRole("button", { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("submits form with valid data", async () => {
    const mockSubmit = jest.fn().mockResolvedValue({ error: null });
    render(<SignUpForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });
    fireEvent.change(confirmInput, { target: { value: "Password123" } });

    const submitButton = screen.getByRole("button", { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "Password123",
      });
    });
  });

  it("displays success message after registration", async () => {
    const mockSubmit = jest.fn().mockResolvedValue({ error: null });
    render(<SignUpForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });
    fireEvent.change(confirmInput, { target: { value: "Password123" } });

    const submitButton = screen.getByRole("button", { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/check your email to verify your account/i)
      ).toBeInTheDocument();
    });
  });

  it("displays error message from server", async () => {
    const mockSubmit = jest
      .fn()
      .mockResolvedValue({ error: "Email already exists" });
    render(<SignUpForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });
    fireEvent.change(confirmInput, { target: { value: "Password123" } });

    const submitButton = screen.getByRole("button", { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });
});
