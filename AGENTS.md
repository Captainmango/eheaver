# Agent notes

A compact guide for working on this Astro personal site.

## Package manager

- Prefer `pnpm` over `npm`. The repo migrated to pnpm and `node_modules/.modules.yaml` confirms pnpm is in use.
- Use `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm preview`.
- `pnpm-workspace.yaml` only exists to allow native builds (`@parcel/watcher`, `esbuild`, `sharp`); there are no workspace packages.

## Commands

| Command | Action |
| :------ | :----- |
| `pnpm dev` | Dev server at `http://localhost:4321` |
| `pnpm build` | Static build to `./dist/` |
| `pnpm preview` | Preview the built site |
| `pnpm astro ...` | Astro CLI (e.g. `pnpm astro add`) |
| `pnpm storybook` | Storybook dev server at `http://localhost:6006` |
| `pnpm build-storybook` | Static Storybook build to `./storybook-static/` |

- There are no test, lint, or typecheck scripts in `package.json`.
- `pnpm astro check` is not set up; Astro will prompt you to install `@astrojs/check` if you try it.

## Components

- Reusable UI components are implemented as Svelte 5 components in `src/components/**/*.svelte`.
- Astro pages and layouts remain `.astro` files; components are consumed from them.
- Storybook stories live next to components as `src/components/**/*.stories.ts`.
- Global Pico styles are imported in `.storybook/preview.ts` so components render with the live site styling.

## Storybook / component workbench

- Storybook uses the `@storybook/svelte-vite` framework.
- Because this is an Astro project, `.storybook/main.ts` adds `@sveltejs/vite-plugin-svelte` and excludes Svelte internals from dependency optimization.
- The Viewport addon (included in `@storybook/addon-essentials`) replaces the old `ResponsiveWrapper` iframe behaviour.

## Content

- `src/content.config.ts` defines a single `medium` collection loaded by `@ykocaman/astro-medium-loader` from `https://medium.com/feed/@edward-heaver`.
- The loader caches fetched posts to `.astro/storage/medium` in non-production; production builds fetch live.
- `src/pages/index.astro` fetches the collection, filters out Medium placeholder hero images (`https://medium.com/_...`), and passes posts to `BlogpostGrid.svelte`.
- A shared `MediumPost` type is defined in `src/types.ts`.

## Styling

- Global styles are `src/scss/main.scss`, which customizes `@picocss/pico` (theme color `jade`, parent selector `.pico`).
- Svelte components use `lang="scss"` for scoped styles.
- Theme switching is done via inline scripts that set/read `data-theme` and `localStorage`.
- Pico Sass deprecation warnings during build are expected and non-fatal.

## Images

- `astro.config.mjs` allows remote images from `**.medium.com`.
- `public/favicon.svg` remains a public asset.
- The headshot is an optimised asset at `src/assets/profile.jpeg`; `Layout.astro` uses `getImage()` to produce a Webp version for the Svelte `Sidebar`.
- Presentational Svelte components use standard `<img>` tags; Astro `<Image>` optimisation is only used in `.astro` layouts/pages where it matters.

## Icons

- Components use a local `InlineIcon.svelte` component that renders inline SVGs using `@iconify/utils` and the installed `@iconify-json/*` icon sets (`lucide`, `fa6-brands`) to avoid async icon-loading CLS.
- The old `astro-icon` integration and package have been removed.
- `@iconify/svelte` is still used by Storybook to register collections.

## Sidebar & theme

- `Layout.astro` renders the `Sidebar` Svelte component without a `client:` directive so it stays static HTML.
- Theme switching is handled by an inline script in `<head>` that sets `data-theme` before first paint and attaches a click listener to `#theme-toggle`.
- The mobile navigation toggle uses a CSS checkbox hack and needs no JavaScript.

## Build gotchas

- `sharp` is installed and production image optimisation now works.
- The `@ykocaman/astro-medium-loader` deprecation warning about schema functions is non-fatal.
- Production output is static (`output: "static"` is the Astro default).

## Deployment

- README documents Surge deploy: `pnpm build && surge ./dist eheaver.cloud`.
- Cloudflare Pages: `wrangler.toml` at the repo root supplies the project name, compatibility date, and build output directory for Git-connected builds.

## TypeScript

- `tsconfig.json` extends `astro/tsconfigs/strict` and enables `strictNullChecks`.
- `.astro/types.d.ts` is generated; do not edit it by hand.
