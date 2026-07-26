# StatLab Design System

## Overview

StatLab is a LeetCode-style practice environment for statistical computing in
R and Python. The visual language is "field-notebook editorial": warm paper
surfaces, dense confident ink, a deep evergreen primary drawn from R's
statistical heritage, and a burnt amber accent for Python. No purple
gradients, no Inter/Roboto/Arial, no glassmorphism. Type is set in Fraunces
(display serif) for headlines and Space Grotesk for UI labels, with IBM Plex
Mono carrying all code. Density is high but breathable; motion is quick and
restrained (≤200ms, ease-out only).

```yaml
name: StatLab
description: Editorial practice environment for statistical computing in R and Python.
version: 1.0.0
```

## Colors

```yaml
colors:
  primary: "#1F6E54"      # evergreen — R track, primary actions
  secondary: "#A8490B"    # burnt amber — Python track, highlights
  tertiary: "#39547E"     # slate blue — SQL and info accents
  neutral: "#F6F3EC"      # warm paper background
  surface: "#FDFBF6"      # raised card surface
  on-surface: "#1C1B18"   # near-black warm ink
  on-surface-muted: "#6E6A60"  # secondary ink
  border: "#E3DED2"       # hairline rules
  error: "#B3402F"        # incorrect answers
  success: "#1F6E54"      # correct answers (shares primary hue)
  code-bg: "#20241F"      # dark editor well
  code-fg: "#E8E6DD"      # editor text
```

## Typography

```yaml
typography:
  headline-display:
    fontFamily: Fraunces
    fontSize: 44px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline-lg:
    fontFamily: Fraunces
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.25
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Space Grotesk
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.1em"
  code-md:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.65
```

## Layout

```yaml
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
layout:
  max-width: 1120px
  gutter: 24px
  card-padding: 24px
```

## Elevation & Depth

```yaml
elevation:
  none: none
  raised: "0 1px 2px rgba(28, 27, 24, 0.06), 0 2px 8px rgba(28, 27, 24, 0.05)"
  overlay: "0 4px 12px rgba(28, 27, 24, 0.10), 0 12px 32px rgba(28, 27, 24, 0.12)"
```

Depth comes primarily from hairline borders on paper, not heavy shadows.
Shadows are reserved for the two levels above; never stack more.

## Shapes

```yaml
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 14px
  full: 999px
```

## Components

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 12px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 12px
  chip-language-r:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 6px
  chip-language-python:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 6px
  card-question:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 24px
  code-editor:
    backgroundColor: "{colors.code-bg}"
    textColor: "{colors.code-fg}"
    typography: "{typography.code-md}"
    rounded: "{rounded.md}"
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
  banner-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.surface}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 12px
```

## Do's and Don'ts

- **Do** use Fraunces only for page-level headlines; everything interactive is Space Grotesk.
- **Do** put all code — prompts, answers, solutions — in IBM Plex Mono on the dark `code-bg` well.
- **Do** color-code languages consistently: evergreen = R, amber = Python, slate = SQL.
- **Do** keep motion under 200ms with ease-out; animate opacity and transform only.
- **Don't** use Inter, Roboto, Arial, or system-ui as a primary face.
- **Don't** use purple gradients, glassmorphism, or neon glows anywhere.
- **Don't** rely on color alone for correct/incorrect states — pair with icons and text.
- **Don't** exceed two elevation levels; prefer hairline borders on paper.
