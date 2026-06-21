---
name: Cinematic AI Automator
colors:
  surface: '#111318'
  surface-dim: '#111318'
  surface-bright: '#37393e'
  surface-container-lowest: '#0c0e13'
  surface-container-low: '#1a1c20'
  surface-container: '#1e2024'
  surface-container-high: '#282a2f'
  surface-container-highest: '#33353a'
  on-surface: '#e2e2e8'
  on-surface-variant: '#c3c6d2'
  inverse-surface: '#e2e2e8'
  inverse-on-surface: '#2f3035'
  outline: '#8d909c'
  outline-variant: '#434751'
  surface-tint: '#aac7ff'
  primary: '#b8d0ff'
  on-primary: '#002f65'
  primary-container: '#8ab4ff'
  on-primary-container: '#0a4488'
  inverse-primary: '#305ea3'
  secondary: '#4ddcc6'
  on-secondary: '#003730'
  secondary-container: '#00b4a0'
  on-secondary-container: '#003f37'
  tertiary: '#fcc757'
  on-tertiary: '#402d00'
  tertiary-container: '#deac3e'
  on-tertiary-container: '#5b4100'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d7e3ff'
  primary-fixed-dim: '#aac7ff'
  on-primary-fixed: '#001b3e'
  on-primary-fixed-variant: '#0d4689'
  secondary-fixed: '#6ef9e2'
  secondary-fixed-dim: '#4ddcc6'
  on-secondary-fixed: '#00201b'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#ffdea2'
  tertiary-fixed-dim: '#f3bf4f'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#5c4200'
  background: '#111318'
  on-background: '#e2e2e8'
  surface-variant: '#33353a'
typography:
  display-lg:
    fontFamily: Instrument Serif
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
  display-lg-mobile:
    fontFamily: Instrument Serif
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.1'
  headline-md:
    fontFamily: Instrument Serif
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Instrument Serif
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.15em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-x: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 80px
---

## Brand & Style
The design system embodies a cinematic, high-end SaaS aesthetic tailored for cutting-edge AI Marketing Automation. It targets a professional audience that values technical sophistication and futuristic precision. The interface should evoke a sense of calm power and effortless intelligence through a blend of **Minimalism** and **Glassmorphism**.

Key stylistic pillars include:
- **Atmospheric Depth:** Large, blurred gradient-mesh blobs in the background provide organic movement.
- **Precision Engineering:** Ultra-thin 1px strokes and sharp alignment contrast with soft glows.
- **Dynamic Interaction:** Elements utilize tilt-on-hover effects to create a sense of physical weight and volume.
- **Living UI:** Pulsing status indicators and a custom cursor provide constant, subtle feedback that the "AI" is active.

## Colors
The palette is centered on a deep, obsidian foundation to allow the high-frequency accents to pop.

- **Foundations:** Use `#0f1217` for global backgrounds. Use `#131a22` for standard surfaces and `#1a2230` for elevated states or nested containers.
- **Accents:** The primary electric blue (`#8ab4ff`) and secondary cyan (`#5eead4`) should be used sparingly for high-intent actions and critical status updates.
- **Hierarchy:** Text follows a strict hierarchy where headings use the bright `#ece9ee` and body copy recedes into the background with `#9aa7b5`.
- **Gradients:** Use the 135-degree gradient for primary buttons, progress bars, and high-impact visual flourishes.

## Typography
This design system utilizes a high-contrast typographic pairing to bridge the gap between editorial luxury and technical utility.

- **Headlines:** Always set in *Instrument Serif Italic*. This adds a bespoke, sophisticated layer to the UI, making it feel more like a premium tool than a standard utility.
- **Body & Controls:** Inter provides a clean, systematic foundation. 
- **Labels:** Use the `label-caps` style for section headers and small metadata. The wide tracking (0.15em) is essential for maintaining the "tech-noir" aesthetic.
- **Scaling:** On mobile, significantly reduce the size of display fonts while maintaining the italicized serif personality to ensure legibility and impact.

## Layout & Spacing
The layout relies on a **Fluid Grid** model with generous white space to allow the volumetric glows and mesh backgrounds to breathe.

- **Grid:** Use a 12-column grid for desktop with 24px gutters. Content should be centered within a 1280px max-width container.
- **Rhythm:** Spacing follows an 8px base unit. Use `section-gap` (80px) to separate major content blocks to maintain the minimalist aesthetic.
- **Mobile:** Transition to a 4-column grid with 16px margins. Stack elements vertically and reduce padding within cards to maximize screen real estate.

## Elevation & Depth
Depth is achieved through layering and light simulation rather than traditional drop shadows.

- **Glassmorphism:** Surface containers must have a `backdrop-filter: blur(12px)` and a subtle background transparency (e.g., `rgba(19, 26, 34, 0.8)`).
- **Volumetric Glow:** High-priority cards should have an inner `box-shadow: inset 0 1px 1px rgba(255,255,255,0.05)` and a subtle external glow that matches the primary accent color at 5-10% opacity.
- **Strokes:** All elevated elements require a 1px border using the defined border color. This creates a "machined" look that feels precise and high-end.
- **Z-Axis:** Use the custom cursor as the highest layer, with modal overlays and tooltips sitting directly beneath it.

## Shapes
The shape language is sophisticated and controlled. By utilizing a "Soft" (0.25rem) base roundedness, the UI maintains a professional, slightly technical edge while avoiding the harshness of sharp corners.

- **Base Radius:** 4px (0.25rem) for inputs and small buttons.
- **Large Radius:** 12px (0.75rem) for main dashboard cards and modals to soften the overall composition.
- **Interactive Elements:** Use the base radius to maintain a consistent "chip" or "module" feel throughout the automation workflows.

## Components
- **Buttons:** Primary buttons use the accent gradient with white text. Secondary buttons are ghost-style with a 1px stroke and a subtle hover glow.
- **Cards:** Implement a 3D tilt effect on hover (max 5 degrees) with an increase in border opacity to 0.5.
- **Input Fields:** Darker than the surface (`#0b0d11`), with a 1px stroke that glows electric blue on focus. Use Inter for input text.
- **Status Dots:** Use a circular element with a `ping` animation (2s duration) for "Active AI" or "Live Syncing" states.
- **Custom Cursor:** A small, 8px solid dot with a 32px lagging ring. The ring should change color from primary blue to cyan depending on the section.
- **Chips:** Small, uppercase labels with a subtle background tint and 1px border; used for categorizing AI models or data streams.
- **Lists:** Clean rows separated by 1px borders, featuring a hover state that slightly brightens the background surface.