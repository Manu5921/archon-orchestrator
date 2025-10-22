import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CTA } from '../../components/marketing/CTA';

describe('CTA Component', () => {
  it('renders headline and button', () => {
    render(
      <CTA
        headline="Ready to get started?"
        button={{ label: 'Sign Up Now', href: '/signup' }}
      />
    );

    expect(screen.getByText('Ready to get started?')).toBeInTheDocument();
    expect(screen.getByText('Sign Up Now')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <CTA
        headline="Get Started"
        description="Start building today"
        button={{ label: 'Sign Up', href: '/signup' }}
      />
    );

    expect(screen.getByText('Start building today')).toBeInTheDocument();
  });

  it('renders button with correct href', () => {
    render(
      <CTA
        headline="Test CTA"
        button={{ label: 'Click Here', href: '/test-link' }}
      />
    );

    const buttonLink = screen.getByText('Click Here');
    expect(buttonLink).toBeInTheDocument();
    expect(buttonLink).toHaveAttribute('href', '/test-link');
  });

  it('renders without description when not provided', () => {
    const { container } = render(
      <CTA
        headline="Headline Only"
        button={{ label: 'Button', href: '#' }}
      />
    );

    // Headline should exist
    expect(screen.getByText('Headline Only')).toBeInTheDocument();

    // No description paragraph should be rendered
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).toBe(0);
  });

  it('applies correct variant classes', () => {
    const { container: defaultContainer } = render(
      <CTA
        headline="Default"
        button={{ label: 'Button', href: '#' }}
        variant="default"
      />
    );

    const { container: gradientContainer } = render(
      <CTA
        headline="Gradient"
        button={{ label: 'Button', href: '#' }}
        variant="gradient"
      />
    );

    const { container: borderedContainer } = render(
      <CTA
        headline="Bordered"
        button={{ label: 'Button', href: '#' }}
        variant="bordered"
      />
    );

    // Check each variant applies different styles
    const defaultDiv = defaultContainer.querySelector('div > div');
    const gradientDiv = gradientContainer.querySelector('div > div');
    const borderedDiv = borderedContainer.querySelector('div > div');

    expect(defaultDiv?.className).toMatch(/bg-muted/);
    expect(gradientDiv?.className).toMatch(/bg-gradient/);
    expect(borderedDiv?.className).toMatch(/border-2/);
  });

  it('applies white text on gradient variant', () => {
    render(
      <CTA
        headline="Gradient CTA"
        description="White text on gradient"
        button={{ label: 'Click', href: '#' }}
        variant="gradient"
      />
    );

    const headline = screen.getByText('Gradient CTA');
    expect(headline).toHaveClass('text-white');
  });

  it('applies foreground text on default variant', () => {
    render(
      <CTA
        headline="Default CTA"
        button={{ label: 'Click', href: '#' }}
        variant="default"
      />
    );

    const headline = screen.getByText('Default CTA');
    expect(headline).toHaveClass('text-foreground');
  });

  it('button styles adapt to variant', () => {
    const { container: gradientContainer } = render(
      <CTA
        headline="Test"
        button={{ label: 'Gradient Button', href: '#' }}
        variant="gradient"
      />
    );

    const { container: defaultContainer } = render(
      <CTA
        headline="Test"
        button={{ label: 'Default Button', href: '#' }}
        variant="default"
      />
    );

    const gradientButton = screen.getByText('Gradient Button');
    const defaultButton = screen.getByText('Default Button');

    // Gradient variant: white button
    expect(gradientButton).toHaveClass('bg-white');

    // Default variant: primary button
    expect(defaultButton).toHaveClass('bg-primary');
  });

  it('uses CSS variables only (no hardcoded colors)', () => {
    const { container } = render(
      <CTA
        headline="Test CTA"
        description="Test description"
        button={{ label: 'Button', href: '#' }}
      />
    );

    const html = container.innerHTML;

    // Should NOT contain hardcoded Tailwind color classes (except white for gradient variant)
    expect(html).not.toMatch(/text-gray-\d+/);
    expect(html).not.toMatch(/bg-blue-\d+/);
    expect(html).not.toMatch(/text-orange-\d+/);

    // Should contain CSS variable classes
    expect(html).toMatch(/text-foreground/);
    expect(html).toMatch(/text-muted-foreground/);
    expect(html).toMatch(/bg-primary/);
  });

  it('renders decorative SVG only on gradient variant', () => {
    const { container: gradientContainer } = render(
      <CTA
        headline="Gradient"
        button={{ label: 'Button', href: '#' }}
        variant="gradient"
      />
    );

    const { container: defaultContainer } = render(
      <CTA
        headline="Default"
        button={{ label: 'Button', href: '#' }}
        variant="default"
      />
    );

    const gradientSVG = gradientContainer.querySelector('svg');
    const defaultSVG = defaultContainer.querySelector('svg');

    expect(gradientSVG).toBeInTheDocument();
    expect(defaultSVG).not.toBeInTheDocument();
  });
});
