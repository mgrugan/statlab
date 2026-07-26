<!-- displayName -->
StatCode

## Brand & Style

This design system is built on a "Professional/Anti-Slop" philosophy, prioritizing high information density without visual clutter. The brand personality is academic, precise, and authoritative, designed to foster deep focus for data scientists and developers.

The aesthetic leans into **Modern Minimalism** with a **Technical/Corporate** edge. It avoids unnecessary decorative elements, instead using strict grid alignment, refined typography, and purposeful color application to guide the user through complex logical paths. The emotional response should be one of quiet confidence—the UI acts as a transparent tool for mastery rather than a distraction.

## Layout & Spacing

The design system employs a **12-column Fixed Grid** for desktop (max-width: 1280px) and a **Fluid Grid** for mobile. 

- **Desktop:** 12 columns / 24px gutter / 48px margins.
- **Tablet:** 8 columns / 16px gutter / 24px margins.
- **Mobile:** 4 columns / 16px gutter / 16px margins.

Spacing follows a strict 4px/8px baseline rhythm. Information density should remain high; use `md` (24px) for most container padding to keep the interface feeling tight and professional. Components like code editors should maximize vertical space, often utilizing "sticky" layouts to keep instructions and input side-by-side on wider viewports.

## Elevation & Depth

To maintain a clean, academic look, this design system avoids heavy shadows. Instead, it utilizes **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0 (Background):** Primary background surface.
- **Level 1 (Cards/Sections):** White surface with a 1px border (`#E2E8F0`). No shadow.
- **Level 2 (Dropdowns/Modals):** White surface with a 1px border and a subtle, high-diffusion shadow (0px 4px 12px rgba(0,0,0,0.05)).
- **Interactive States:** Use subtle background color shifts (e.g., Slate 50 to Slate 100) rather than elevation changes to indicate hover states.

## Components

- **Buttons:** Primary buttons use the Deep Slate Blue background with white text. Secondary buttons use a 1px border with Intelligence Blue text. No gradients.
- **Code Editor Frames:** These should feature a "Mac-style" or "IDE-style" header bar containing the filename in `label-sm` and a subtle "Copy" button. The background must be distinct from the main page surface.
- **Progress Indicators:** Use a 4px tall linear bar. Use the Secondary Blue for "In Progress" and the Accent Emerald for "Complete."
- **Stats Badges:** Small, rectangular badges with a light tinted background and dark text (e.g., Emerald 50 background with Emerald 700 text) to denote difficulty levels or earned XP.
- **Input Fields:** Minimalist design with a 1px border. Focus state should use a 2px Intelligence Blue border with no "glow" or outer shadow.
- **Navigation:** A slim left-hand sidebar or a thin top-bar. Use icons with 1.5px stroke weight and paired `label-sm` text. Icons should be functional, not decorative.

