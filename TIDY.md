# TIDY.md — Codebase tidy-up assessment

Last reviewed: 2026-09-13

## Summary

The site builds and TypeScript checks cleanly (`pnpm build`, `pnpm exec tsc --noEmit`, `pnpm build-storybook` all pass). The code works, but there are several housekeeping issues: leftover/unused styles, invalid CSS values, mixed formatting, stale documentation, and a handful of accessibility/security micro-fixes. This doc lists them in priority order.

## High priority

### 1. Remove generated build artefacts from the working tree
- **Files:** `dist/`, `storybook-static/`
- **Issue:** Both directories are present locally but are listed in `.gitignore`. They add clutter and can be confused with the real source.
- **Action:** `rm -rf dist storybook-static` (they will be recreated by `pnpm build` / `pnpm build-storybook`).

### 2. Fix broken footer styling
- **File:** `src/components/Footer.svelte`
- **Issue:** Uses CSS variables that no longer exist:
  ```scss
  background: linear-gradient(var(--gray-gradient)) no-repeat;
  color: rgb(var(--gray));
  ```
  Both `--gray-gradient` and `--gray` are undefined, so the declarations are invalid leftovers from the Astro starter template.
- **Action:** Replace with Pico theme variables (e.g. `background-color: var(--pico-card-background-color)`, `color: var(--pico-muted-color)`) or remove the properties entirely.

### 3. Fix invalid `grid-area` values
- **File:** `src/components/Sidebar.svelte`
- **Issue:** `grid-area: "sidebar";` is invalid CSS — grid-area names must not be quoted.
- **Action:** Change to `grid-area: sidebar;`.
- **Note:** `src/layouts/Layout.astro` already defines the named area correctly; only the component is wrong.

### 4. Correct `clamp()` usage
- **Files:** `src/components/Sidebar.svelte`, `src/layouts/Layout.astro`
- **Issue:** Several `clamp()` calls have the max value smaller than the min value, which makes the preferred value unusable:
  - `Sidebar.svelte`: `width: clamp(280px, 300px, 17%);` → should be `clamp(280px, 17%, 300px);`
  - `Layout.astro`: `grid-template-columns: clamp(280px, 600px, 20%) 1fr;` → should be `clamp(280px, 20%, 600px) 1fr;`
- **Action:** Swap the preferred and max arguments.

### 5. Consolidate Google Fonts requests
- **File:** `src/layouts/Head.astro`
- **Issue:** Two `<link>` tags are loaded; the first only requests Ruda, the second requests Roboto + Ruda again.
- **Action:** Replace with a single link:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&family=Ruda:wght@400..900&display=swap" rel="stylesheet">
  ```

## Medium priority

### 6. Remove dead/invalid CSS in `BlogpostCard.svelte`
- **File:** `src/components/BlogpostCard.svelte`
- **Issues:**
  - The `.card` element is `display: flex`, but a media query sets `grid-template-columns: repeat(auto-fit, minmax(0%, 1fr));` — this has no effect.
  - The `width: 90%;` inline style on the anchor should live in the component CSS.
  - `sass:map` and the Pico settings import are only needed for the remaining breakpoint check; consider simplifying with a CSS custom property or plain media query.
- **Action:** Delete the invalid grid rule, move the anchor width into the style block, and review whether the breakpoint guard `@if map.get(...)` is still necessary.

### 7. Remove redundant media query in `BlogpostGrid.svelte`
- **File:** `src/components/BlogpostGrid.svelte`
- **Issue:** The media query resets `gap` to the same value it already has:
  ```scss
  gap: var(--pico-spacing);
  @media (...) { gap: var(--pico-spacing); }
  ```
- **Action:** Delete the redundant breakpoint block (and the `sass:map` / Pico settings import if no longer used).

### 8. Move inline styles to component CSS
- **Files:** `src/components/Sidebar.svelte`, `src/components/BlogpostCard.svelte`
- **Issue:** Inline `style="width: 20ch;"`, `style="width: 22ch;"`, and `style="width: 90%;"` are hard to override and mix presentation with markup.
- **Action:** Move them to scoped classes in the respective `<style>` blocks.

### 9. Deduplicate theme-toggle logic
- **Files:** `src/layouts/Layout.astro`, `src/components/SocialButtons.svelte`
- **Issue:** The same toggle logic exists in the inline global script and in the Svelte component. Only the global script runs in production (the component is rendered statically), but the component script is needed for Storybook.
- **Action:** Extract a tiny shared `theme.ts` utility and import it in both places, or clearly comment why the duplication exists.

### 10. Add `rel="noopener noreferrer"` to external links
- **Files:** `src/components/SocialButtons.svelte`, `src/components/BlogpostCard.svelte`
- **Issue:** All `target="_blank"` links lack `rel` attributes.
- **Action:** Add `rel="noopener noreferrer"` to the GitHub/LinkedIn/X links and to the "Read on Medium" link.

### 11. Improve icon accessibility
- **File:** `src/components/SocialButtons.svelte`, `src/components/InlineIcon.svelte`
- **Issue:** Social links contain only an `aria-hidden` SVG and no visible text, so screen readers have nothing to announce. The theme toggle also has no accessible label.
- **Action:** Add `aria-label` attributes to the social anchors and to the `#theme-toggle` anchor (or convert the toggle to a `<button>` with an `aria-label`).

