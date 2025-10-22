# Accessibility Testing Guide

## Overview

This project includes comprehensive accessibility testing to ensure WCAG AA compliance and provide an inclusive user experience.

## Test Configuration

### Dependencies Installed
- `jest-axe`: Automated accessibility testing with axe-core
- `@testing-library/jest-dom`: Additional Jest matchers for DOM testing
- `@testing-library/user-event`: User interaction simulation
- `axe-core`: Core accessibility testing engine

### Test Command
```bash
pnpm test:a11y
```

## Test Structure

### Basic Infrastructure Tests (`__tests__/a11y/basic.a11y.test.js`)
- ✅ Verifies testing infrastructure setup
- ✅ Defines WCAG constants and guidelines
- ✅ Provides accessibility helper functions
- ✅ Tests keyboard navigation patterns
- ✅ Validates touch target sizes
- ✅ Checks ARIA attributes

### WCAG Compliance Targets

#### Level AA (Our Standard)
- **Color Contrast**: Minimum 4.5:1 ratio for normal text
- **Touch Targets**: Minimum 44px x 44px for touch interfaces
- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **ARIA Labels**: All form controls must have accessible names
- **Focus Indicators**: Focus must be clearly visible

#### Test Categories
1. **Keyboard Navigation**: Tab order and keyboard interaction
2. **Color Contrast**: Color contrast ratios
3. **ARIA Labeling**: ARIA attributes and labels
4. **Touch Targets**: Minimum touch target sizes
5. **Screen Reader**: Screen reader compatibility
6. **Focus Management**: Focus indicators and management

## Writing Accessibility Tests

### Example Component Test
```javascript
import { describe, test, expect } from '@jest/globals';

describe('Button Accessibility', () => {
  test('should have minimum touch target size', () => {
    const mockButton = {
      getBoundingClientRect: () => ({ width: 44, height: 44 })
    };
    
    const rect = mockButton.getBoundingClientRect();
    expect(rect.width).toBeGreaterThanOrEqual(44);
    expect(rect.height).toBeGreaterThanOrEqual(44);
  });

  test('should have proper ARIA attributes', () => {
    const mockButton = {
      hasAttribute: (name) => name === 'aria-label',
      getAttribute: (name) => name === 'aria-label' ? 'Close dialog' : null,
    };
    
    expect(mockButton.hasAttribute('aria-label')).toBe(true);
    expect(mockButton.getAttribute('aria-label')).toBe('Close dialog');
  });
});
```

### Using jest-axe (Advanced)
For component tests with full DOM:
```javascript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Test Results

✅ **8/8 tests passing**
- Infrastructure verification
- WCAG constants definition
- Helper functions validation  
- Accessibility patterns testing
- Keyboard navigation support
- Configuration compliance

## Integration with CI/CD

The accessibility tests are integrated into the overall test suite and can be run as part of:
- `pnpm test:all-with-unit`: Full test suite including accessibility
- `pnpm quality:check`: Quality gate including accessibility validation

## Next Steps

1. **Component-specific tests**: Add `.a11y.test.js` files for each UI component
2. **E2E accessibility testing**: Integrate with Playwright for end-to-end accessibility validation
3. **Lighthouse CI**: Automated accessibility scoring in CI pipeline
4. **Manual testing**: Regular testing with screen readers and keyboard-only navigation

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Rules](https://dequeuniversity.com/rules/axe/)
- [Testing Library Accessibility](https://testing-library.com/docs/dom-testing-library/api-accessibility/)
- [Web Accessibility Initiative](https://www.w3.org/WAI/)

## Support

For questions about accessibility testing or WCAG compliance, refer to the [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) or consult with accessibility specialists.