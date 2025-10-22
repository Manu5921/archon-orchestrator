import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '../../components/marketing/Hero';

describe('Hero Component', () => {
  it('renders headline and subheadline', () => {
    render(
      <Hero
        headline="Build SaaS Faster"
        subheadline="Production-ready components"
      />
    );

    expect(screen.getByText('Build SaaS Faster')).toBeInTheDocument();
    expect(screen.getByText('Production-ready components')).toBeInTheDocument();
  });

  it('renders primary CTA with correct href', () => {
    render(
      <Hero
        headline="Test Headline"
        subheadline="Test Subheadline"
        primaryCta={{ label: 'Get Started', href: '/signup' }}
      />
    );

    const ctaLink = screen.getByText('Get Started');
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', '/signup');
  });

  it('renders secondary CTA when provided', () => {
    render(
      <Hero
        headline="Test Headline"
        subheadline="Test Subheadline"
        primaryCta={{ label: 'Get Started', href: '/signup' }}
        secondaryCta={{ label: 'View Demo', href: '/demo' }}
      />
    );

    const primaryCta = screen.getByText('Get Started');
    const secondaryCta = screen.getByText('View Demo');

    expect(primaryCta).toBeInTheDocument();
    expect(secondaryCta).toBeInTheDocument();
    expect(secondaryCta).toHaveAttribute('href', '/demo');
  });

  it('renders without CTAs when not provided', () => {
    const { container } = render(
      <Hero
        headline="Test Headline"
        subheadline="Test Subheadline"
      />
    );

    // No buttons should be rendered
    const links = container.querySelectorAll('a');
    expect(links.length).toBe(0);
  });

  it('applies correct variant classes', () => {
    const { container: defaultContainer } = render(
      <Hero
        headline="Default"
        subheadline="Default variant"
        variant="default"
      />
    );

    const { container: gradientContainer } = render(
      <Hero
        headline="Gradient"
        subheadline="Gradient variant"
        variant="gradient"
      />
    );

    const { container: minimalContainer } = render(
      <Hero
        headline="Minimal"
        subheadline="Minimal variant"
        variant="minimal"
      />
    );

    // Check variants apply different background classes
    const defaultSection = defaultContainer.querySelector('section');
    const gradientSection = gradientContainer.querySelector('section');
    const minimalSection = minimalContainer.querySelector('section');

    expect(defaultSection).toHaveClass('bg-background');
    expect(gradientSection?.className).toMatch(/bg-gradient/);
    expect(minimalSection).toHaveClass('bg-transparent');
  });

  it('uses CSS variables only (no hardcoded colors)', () => {
    const { container } = render(
      <Hero
        headline="Test"
        subheadline="Test"
        primaryCta={{ label: 'Click', href: '#' }}
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
    expect(html).toMatch(/text-primary-foreground/);
  });
});