### 12. Standardise formatting and quote style
- **Files:** `src/pages/about.astro`, `src/pages/index.astro`, `src/content.config.ts`, `astro.config.mjs`
- **Issue:** `about.astro` uses 4-space indentation and extra blank lines; other files use 2 spaces. Import quotes are mixed (single vs double).
- **Action:** Run a formatter (Prettier/Biome) or manually normalise indentation, quote style, and trailing newlines across all source files.

### 13. Replace `<br><br>` paragraph breaks in `about.astro`
- **File:** `src/pages/about.astro`
- **Issue:** Paragraph spacing is achieved with `<br><br>` inside a single `<p>`.
- **Action:** Split the content into multiple `<p>` elements and use CSS for spacing.

## Low priority

### 14. Review Pico module inclusion
- **File:** `src/scss/main.scss`
- **Issue:** Many Pico modules are enabled (forms, accordion, dropdown, modal, tooltip, etc.) but the site only uses a small subset. The built CSS is ~88 kB (gzipped ~12 kB) — acceptable, but could be trimmed.
- **Action:** Disable modules that are not used to reduce bundle size and suppress deprecation noise from unused components (e.g. `_modal.scss`).

### 15. Minor SCSS clean-ups in `main.scss`
- **File:** `src/scss/main.scss`
- **Issues:**
  - `--pico-font-family-sans-serif: "Ruda"` is missing a trailing semicolon.
  - Indentation is inconsistent (4 spaces inside the `@use` block, 2 spaces elsewhere).
- **Action:** Add semicolons and normalise indentation.

### 16. Prefer `import.meta.env` in Astro config
- **File:** `src/content.config.ts`
- **Issue:** Uses `process.env.NODE_ENV !== "production"`.
- **Action:** Use `import.meta.env.PROD` (or `!import.meta.env.DEV`) for consistency with Astro/Vite conventions.

### 17. Avoid mutating collection entries in `index.astro`
- **File:** `src/pages/index.astro`
- **Issue:** The map block mutates `post.data.heroImage` directly:
  ```ts
  post.data.heroImage = undefined;
  return post.data;
  ```
- **Action:** Return a new object instead:
  ```ts
  .map(post => ({
    ...post.data,
    heroImage: post.data.heroImage?.startsWith("https://medium.com/_") ? undefined : post.data.heroImage,
  }))
  ```

### 18. Fix typo in `SocialButtons.svelte`
- **File:** `src/components/SocialButtons.svelte`
- **Issue:** Class name `.socials-boarder` should be `.socials-border`.
- **Action:** Rename the class and its reference.

### 19. Convert theme toggle from `<a>` to `<button>`
- **File:** `src/components/SocialButtons.svelte`
- **Issue:** The theme toggle is an anchor with `href="/"` and `preventDefault`; it performs a button action, not navigation.
- **Action:** Use `<button type="button">` for better semantics and keyboard behaviour.

### 20. Review dependency list for unused packages
- **File:** `package.json`
- **Candidates:**
  - `@iconify/types` — no imports found.
  - `@storybook/test` — no test imports found in stories.
- **Action:** Remove them if not needed, or document why they are kept.

### 21. Consider moving `sharp` to `dependencies`
- **File:** `package.json`
- **Issue:** `sharp` is in `devDependencies`. If a CI/CD pipeline runs `pnpm install --prod`, image optimisation will fail.
- **Action:** Move `sharp` to `dependencies` since it is required at build time for the deployed site.

