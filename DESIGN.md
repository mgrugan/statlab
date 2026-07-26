# StatCode Design System (StatLab)

## Overview

StatLab now follows the **StatCode** design system generated in Stitch
(see `design/stitch/design-system.md` for the source spec). The philosophy is
"Professional/Anti-Slop": high information density without clutter — academic,
precise, authoritative, built for deep focus. Modern minimalism with a
technical/corporate edge: strict grid alignment, refined typography, purposeful
color. Deep Slate Blue carries structure, Intelligence Blue carries interaction
(echoing IDE syntax highlighting), and Crisp Emerald is reserved strictly for
success states. Depth comes from tonal layers and 1px outlines, not shadows.
Inter handles UI copy; JetBrains Mono carries code, terminal output, and
metadata labels. Language coding follows the Stitch mocks: blue = R,
emerald = Python, slate = SQL.

```yaml
name: StatCode
description: Professional anti-slop learning environment for statistical computing in R and Python.
version: 2.0.0
```

## Colors

```yaml
colors:
  primary: "#1E293B"        # deep slate blue — structure, nav, primary buttons
  secondary: "#0058BE"      # intelligence blue — interactive, links, R track
  tertiary: "#00A472"       # crisp emerald — success states, Python track
  neutral: "#F8F9FF"        # page background
  surface: "#FFFFFF"        # level-1 card surface
  on-surface: "#0B1C30"     # primary ink
  on-surface-muted: "#64748B"  # secondary ink (slate 500)
  border: "#E2E8F0"         # low-contrast outline
  error: "#BA1A1A"          # incorrect answers
  code-bg: "#0F172A"        # deep slate code context
  code-fg: "#E2E8F0"        # code text on dark
  blue-tint: "#EFF4FF"      # tonal container / hover layer
  emerald-tint: "#D9F6EA"   # success badge background
  emerald-deep: "#005236"   # emerald text on tinted backgrounds (AA-safe)
```

## Typography

```yaml
typography:
  headline-display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.17
    letterSpacing: "-0.02em"
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  body-lg:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.04em"
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.08em"
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.57
```

## Layout

```yaml
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
layout:
  max-width: 1280px
  gutter: 24px
  sidebar-width: 224px
```

12-column fixed grid on desktop (max 1280px, 24px gutters, 48px margins);
fluid on mobile. Strict 4px/8px baseline rhythm; 24px container padding keeps
density high. Code editors maximize vertical space with sticky side-by-side
layouts on wide viewports.

## Elevation & Depth

```yaml
elevation:
  none: none
  overlay: "0px 4px 12px rgba(0, 0, 0, 0.05)"
```

Tonal layers and low-contrast outlines, not shadows. Level 0: background.
Level 1: white card + 1px `#E2E8F0` border, no shadow. Level 2 (dropdowns,
modals): white + border + the single subtle overlay shadow. Hover states shift
background tone (slate 50 → 100), never elevation.

## Shapes

```yaml
rounded:
  sm: 2px
  md: 4px
  lg: 8px
  xl: 12px
  full: 999px
```

Soft but disciplined: 4px on buttons and inputs, 8px on module cards and code
frames. Progress bars and badges slightly rounded — never fully pill-shaped.

## Components

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 10px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 10px
  chip-language-r:
    backgroundColor: "{colors.blue-tint}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: 4px
  chip-language-python:
    backgroundColor: "{colors.emerald-tint}"
    textColor: "{colors.emerald-deep}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: 4px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 24px
  code-editor:
    backgroundColor: "{colors.code-bg}"
    textColor: "{colors.code-fg}"
    typography: "{typography.code-md}"
    rounded: "{rounded.lg}"
    padding: 16px
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
  meta-text:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body-sm}"
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  progress-bar:
    backgroundColor: "{colors.secondary}"
    height: 4px
    rounded: "{rounded.sm}"
  badge-success:
    backgroundColor: "{colors.emerald-tint}"
    textColor: "{colors.emerald-deep}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: 4px
  banner-error:
    backgroundColor: "{colors.error}"
    textColor: "{colors.surface}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 12px
```

## Do's and Don'ts

- **Do** keep information density high — 24px container padding, tight headline line-heights, 1.5x+ body line-height.
- **Do** reserve Crisp Emerald strictly for success/completion; Intelligence Blue for interactive states.
- **Do** give code frames an IDE-style header bar (filename in label-sm, subtle Copy affordance) on a background distinct from the page.
- **Do** use JetBrains Mono for all code, terminal output, and metadata labels.
- **Do** use 4px-tall linear progress bars — blue in progress, emerald complete.
- **Don't** use gradients, heavy shadows, or glow focus states — 2px Intelligence Blue border on focus, nothing else.
- **Don't** make badges or bars fully pill-shaped; keep the professional rectangular feel.
- **Don't** indicate hover with elevation — shift the background tone instead.
