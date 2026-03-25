# Public Styling Guidelines for AI Agents

This document defines the architectural standards for styling public-facing routes and components in the Dev Club WMU application.

## Centralized Theme Configuration

All public-facing styles MUST use the centralized CSS variables defined in [src/styles.css](file:///Users/nexus/Documents/dev_club/devwmu/src/styles.css). These variables are exposed as Tailwind utility classes for consistent usage.

### Color Variables & Utilities

| Variable Name | Tailwind Utility | Purpose |
|---------------|------------------|---------|
| `--public-bg` | `bg-public-bg` | Main background for all public pages. Should be applied only at the layout level (`_public/route.tsx`). |
| `--public-fg` | `text-public-fg` | Default text color. Inherited from the layout. |
| `--public-accent` | `text-public-accent` / `bg-public-accent` | Primary brand color used for highlights, logos, active states, and icons. |
| `--public-accent-muted` | `bg-public-accent-muted` | Soft background for tags, badges, or low-priority highlights. |
| `--public-card-bg` | `bg-public-card` | Opaque/blur backgrounds for cards and overlays. |
| `--public-card-border` | `border-public-border` | Subtle borders for structuring content on dark backgrounds. |
| `--public-glow` | `bg-public-glow` | Atmospheric shadows and decorative glowing effects. |
| `--public-cta-bg` | `bg-public-cta` | High-visibility background for "Call to Action" buttons. |
| `--public-cta-fg` | `text-public-cta-fg` | High-contrast text color for CTA buttons. |
| `--public-nav-hover` | `bg-public-nav-hover` | Hover/Active background state for navigation links and menu items. |

---

## Strict Rules for Development

### 1. No Hardcoded Colors
NEVER use specific Tailwind colors (like `bg-slate-950`, `text-wmu-gold`, or `border-slate-800`) directly in files under:
- `src/routes/_public/`
- `src/components/` (if the component is used in public routes)

### 2. Extend, Don't Bypass
If a new color state or decorative color is required, it **must** be added as a new `--public-` variable in [src/styles.css](file:///Users/nexus/Documents/dev_club/devwmu/src/styles.css) and registered in the `@theme` block before use.

### 3. Layout Inheritance
The main background color (`bg-public-bg`) and text color (`text-public-fg`) are already applied in the `PublicLayout` (`src/routes/_public/route.tsx`). Child routes and components should not re-specify these unless overriding them for specific decorative purposes.

### 4. Selection Styling
Always use `selection:bg-public-accent/30` for user text selection to maintain brand consistency.

---

## Advanced Styling Techniques

#### 1. Opacity Modifiers
Tailwind's opacity modifiers work seamlessly with our custom variables. Use this for subtle depth and layering:
- `bg-public-accent/10`: Soft brand-colored backgrounds for badges or glows.
- `border-public-accent/20`: Muted borders that still maintain brand identity.
- `bg-public-bg/80 backdrop-blur-md`: Standard for fixed headers and glassmorphism.

#### 2. Brand-Colored Shadows
Never use generic black/slate shadows for public components. Use public tokens for "glowing" shadow effects:
```tsx
<div className="shadow-[0_0_20px_rgba(246,200,78,0.3)] hover:shadow-[0_0_40px_rgba(246,200,78,0.5)]">
  {/* The color in rgba should conceptually match --public-accent */}
</div>
```

#### 3. Decorative Corner Cuts ("League Style")
When implementing the sharp-corner "punched out" look, ensure the cut-out triangles match the **parent background color** (`public-bg` or `public-card`):
```tsx
<div className="absolute top-0 right-0 border-t-[8px] border-l-[8px] border-t-public-bg border-l-transparent"></div>
```

#### 4. Atmospheric Glows
Utilize large, blurred radial gradients with `public-glow` variants to create depth and hierarchy:
```tsx
<div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-public-accent/20 to-transparent" />
<div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-public-glow/20 blur-[120px] pointer-events-none" />
```

---

## The "Single Block" Transformation Power

The primary goal of this architecture is to allow **instant branding pivots**. By modifying the `/* Public Theme Variables */` block in `src/styles.css`, an entire public-facing platform (About, Events, Landing, Auth) can be re-skinned in minutes without touching a single component or route.

**Efficiency Record**: A full-site transition from a generic navy/cyan theme to the official **WMU Brown & Gold** brand was completed by editing only **10 lines** of CSS and performing a final sweep to remove legacy hardcoded references.

If you find yourself hardcoding a color like `slate-900` because "it's just a neutral shade," **stop**. Neutral shades must also be tokens (`public-card`, `public-border`) to ensure they remain neutral if the theme shifts from dark to light or brown to navy.
