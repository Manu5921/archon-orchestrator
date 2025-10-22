/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PricingTable } from "../../components/marketing/PricingTable";

describe("PricingTable", () => {
  const mockPlans = [
    {
      name: "Basic",
      price: 999,
      interval: "month" as const,
      trialDays: 7,
      features: ["Feature 1", "Feature 2"],
      priceId: "price_basic",
    },
    {
      name: "Pro",
      price: 1999,
      interval: "month" as const,
      features: ["Feature 1", "Feature 2", "Feature 3"],
      priceId: "price_pro",
      highlighted: true,
    },
  ];

  it("renders all pricing plans", () => {
    const mockCheckout = jest.fn();
    render(<PricingTable plans={mockPlans} onCheckout={mockCheckout} />);

    expect(screen.getByText("Basic")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
  });

  it("displays plan prices correctly", () => {
    const mockCheckout = jest.fn();
    render(<PricingTable plans={mockPlans} onCheckout={mockCheckout} />);

    expect(screen.getByText("$9.99")).toBeInTheDocument(); // 999 cents
    expect(screen.getByText("$19.99")).toBeInTheDocument(); // 1999 cents
  });

  it("displays trial period when present", () => {
    const mockCheckout = jest.fn();
    render(<PricingTable plans={mockPlans} onCheckout={mockCheckout} />);

    expect(screen.getByText(/with 7 day free trial/i)).toBeInTheDocument();
  });

  it("highlights popular plan", () => {
    const mockCheckout = jest.fn();
    render(<PricingTable plans={mockPlans} onCheckout={mockCheckout} />);

    expect(screen.getByText("Popular")).toBeInTheDocument();
  });

  it("displays all features for each plan", () => {
    const mockCheckout = jest.fn();
    render(<PricingTable plans={mockPlans} onCheckout={mockCheckout} />);

    const featureLists = screen.getAllByTestId("pricing-features");
    expect(featureLists).toHaveLength(2);

    // Basic plan: 2 features
    expect(featureLists[0].children).toHaveLength(2);
    // Pro plan: 3 features
    expect(featureLists[1].children).toHaveLength(3);
  });

  it("uses CSS variables only (no hardcoded colors)", () => {
    const mockCheckout = jest.fn();
    const { container } = render(
      <PricingTable plans={mockPlans} onCheckout={mockCheckout} />
    );

    const html = container.innerHTML;

    // Should NOT contain hardcoded Tailwind colors
    expect(html).not.toMatch(/text-gray-\d+/);
    expect(html).not.toMatch(/text-orange-\d+/);
    expect(html).not.toMatch(/bg-blue-\d+/);

    // Should contain CSS variable classes
    expect(html).toMatch(/text-foreground/);
    expect(html).toMatch(/text-muted-foreground/);
    expect(html).toMatch(/text-primary/);
  });

  it("calls onCheckout with correct priceId when button clicked", async () => {
    const mockCheckout = jest.fn().mockResolvedValue(undefined);
    render(<PricingTable plans={mockPlans} onCheckout={mockCheckout} />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]); // Click "Get Started" for Basic plan

    await waitFor(() => {
      expect(mockCheckout).toHaveBeenCalledWith("price_basic");
    });
  });

  it("disables buttons during checkout", async () => {
    const mockCheckout = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
    render(<PricingTable plans={mockPlans} onCheckout={mockCheckout} />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  it("supports custom CTA text", () => {
    const customPlan = {
      ...mockPlans[0],
      ctaText: "Buy Now",
    };

    const mockCheckout = jest.fn();
    render(<PricingTable plans={[customPlan]} onCheckout={mockCheckout} />);

    expect(screen.getByText("Buy Now")).toBeInTheDocument();
  });

  it("displays interval correctly", () => {
    const yearlyPlan = {
      ...mockPlans[0],
      interval: "year" as const,
    };

    const mockCheckout = jest.fn();
    render(<PricingTable plans={[yearlyPlan]} onCheckout={mockCheckout} />);

    expect(screen.getByText(/\/ year/i)).toBeInTheDocument();
  });
});
