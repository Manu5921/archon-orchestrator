# Design Brief - AI-Generated Design System

**Date:** YYYY-MM-DD
**Framework:** [Next.js / Astro / PHP]
**Version:** v1

---

## 🎯 PROJECT CONTEXT

**Product Name:** [Your Product Name]
**Type:** [SaaS B2B / Landing Page / E-commerce / Agency Portfolio]
**Industry:** [Ad Tech / FinTech / Health / Agency / etc.]

**Brief Description:**
[2-3 sentences describing what the product does and its unique value proposition]

---

## 👥 TARGET AUDIENCE

**Primary Persona:**
- **Role:** [CMO, CTO, Product Manager, Small Business Owner, etc.]
- **Age Range:** [25-45 / 30-50 / etc.]
- **Tech Savviness:** [High / Medium / Low]
- **Budget Range:** [$X-Y or Free/Freemium]

**Psychographics:**
- Values: [Innovation, Reliability, Speed, Simplicity, etc.]
- Pain Points: [What problems do they face?]
- Goals: [What are they trying to achieve?]

**Emotion to Convey:**
(Check all that apply)
- [ ] Trust & Reliability
- [ ] Innovation & Cutting-Edge
- [ ] Premium & Luxury
- [ ] Friendly & Approachable
- [ ] Professional & Corporate
- [ ] Creative & Bold
- [ ] Minimalist & Clean
- [ ] Fun & Playful

---

## 🎨 DESIGN REFERENCES

