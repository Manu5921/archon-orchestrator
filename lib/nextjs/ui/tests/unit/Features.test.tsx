import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Features } from '../../components/marketing/Features';

describe('Features Component', () => {
  const mockFeatures = [
    {
      name: 'Authentication',
      description: 'Secure auth with Supabase',
      icon: <svg data-testid="auth-icon" />,
    },
    {
      name: 'Payments',
      description: 'Stripe integration built-in',
      icon: <svg data-testid="payments-icon" />,
    },
    {
      name: 'Email',
      description: 'Transactional emails with Resend',
      icon: <svg data-testid="email-icon" />,
    },
  ];

  it('renders headline and subheadline', () => {
    render(
      <Features
        headline="Everything you need"
        subheadline="All-in-one platform"
        features={mockFeatures}
      />
    );

    expect(screen.getByText('Everything you need')).toBeInTheDocument();
    expect(screen.getByText('All-in-one platform')).toBeInTheDocument();
  });

  it('renders all features with names and descriptions', () => {
    render(
      <Features
        headline="Features"
        features={mockFeatures}
      />
    );

    // Check each feature is rendered
    expect(screen.getByText('Authentication')).toBeInTheDocument();
    expect(screen.getByText('Secure auth with Supabase')).toBeInTheDocument();

    expect(screen.getByText('Payments')).toBeInTheDocument();
    expect(screen.getByText('Stripe integration built-in')).toBeInTheDocument();

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Transactional emails with Resend')).toBeInTheDocument();
  });

  it('renders feature icons when provided', () => {
    render(
      <Features
        headline="Features"
        features={mockFeatures}
      />
    );

    expect(screen.getByTestId('auth-icon')).toBeInTheDocument();
    expect(screen.getByTestId('payments-icon')).toBeInTheDocument();
    expect(screen.getByTestId('email-icon')).toBeInTheDocument();
  });

  it('renders without icons when not provided', () => {
    const featuresWithoutIcons = [
      { name: 'Feature 1', description: 'Description 1' },
      { name: 'Feature 2', description: 'Description 2' },
    ];

    const { container } = render(
      <Features
        headline="Features"
        features={featuresWithoutIcons}
      />
    );

    // No icon containers should be rendered
    const iconContainers = container.querySelectorAll('.bg-primary\\/10');
    expect(iconContainers.length).toBe(0);
  });

  it('applies correct grid columns classes', () => {
    const { container: twoColsContainer } = render(
      <Features
        headline="Features"
        features={mockFeatures}
        columns={2}
      />
    );

    const { container: threeColsContainer } = render(
      <Features
        headline="Features"
        features={mockFeatures}
        columns={3}
      />
    );

    const { container: fourColsContainer } = render(
      <Features
        headline="Features"
        features={mockFeatures}
        columns={4}
      />
    );

    // Check grid classes for each column variant
    const twoColsGrid = twoColsContainer.querySelector('.grid');
    const threeColsGrid = threeColsContainer.querySelector('.grid');
    const fourColsGrid = fourColsContainer.querySelector('.grid');

    expect(twoColsGrid?.className).toMatch(/sm:grid-cols-2/);
    expect(threeColsGrid?.className).toMatch(/lg:grid-cols-3/);
    expect(fourColsGrid?.className).toMatch(/lg:grid-cols-4/);
  });

  it('renders correct number of feature items', () => {
    const { container } = render(
      <Features
        headline="Features"
        features={mockFeatures}
      />
    );

    const featureItems = container.querySelectorAll('.flex.flex-col.items-start');
    expect(featureItems.length).toBe(3);
  });

  it('uses CSS variables only (no hardcoded colors)', () => {
    const { container } = render(
      <Features
        headline="Features"
        features={mockFeatures}
      />
    );

    const html = container.innerHTML;

    // Should NOT contain hardcoded Tailwind color classes
    expect(html).not.toMatch(/text-gray-\d+/);
    expect(html).not.toMatch(/bg-blue-\d+/);
    expect(html).not.toMatch(/text-orange-\d+/);

    // Should contain CSS variable classes
    expect(html).toMatch(/text-foreground/);
    expect(html).toMatch(/text-muted-foreground/);
    expect(html).toMatch(/bg-primary/);
  });
});
