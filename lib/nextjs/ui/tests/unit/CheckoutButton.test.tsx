/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CheckoutButton } from "../../components/marketing/CheckoutButton";

describe("CheckoutButton", () => {
  it("renders with default text", () => {
    const mockCheckout = jest.fn();
    render(<CheckoutButton priceId="price_xxx" onCheckout={mockCheckout} />);

    expect(
      screen.getByRole("button", { name: /subscribe now/i })
    ).toBeInTheDocument();
  });

  it("renders with custom text", () => {
    const mockCheckout = jest.fn();
    render(
      <CheckoutButton priceId="price_xxx" onCheckout={mockCheckout}>
        Buy Now
      </CheckoutButton>
    );

    expect(screen.getByRole("button", { name: /buy now/i })).toBeInTheDocument();
  });

  it("calls createCheckoutSession() with priceId when clicked", async () => {
    const mockCheckout = jest.fn().mockResolvedValue(undefined);
    render(<CheckoutButton priceId="price_xxx" onCheckout={mockCheckout} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockCheckout).toHaveBeenCalledWith("price_xxx");
      expect(mockCheckout).toHaveBeenCalledTimes(1);
    });
  });

  it("disables button during checkout", async () => {
    const mockCheckout = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
    render(<CheckoutButton priceId="price_xxx" onCheckout={mockCheckout} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
      expect(screen.getByText(/processing/i)).toBeInTheDocument();
    });
  });

  it("shows loading state with spinner during checkout", async () => {
    const mockCheckout = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
    render(<CheckoutButton priceId="price_xxx" onCheckout={mockCheckout} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/processing/i)).toBeInTheDocument();
      // Verify spinner icon is present (lucide-react renders SVG)
      const svg = button.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  it("respects disabled prop", () => {
    const mockCheckout = jest.fn();
    render(
      <CheckoutButton
        priceId="price_xxx"
        onCheckout={mockCheckout}
        disabled
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(mockCheckout).not.toHaveBeenCalled();
  });

  it("passes through ButtonProps correctly", () => {
    const mockCheckout = jest.fn();
    render(
      <CheckoutButton
        priceId="price_xxx"
        onCheckout={mockCheckout}
        variant="destructive"
        size="lg"
        className="custom-class"
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("handles checkout errors gracefully", async () => {
    const mockCheckout = jest
      .fn()
      .mockRejectedValue(new Error("Payment failed"));
    const consoleError = jest.spyOn(console, "error").mockImplementation();

    render(<CheckoutButton priceId="price_xxx" onCheckout={mockCheckout} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockCheckout).toHaveBeenCalled();
    });

    // Button should re-enable after error
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });

    consoleError.mockRestore();
  });

  it("prevents multiple simultaneous clicks", async () => {
    const mockCheckout = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
    render(<CheckoutButton priceId="price_xxx" onCheckout={mockCheckout} />);

    const button = screen.getByRole("button");

    // Click multiple times rapidly
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    await waitFor(() => {
      // Should only be called once (button disabled after first click)
      expect(mockCheckout).toHaveBeenCalledTimes(1);
    });
  });
});