### 22. Stale deployment documentation
- **File:** `README.md`
- **Issue:** README says the site is deployed automatically on every push via Cloudflare Workers/Wrangler, but `.github/workflows/` is empty and no CI config is present.
- **Action:** Either add a GitHub Actions workflow that runs `pnpm build` + `wrangler deploy`/`wrangler pages deploy`, or update README to describe the actual manual deploy steps.

### 23. Add `engines` / `packageManager` fields
- **File:** `package.json`
- **Issue:** No Node.js, pnpm, or packageManager version is pinned.
- **Action:** Add `engines.node`, `engines.pnpm`, and/or `packageManager` for reproducible builds.

## Suggested quick wins (do first)

1. Delete `dist/` and `storybook-static/`.
2. Fix `Footer.svelte` CSS variables.
3. Fix `Sidebar.svelte` `grid-area` and `clamp()` values.
4. Fix `Layout.astro` `clamp()` value.
5. Combine Google Fonts links in `Head.astro`.
6. Add `rel="noopener noreferrer"` to all `target="_blank"` links.
7. Run a formatter over the source files.

## Nice-to-have tooling

- Add `astro check` (requires `@astrojs/check`) to catch Astro/Svelte type issues.
- Add `svelte-check` for Svelte-specific diagnostics.
- Add a lint/format script (e.g. Prettier or Biome) to keep style consistent.

## Appendix: Pico CSS module audit

**File:** `src/scss/main.scss`

The site currently enables every Pico module. Based on the actual markup, many can be turned off. Below is a module-by-module recommendation. After changing any module, run `pnpm build` and visually check both pages and Storybook.

| Module | Status | Reason |
| --- | --- | --- |
| `themes/default` | **Keep** | Required for light/dark theming. |
| `layout/document` | **Keep** | Base document styles. |
| `layout/landmarks` | **Keep** | Styles `header`, `footer`, `main`, `aside`, etc. |
| `layout/section` | **Keep** | Used by `<section>` elements. |
| `layout/container` | **Keep** | Used by `.container`. |
| `layout/grid` | **Disable** | The site uses its own CSS Grid in `Layout.astro`; Pico’s `.grid` helper classes are not used. |
| `layout/overflow-auto` | **Disable** | Not used; `.page-content` has its own `overflow: auto`. |
| `content/typography` | **Keep** | Headings, paragraphs, lists, etc. |
| `content/link` | **Keep** | General link styles. |
| `content/button` | **Keep** | Mobile nav toggle uses `.outline.secondary`. |
| `content/table` | **Disable** | No tables on the site. |
| `content/embedded` | **Keep** | Images in `BlogpostCard` benefit from responsive embedded styles. |
| `content/code` | **Disable** | No inline or block code samples. |
| `content/miscs` | **Keep** | Footer uses `<small>`; this module covers it. |
| `forms/basics` | **Disable** | No forms; the nav checkbox is hidden with inline `display:none`. |
| `forms/checkbox-radio-switch` | **Disable** | Same as above — the nav checkbox is not styled by Pico. |
| `forms/input-color` | **Disable** | Not used. |
| `forms/input-date` | **Disable** | Not used. |
| `forms/input-file` | **Disable** | Not used. |
| `forms/input-range` | **Disable** | Not used. |
| `forms/input-search` | **Disable** | Not used. |
| `components/accordion` | **Disable** | Not used. |
| `components/card` | **Keep** | `BlogpostCard` uses `.card`. |
| `components/dropdown` | **Disable** | Not used. |
| `components/group` | **Disable** | Not used. |
| `components/loading` | **Disable** | Not used. |
| `components/modal` | **Disable** | Not used; it is also the source of the Sass deprecation warning. |
| `components/nav` | **Keep** | Sidebar uses `<nav>`; disabling this may remove useful nav resets. Test before removing. |
| `components/progress` | **Disable** | Not used. |
| `components/tooltip` | **Disable** | Not used. |
| `utilities/accessibility` | **Keep** | Handy screen-reader utilities. |
| `utilities/reduce-motion` | **Keep** | Respects `prefers-reduced-motion`. |

### Expected outcome

Disabling the modules marked **Disable** should remove the Sass deprecation warning from `_modal.scss`, reduce the compiled CSS bundle, and make the stylesheet faster to compile. Because Pico is class-less, do a visual regression check on both the blog index and the about page after the change.
