/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { SubscriptionStatus } from "../../components/marketing/SubscriptionStatus";

describe("SubscriptionStatus", () => {
  it("displays active subscription correctly", () => {
    render(
      <SubscriptionStatus
        status="active"
        planName="Pro"
        renewsAt={new Date("2025-11-22")}
        detailed
      />
    );

    expect(screen.getByText(/active subscription/i)).toBeInTheDocument();
    expect(screen.getByText(/pro plan/i)).toBeInTheDocument();
    expect(
      screen.getByText(/your subscription is active/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/renews on/i)).toBeInTheDocument();
  });

  it("displays trialing subscription with end date", () => {
    const trialEnd = new Date("2025-10-30");

    render(
      <SubscriptionStatus
        status="trialing"
        planName="Basic"
        trialEndsAt={trialEnd}
        detailed
      />
    );

    expect(screen.getByText(/free trial/i)).toBeInTheDocument();
    expect(screen.getByText(/trial ends on/i)).toBeInTheDocument();
    expect(screen.getByText(/no charges until trial ends/i)).toBeInTheDocument();
  });

  it("displays past_due subscription with warning", () => {
    render(
      <SubscriptionStatus status="past_due" planName="Pro" detailed />
    );

    expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
    expect(
      screen.getByText(/please update your payment method/i)
    ).toBeInTheDocument();
    // Warning icon should be present
    expect(screen.getByText(/⚠️/)).toBeInTheDocument();
  });

  it("displays canceled subscription", () => {
    const endDate = new Date("2025-12-31");

    render(
      <SubscriptionStatus
        status="canceled"
        planName="Pro"
        renewsAt={endDate}
        detailed
      />
    );

    expect(screen.getByText(/canceled/i)).toBeInTheDocument();
    expect(
      screen.getByText(/your subscription will end on/i)
    ).toBeInTheDocument();
  });

  it("displays unpaid subscription", () => {
    render(<SubscriptionStatus status="unpaid" planName="Pro" detailed />);

    expect(screen.getByText(/unpaid/i)).toBeInTheDocument();
    expect(
      screen.getByText(/your subscription is unpaid/i)
    ).toBeInTheDocument();
  });

  it("displays incomplete subscription", () => {
    render(<SubscriptionStatus status="incomplete" planName="Pro" detailed />);

    expect(screen.getByText(/incomplete/i)).toBeInTheDocument();
    expect(
      screen.getByText(/your subscription setup is incomplete/i)
    ).toBeInTheDocument();
  });

  it("displays incomplete_expired subscription", () => {
    render(
      <SubscriptionStatus status="incomplete_expired" planName="Pro" detailed />
    );

    expect(screen.getByText(/expired/i)).toBeInTheDocument();
    expect(
      screen.getByText(/your subscription setup expired/i)
    ).toBeInTheDocument();
  });

  it("displays paused subscription", () => {
    render(<SubscriptionStatus status="paused" planName="Pro" detailed />);

    expect(screen.getByText(/paused/i)).toBeInTheDocument();
    expect(
      screen.getByText(/your subscription is paused/i)
    ).toBeInTheDocument();
  });

  it("shows manage button when callback provided", () => {
    const mockManage = jest.fn();

    render(
      <SubscriptionStatus
        status="active"
        planName="Pro"
        onManageSubscription={mockManage}
      />
    );

    const manageButton = screen.getByRole("button", { name: /manage/i });
    expect(manageButton).toBeInTheDocument();
  });

  it("calls onManageSubscription when manage button clicked", () => {
    const mockManage = jest.fn();

    render(
      <SubscriptionStatus
        status="active"
        planName="Pro"
        onManageSubscription={mockManage}
      />
    );

    const manageButton = screen.getByRole("button", { name: /manage/i });
    fireEvent.click(manageButton);

    expect(mockManage).toHaveBeenCalledTimes(1);
  });

  it("hides manage button when callback not provided", () => {
    render(<SubscriptionStatus status="active" planName="Pro" />);

    expect(
      screen.queryByRole("button", { name: /manage/i })
    ).not.toBeInTheDocument();
  });

  it("hides detailed information when detailed=false", () => {
    render(
      <SubscriptionStatus
        status="active"
        planName="Pro"
        renewsAt={new Date("2025-11-22")}
        detailed={false}
      />
    );

    // Should show status and plan name
    expect(screen.getByText(/active subscription/i)).toBeInTheDocument();
    expect(screen.getByText(/pro plan/i)).toBeInTheDocument();

    // Should NOT show detailed info
    expect(
      screen.queryByText(/your subscription is active/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/renews on/i)).not.toBeInTheDocument();
  });

  it("uses correct icon colors for each status", () => {
    const { container, rerender } = render(
      <SubscriptionStatus status="active" planName="Pro" />
    );

    // Active: success (green)
    expect(container.querySelector(".text-success")).toBeInTheDocument();

    // Past due: warning (yellow)
    rerender(<SubscriptionStatus status="past_due" planName="Pro" />);
    expect(container.querySelector(".text-warning")).toBeInTheDocument();

    // Canceled: destructive (red)
    rerender(<SubscriptionStatus status="canceled" planName="Pro" />);
    expect(container.querySelector(".text-destructive")).toBeInTheDocument();

    // Trialing: info (blue)
    rerender(<SubscriptionStatus status="trialing" planName="Pro" />);
    expect(container.querySelector(".text-info")).toBeInTheDocument();
  });

  it("formats dates correctly", () => {
    const renewDate = new Date("2025-11-22");

    render(
      <SubscriptionStatus
        status="active"
        planName="Pro"
        renewsAt={renewDate}
        detailed
      />
    );

    // Check date is formatted (exact format depends on locale)
    expect(screen.getByText(/11\/22\/2025|22\/11\/2025/)).toBeInTheDocument();
  });
});