<!-- theme -->
{
  "colorMode": "LIGHT",
  "font": "INTER",
  "roundness": "ROUND_FOUR",
  "customColor": "#1e293b",
  "headlineFont": "INTER",
  "bodyFont": "INTER",
  "labelFont": "JETBRAINS_MONO",
  "namedColors": {
    "background": "#f8f9ff",
    "error": "#ba1a1a",
    "error_container": "#ffdad6",
    "inverse_on_surface": "#eaf1ff",
    "inverse_primary": "#bcc7de",
    "inverse_surface": "#213145",
    "on_background": "#0b1c30",
    "on_error": "#ffffff",
    "on_error_container": "#93000a",
    "on_primary": "#ffffff",
    "on_primary_container": "#8590a6",
    "on_primary_fixed": "#111c2d",
    "on_primary_fixed_variant": "#3c475a",
    "on_secondary": "#ffffff",
    "on_secondary_container": "#fefcff",
    "on_secondary_fixed": "#001a42",
    "on_secondary_fixed_variant": "#004395",
    "on_surface": "#0b1c30",
    "on_surface_variant": "#45474c",
    "on_tertiary": "#ffffff",
    "on_tertiary_container": "#00a472",
    "on_tertiary_fixed": "#002113",
    "on_tertiary_fixed_variant": "#005236",
    "outline": "#75777d",
    "outline_variant": "#c5c6cd",
    "primary": "#091426",
    "primary_container": "#1e293b",
    "primary_fixed": "#d8e3fb",
    "primary_fixed_dim": "#bcc7de",
    "secondary": "#0058be",
    "secondary_container": "#2170e4",
    "secondary_fixed": "#d8e2ff",
    "secondary_fixed_dim": "#adc6ff",
    "surface": "#f8f9ff",
    "surface_bright": "#f8f9ff",
    "surface_container": "#e5eeff",
    "surface_container_high": "#dce9ff",
    "surface_container_highest": "#d3e4fe",
    "surface_container_low": "#eff4ff",
    "surface_container_lowest": "#ffffff",
    "surface_dim": "#cbdbf5",
    "surface_tint": "#545f73",
    "surface_variant": "#d3e4fe",
    "tertiary": "#00190e",
    "tertiary_container": "#00301e",
    "tertiary_fixed": "#6ffbbe",
    "tertiary_fixed_dim": "#4edea3"
  },
  "designMd": "---\nname: StatCode\ncolors:\n  surface: '#f8f9ff'\n  surface-dim: '#cbdbf5'\n  surface-bright: '#f8f9ff'\n  surface-container-lowest: '#ffffff'\n  surface-container-low: '#eff4ff'\n  surface-container: '#e5eeff'\n  surface-container-high: '#dce9ff'\n  surface-container-highest: '#d3e4fe'\n  on-surface: '#0b1c30'\n  on-surface-variant: '#45474c'\n  inverse-surface: '#213145'\n  inverse-on-surface: '#eaf1ff'\n  outline: '#75777d'\n  outline-variant: '#c5c6cd'\n  surface-tint: '#545f73'\n  primary: '#091426'\n  on-primary: '#ffffff'\n  primary-container: '#1e293b'\n  on-primary-container: '#8590a6'\n  inverse-primary: '#bcc7de'\n  secondary: '#0058be'\n  on-secondary: '#ffffff'\n  secondary-container: '#2170e4'\n  on-secondary-container: '#fefcff'\n  tertiary: '#00190e'\n  on-tertiary: '#ffffff'\n  tertiary-container: '#00301e'\n  on-tertiary-container: '#00a472'\n  error: '#ba1a1a'\n  on-error: '#ffffff'\n  error-container: '#ffdad6'\n  on-error-container: '#93000a'\n  primary-fixed: '#d8e3fb'\n  primary-fixed-dim: '#bcc7de'\n  on-primary-fixed: '#111c2d'\n  on-primary-fixed-variant: '#3c475a'\n  secondary-fixed: '#d8e2ff'\n  secondary-fixed-dim: '#adc6ff'\n  on-secondary-fixed: '#001a42'\n  on-secondary-fixed-variant: '#004395'\n  tertiary-fixed: '#6ffbbe'\n  tertiary-fixed-dim: '#4edea3'\n  on-tertiary-fixed: '#002113'\n  on-tertiary-fixed-variant: '#005236'\n  background: '#f8f9ff'\n  on-background: '#0b1c30'\n  surface-variant: '#d3e4fe'\ntypography:\n  display-lg:\n    fontFamily: Inter\n    fontSize: 48px\n    fontWeight: '700'\n    lineHeight: 56px\n    letterSpacing: -0.02em\n  headline-lg:\n    fontFamily: Inter\n    fontSize: 32px\n    fontWeight: '600'\n    lineHeight: 40px\n    letterSpacing: -0.01em\n  headline-lg-mobile:\n    fontFamily: Inter\n    fontSize: 24px\n    fontWeight: '600'\n    lineHeight: 32px\n  body-md:\n    fontFamily: Inter\n    fontSize: 16px\n    fontWeight: '400'\n    lineHeight: 24px\n  code-md:\n    fontFamily: JetBrains Mono\n    fontSize: 14px\n    fontWeight: '400'\n    lineHeight: 22px\n  label-sm:\n    fontFamily: JetBrains Mono\n    fontSize: 12px\n    fontWeight: '500'\n    lineHeight: 16px\nrounded:\n  sm: 0.125rem\n  DEFAULT: 0.25rem\n  md: 0.375rem\n  lg: 0.5rem\n  xl: 0.75rem\n  full: 9999px\nspacing:\n  base: 4px\n  xs: 8px\n  sm: 16px\n  md: 24px\n  lg: 40px\n  xl: 64px\n  gutter: 24px\n  margin-mobile: 16px\n  margin-desktop: 48px\n---\n\n## Brand & Style\n\nThis design system is built on a \"Professional/Anti-Slop\" philosophy, prioritizing high information density without visual clutter. The brand personality is academic, precise, and authoritative, designed to foster deep focus for data scientists and developers.\n\nThe aesthetic leans into **Modern Minimalism** with a **Technical/Corporate** edge. It avoids unnecessary decorative elements, instead using strict grid alignment, refined typography, and purposeful color application to guide the user through complex logical paths. The emotional response should be one of quiet confidence\u2014the UI acts as a transparent tool for mastery rather than a distraction.\n\n## Colors\n\nThe color system is grounded in high-contrast logic to ensure maximum readability for technical documentation and code.\n\n- **Primary (Deep Slate Blue):** Used for structural elements, headers, and primary navigation to convey stability and institutional trust.\n- **Secondary (Intelligence Blue):** Used for interactive elements, links, and focused states, mimicking the syntax highlighting environments of R and Python IDEs.\n- **Accent (Crisp Emerald):** Reserved strictly for success states, completion indicators, and \"Correct\" feedback loops.\n- **Neutral (High-Contrast Grays):** A curated ramp of grays designed to differentiate background surfaces, borders, and secondary text without muddying the UI.\n\n**Code Backgrounds:** Use a specific off-white (`#F8FAFC`) or deep slate (`#0F172A`) depending on the code block context to maintain a AAA accessibility rating.\n\n## Typography\n\nThe typographic system uses a dual-font approach. **Inter** handles all UI and instructional copy, providing a neutral and highly legible foundation. **JetBrains Mono** is utilized for code blocks, terminal outputs, and metadata labels to reinforce the technical nature of the content.\n\nMaintain tight line heights for headlines to keep the \"Anti-Slop\" compact feel, but provide generous line-height (1.5x+) for body text to ensure readability during long-form technical explanations. Letter spacing should be slightly tightened on larger display headers.\n\n## Layout & Spacing\n\nThe design system employs a **12-column Fixed Grid** for desktop (max-width: 1280px) and a **Fluid Grid** for mobile. \n\n- **Desktop:** 12 columns / 24px gutter / 48px margins.\n- **Tablet:** 8 columns / 16px gutter / 24px margins.\n- **Mobile:** 4 columns / 16px gutter / 16px margins.\n\nSpacing follows a strict 4px/8px baseline rhythm. Information density should remain high; use `md` (24px) for most container padding to keep the interface feeling tight and professional. Components like code editors should maximize vertical space, often utilizing \"sticky\" layouts to keep instructions and input side-by-side on wider viewports.\n\n## Elevation & Depth\n\nTo maintain a clean, academic look, this design system avoids heavy shadows. Instead, it utilizes **Tonal Layers** and **Low-Contrast Outlines**.\n\n- **Level 0 (Background):** Primary background surface.\n- **Level 1 (Cards/Sections):** White surface with a 1px border (`#E2E8F0`). No shadow.\n- **Level 2 (Dropdowns/Modals):** White surface with a 1px border and a subtle, high-diffusion shadow (0px 4px 12px rgba(0,0,0,0.05)).\n- **Interactive States:** Use subtle background color shifts (e.g., Slate 50 to Slate 100) rather than elevation changes to indicate hover states.\n\n## Shapes\n\nThe shape language is \"Soft\" yet disciplined. A standard radius of `0.25rem` (4px) is applied to buttons, input fields, and small UI components to take the edge off the technical rigidity without appearing \"bubbly\" or consumer-oriented. \n\nLearning module cards and code editor frames use a `0.5rem` (8px) radius to create a distinct containerized feel for primary content areas. Progress bars and status badges remain slightly rounded, never fully pill-shaped, to maintain the professional aesthetic.\n\n## Components\n\n- **Buttons:** Primary buttons use the Deep Slate Blue background with white text. Secondary buttons use a 1px border with Intelligence Blue text. No gradients.\n- **Code Editor Frames:** These should feature a \"Mac-style\" or \"IDE-style\" header bar containing the filename in `label-sm` and a subtle \"Copy\" button. The background must be distinct from the main page surface.\n- **Progress Indicators:** Use a 4px tall linear bar. Use the Secondary Blue for \"In Progress\" and the Accent Emerald for \"Complete.\"\n- **Stats Badges:** Small, rectangular badges with a light tinted background and dark text (e.g., Emerald 50 background with Emerald 700 text) to denote difficulty levels or earned XP.\n- **Input Fields:** Minimalist design with a 1px border. Focus state should use a 2px Intelligence Blue border with no \"glow\" or outer shadow.\n- **Navigation:** A slim left-hand sidebar or a thin top-bar. Use icons with 1.5px stroke weight and paired `label-sm` text. Icons should be functional, not decorative.",
  "colorVariant": "FIDELITY",
  "overridePrimaryColor": "#1e293b",
  "overrideSecondaryColor": "#3b82f6",
  "overrideTertiaryColor": "#10b981",
  "overrideNeutralColor": "#64748b",
  "spacingScale": 2,
  "typography": {
    "body-md": {
      "fontFamily": "Inter",
      "fontSize": "16px",
      "fontWeight": "400",
      "lineHeight": "24px"
    },
    "code-md": {
      "fontFamily": "JetBrains Mono",
      "fontSize": "14px",
      "fontWeight": "400",
      "lineHeight": "22px"
    },
    "display-lg": {
      "fontFamily": "Inter",
      "fontSize": "48px",
      "fontWeight": "700",
      "lineHeight": "56px",
      "letterSpacing": "-0.02em"
    },
    "headline-lg": {
      "fontFamily": "Inter",
      "fontSize": "32px",
      "fontWeight": "600",
      "lineHeight": "40px",
      "letterSpacing": "-0.01em"
    },
    "headline-lg-mobile": {
      "fontFamily": "Inter",
      "fontSize": "24px",
      "fontWeight": "600",
      "lineHeight": "32px"
    },
    "label-sm": {
      "fontFamily": "JetBrains Mono",
      "fontSize": "12px",
      "fontWeight": "500",
      "lineHeight": "16px"
    }
  },
  "spacing": {
    "base": "4px",
    "gutter": "24px",
    "lg": "40px",
    "margin-desktop": "48px",
    "margin-mobile": "16px",
    "md": "24px",
    "sm": "16px",
    "xl": "64px",
    "xs": "8px"
  },
  "headlineFontFamily": "Inter",
  "bodyFontFamily": "Inter",
  "labelFontFamily": "Jetbrains Mono"
}