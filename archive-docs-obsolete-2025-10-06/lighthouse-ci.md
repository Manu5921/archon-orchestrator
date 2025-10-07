# Lighthouse CI Integration

## Overview

The project now includes comprehensive Lighthouse CI integration for automated performance, accessibility, and SEO testing. This ensures consistent quality metrics across the development lifecycle.

## Configuration

### Dependencies
- `@lhci/cli ^0.15.1`: Lighthouse CI command-line interface
- `lighthouse ^12.8.2`: Core Lighthouse testing engine

### Configuration File
Location: `lighthouserc.cjs`

```javascript
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/lighthouse-test.html',
      ],
      startServerCommand: 'npm run start',
      numberOfRuns: 3, // For reliable averages
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['warn', { minScore: 0.90 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        // Core Web Vitals thresholds
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
      },
    },
  },
};
```

## Available Scripts

### Main Commands
```bash
pnpm lighthouse          # Full Lighthouse CI pipeline (collect + assert + upload)
pnpm lighthouse:collect  # Collect performance data only
pnpm lighthouse:assert   # Run assertions against collected data
pnpm lighthouse:upload   # Upload reports to temporary storage
```

### Test Server
```bash
pnpm start              # Starts Lighthouse test server on port 3000
```

## Test Results (Current Status)

### ✅ Working Components
- **Performance Testing**: ✅ Automated collection and analysis
- **SEO Analysis**: ✅ Meta tags, structured data validation
- **Best Practices**: ✅ Security, modern web standards
- **Core Web Vitals**: ✅ LCP, CLS, FCP monitoring
- **Report Generation**: ✅ Automatic report uploads to Google Cloud Storage

### ⚠️ Known Issues (Tracked)
- **Color Contrast**: Some elements need contrast ratio improvements
  - Current: Failing contrast checks
  - Target: WCAG AA compliance (4.5:1 ratio)
  - Status: Non-blocking warnings

### 📊 Current Scores
- **Performance**: Target ≥80% ✅
- **Accessibility**: Target ≥90% ⚠️ (Currently ~91%)
- **Best Practices**: Target ≥90% ✅
- **SEO**: Target ≥80% ✅

## Test Pages

### 1. Main Application (`/`)
- Dynamic HTML landing page
- System status indicators
- API endpoint links
- Responsive design

### 2. Lighthouse Test Page (`/lighthouse-test.html`)
- Static HTML page optimized for testing
- WCAG compliance demonstrations
- Form accessibility examples
- Performance optimization showcase

## Integration with CI/CD

### Current Setup
- Manual execution via `pnpm lighthouse`
- Results uploaded to temporary public storage
- Reports available via Google Cloud Storage URLs

### Future Integration Options
```bash
# Example CI pipeline integration
- name: Run Lighthouse CI
  run: |
    npm install
    npm run lighthouse
    # Reports automatically uploaded and accessible via URLs
```

### GitHub Actions Example
```yaml
- name: Lighthouse CI
  run: |
    pnpm install
    pnpm lighthouse
  env:
    LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

## Performance Monitoring

### Core Web Vitals Tracking
- **First Contentful Paint (FCP)**: Target ≤2s
- **Largest Contentful Paint (LCP)**: Target ≤4s
- **Cumulative Layout Shift (CLS)**: Target ≤0.1
- **Total Blocking Time (TBT)**: Target ≤300ms

### Accessibility Monitoring
- **Color Contrast**: WCAG AA compliance
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: Proper ARIA labeling
- **Touch Targets**: Minimum 44px touch areas

## Report Access

### Temporary Storage
Reports are automatically uploaded to Google Cloud Storage:
```bash
# Example report URLs (generated after each run)
https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/[timestamp]-[id].report.html
```

### Local Reports
```bash
# Generate and view local HTML reports
pnpm lighthouse:collect
open .lighthouseci/*.html
```

## Development Workflow

### 1. Pre-commit Testing
```bash
# Quick performance check before committing
pnpm lighthouse:collect
pnpm lighthouse:assert
```

### 2. Feature Development
```bash
# Test specific page during development
pnpm start  # Start test server
# In another terminal:
pnpm lighthouse:collect
```

### 3. Production Readiness
```bash
# Full quality gate
pnpm lighthouse  # Complete pipeline with upload
```

## Quality Thresholds

### Performance Budgets
- **JavaScript Bundle**: Monitored via best practices
- **Image Optimization**: Automated detection
- **Caching Strategy**: HTTP cache headers validation
- **HTTP/2**: Modern protocol usage

### Accessibility Standards
- **WCAG AA**: Target compliance level
- **Keyboard Navigation**: 100% interactive elements
- **Screen Reader**: Full compatibility
- **Color Contrast**: 4.5:1 minimum ratio

## Troubleshooting

### Common Issues

#### 1. Server Not Starting
```bash
# Check if port 3000 is available
lsof -i :3000
# Kill conflicting processes if needed
```

#### 2. Color Contrast Failures
```css
/* Ensure sufficient contrast ratios */
color: #1a252f;  /* Dark text on light background */
background: #ffffff;
/* Contrast ratio should be ≥4.5:1 */
```

#### 3. Performance Issues
- Optimize images (use WebP, proper sizing)
- Minimize JavaScript bundles
- Enable gzip compression
- Implement proper caching headers

## Next Steps

### Immediate Improvements
1. **Fix Color Contrast**: Update CSS to meet WCAG AA standards
2. **Add More Test Pages**: Cover different application routes
3. **Mobile Optimization**: Specific mobile performance testing

### Long-term Enhancements
1. **CI Integration**: Automated testing on pull requests
2. **Performance Budgets**: Strict performance thresholds
3. **Historical Tracking**: Long-term performance trend analysis
4. **Custom Metrics**: Application-specific performance indicators

## Resources

- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Accessibility Testing Guide](https://web.dev/accessibility/)
- [Performance Best Practices](https://web.dev/performance/)

## Support

For questions about Lighthouse CI configuration or performance optimization:
1. Check the `lighthouserc.cjs` configuration
2. Review generated reports for specific recommendations
3. Consult Web.dev performance guides
4. Use Chrome DevTools for local debugging