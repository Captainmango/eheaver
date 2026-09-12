# Agent notes

A compact guide for working on this Astro personal site.

## Package manager

- Prefer `pnpm` over `npm`. The repo has both `package-lock.json` and `pnpm-lock.yaml`, but the latest commit migrated to pnpm and `node_modules/.modules.yaml` confirms pnpm is in use.
- Use `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm preview`.
- `pnpm-workspace.yaml` only exists to allow native builds (`@parcel/watcher`, `esbuild`, `sharp`); there are no workspace packages.

## Commands

| Command | Action |
| :------ | :----- |
| `pnpm dev` | Dev server at `http://localhost:4321` |
| `pnpm build` | Static build to `./dist/` |
| `pnpm preview` | Preview the built site |
| `pnpm astro ...` | Astro CLI (e.g. `pnpm astro add`) |

- There are no test, lint, or typecheck scripts in `package.json`.
- `pnpm astro check` is not set up; Astro will prompt you to install `@astrojs/check` if you try it.

## Astrobook / component workbench

- Astrobook is mounted at `/astrobook` **only in dev** (`process.env.NODE_ENV !== "production"`).
- Stories live in `src/components/stories/` as `.stories.ts` files that export a default component and named story objects.
- Some stories use `ResponsiveWrapper` (`src/components/helpers/ResponsiveWrapper.astro`) to render a component inside an iframe at a fixed viewport size. The wrapper loads a route under `/ui/<ComponentName>`.
- Dev-only UI preview pages live in `src/pages/ui/` (e.g. `UISidebar.astro`, `UIBlogpostCard.astro`). These wrap a component in `src/layouts/Astrobook.astro` for isolated preview.
- **Do not put real public pages in `src/pages/ui/`**: a custom integration (`excludeUiPages`) deletes any page whose component path contains `/pages/ui/` from production builds.

## Content

- `src/content.config.ts` defines a single `medium` collection loaded by `@ykocaman/astro-medium-loader` from `https://medium.com/feed/@edward-heaver`.
- The loader caches fetched posts to `.astro/storage/medium` in non-production; production builds fetch live.
- `BlogpostGrid.astro` consumes the collection and filters out Medium placeholder hero images (`https://medium.com/_...`).

## Styling

- Global styles are `src/scss/main.scss`, which customizes `@picocss/pico` (theme color `jade`, parent selector `.pico`).
- Components use `lang="scss"`.
- Theme switching is done via inline scripts that set/read `data-theme` and `localStorage`.
- Pico Sass deprecation warnings during build are expected and non-fatal.

## Images

- `astro.config.mjs` allows remote images from `**.medium.com`.
- Fallback/static images live in `public/` (`public/favicon.svg`, `public/static/profile.jpeg`).
- `astro-icon` pulls icons from the installed `@iconify-json/*` packages (`lucide`, `fa6-brands`). It warns about a missing `src/icons/` directory, but icons still render.

## Build gotchas

- `pnpm build` currently fails at the image-optimization step with `MissingSharp: Could not find Sharp`. Install `sharp` manually (`pnpm add sharp`) to make production builds pass.
- The `@ykocaman/astro-medium-loader` deprecation warning about schema functions is non-fatal.
- Production output is static (`output: "static"` is the Astro default).

## Deployment

- README documents Surge deploy: `pnpm build && surge ./dist eheaver.cloud`.
- Because of the Sharp issue above, deployment will fail until `sharp` is installed.

## TypeScript

- `tsconfig.json` extends `astro/tsconfigs/strict` and enables `strictNullChecks`.
- `.astro/types.d.ts` is generated; do not edit it by hand.