**Direct Competitors / Industry Leaders:**
1. **[Linear.app](https://linear.app)** - Minimal, épuré, micro-interactions subtiles
2. **[Stripe.com](https://stripe.com)** - Professional, trust, blue palette, clean
3. **[Vercel.com](https://vercel.com)** - Modern, black/white, geometric grids

**Cross-Industry Inspiration:**
1. **[Apple.com](https://apple.com)** - White space mastery, bold typography
2. **[Figma.com](https://figma.com)** - Color accents, friendly illustrations

**What I Like From Each:**
- Linear: [Specific element, e.g., "subtle shadows", "smooth animations"]
- Stripe: [Specific element, e.g., "color palette", "spacing rhythm"]
- Vercel: [Specific element, e.g., "dark mode", "grid system"]

---

## 🚫 ANTI-REFERENCES (What NOT to Do)

**Avoid These Styles:**
- ❌ Generic corporate blue (too boring, overused)
- ❌ Neon/saturated colors (too "2020 startup")
- ❌ Heavy shadows/gradients (outdated, 2015 style)
- ❌ Comic Sans / unprofessional fonts
- ❌ Cluttered layouts / too much information

**Specific Examples to Avoid:**
- [Company/Site Name]: [Why? e.g., "too generic", "poor contrast"]

---

## 📐 TECHNICAL CONSTRAINTS

**Accessibility:**
- WCAG Level: [ ] AA (minimum) [ ] AAA (recommended)
- Color Contrast Ratio: [ ] 4.5:1 (AA) [ ] 7:1 (AAA)

**Responsive Design:**
- [ ] Mobile-First (design for mobile, then desktop)
- [ ] Desktop-First (design for desktop, then mobile)
- Breakpoints: [ ] Standard (sm:640, md:768, lg:1024, xl:1280)

**Dark Mode:**
- [ ] Required (must have dark mode)
- [ ] Optional (nice to have, but not critical)
- [ ] Not Needed (light mode only)

**Animation & Interactivity:**
- [ ] Subtle (hover states, fade-in only)
- [ ] Medium (page transitions, scroll animations)
- [ ] Heavy (parallax, complex animations)

**Performance Targets:**
- Lighthouse Score: [ ] 90+ [ ] 95+ [ ] 100
- LCP (Largest Contentful Paint): [ ] <2.5s [ ] <1.5s [ ] <1.0s
- JavaScript Bundle: [ ] Minimize [ ] Zero JS (if Astro static)

---

## 🎨 BRAND GUIDELINES (If Existing)

**Logo:**
- [ ] Existing logo (locked colors/fonts)
- [ ] New logo needed
- Colors in logo: [#HEX1, #HEX2, etc.]

**Typography (if required):**
- Primary Font: [Inter / Outfit / Space Grotesk / Custom / None]
- Secondary Font: [If different from primary]
- Font Weights Needed: [400, 500, 600, 700, 800]

**Brand Colors (if locked):**
- Primary: [#HEX]
- Secondary: [#HEX]
- Accent: [#HEX]
- [Leave empty if AI should generate]

**Brand Voice/Tone:**
- [ ] Professional & Formal
- [ ] Casual & Friendly
- [ ] Technical & Precise
- [ ] Creative & Expressive

---

## 🎯 DESIRED AI OUTPUT

**I want the AI to generate:**

**Number of Design Directions:**
- [ ] 3 variants (recommended - fast exploration)
- [ ] 5 variants (more options, longer generation)

**For Each Direction, Include:**
- ✅ Color Palette (primary, secondary, neutral, semantic)
- ✅ Typography System (heading, body, mono fonts)
- ✅ Spacing Scale (4px or 8px base)
- ✅ Border Radius Scale (sharp, rounded, pill options)
- ✅ Shadow Scale (flat, subtle, pronounced)
- ✅ Design Philosophy Summary (2-3 sentences)

**Output Format:**
- [ ] Next.js: `design-tokens.json` (Tailwind CSS variables)
- [ ] Astro: `design-tokens.css` (CSS custom properties)
- [ ] PHP: `design-tokens.scss` (SCSS variables)

---

## 📝 ADDITIONAL NOTES & SPECIFIC REQUESTS

**Special Requirements:**
[Any unique constraints, features, or elements that must be considered]

**Components Priority:**
(Which components are most important for the design system?)
- [ ] Hero Section (landing page)
- [ ] Navigation/Header
- [ ] Buttons (CTA primary, secondary, tertiary)
- [ ] Forms (input, textarea, select, checkbox, radio)
- [ ] Cards (content containers)
- [ ] Pricing Tables
- [ ] Testimonials
- [ ] Footer

**Inspiration Keywords:**
[List 5-10 adjectives that describe the desired aesthetic]
Examples: Modern, Bold, Minimalist, Trustworthy, Innovative, Premium, Accessible, Friendly

---

## 🔄 REVISION HISTORY

**v1 - YYYY-MM-DD:**
- Initial brief created

**v2 - YYYY-MM-DD (if applicable):**
- [Changes made after first AI generation]

---

## 📊 SUCCESS METRICS

**How will I know the design is successful?**
- [ ] Conversion rate improvement (if measurable)
- [ ] User feedback positive (qualitative)
- [ ] Passes WCAG AA/AAA (accessibility)
- [ ] Lighthouse 95+ score (performance)
- [ ] Client/stakeholder approval
- [ ] Personal "gut feeling" ✨

---

## 🤖 AI GENERATION INSTRUCTIONS

**For AI (Gemini/Claude) Reading This Brief:**

1. **Read Carefully:**
   - Understand target audience psychographics
   - Note all checked constraints (WCAG, dark mode, etc.)
   - Respect brand guidelines if provided

2. **Generate [3/5] Directions:**
   - Each with distinct visual identity
   - All meeting technical constraints
   - All WCAG compliant (minimum AA)

3. **Output Format:**
   - Valid JSON/CSS syntax
   - Mathematical spacing (4px or 8px multiples)
   - Semantic color names (primary, secondary, success, warning, error)
   - Complete typography scale (xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl)

4. **Documentation:**
   - Include design philosophy (2-3 sentences per direction)
   - Explain color choices (psychology, target audience fit)
   - List key differentiators between variants

5. **Validation:**
   - Self-check contrast ratios (WCAG)
   - Verify font pairing harmony
   - Ensure spacing scale is consistent

---

**Template Version:** 1.0.0
**Last Updated:** 2025-11-21
**Author:** Archon Orchestrator
**License:** MIT (use freely in your projects)
