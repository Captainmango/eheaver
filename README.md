# My personal website

This is a basic Astro site used to showcase me, seeing as how I'm basically a commodity now.

## Usage

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Installs dependencies                            |
| `pnpm dev`                | Starts local dev server at `localhost:4321`      |
| `pnpm build`              | Build your production site to `./dist/`          |
| `pnpm preview`            | Preview your build locally, before deploying     |
| `pnpm astro ...`          | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help`    | Get help using the Astro CLI                     |
| `pnpm storybook`          | Starts Storybook at `localhost:6006`             |
| `pnpm build-storybook`    | Builds Storybook to `./storybook-static/`        |

## Development

Storybook is the component workbench. Stories live next to components in `src/components/**/*.stories.ts` and render the Svelte components in isolation with the site's global styles.

Running `pnpm storybook` will start the Storybook dev server at `http://localhost:6006`.

## Deployment

The site is deployed automatically on push/ merge to main via Cloudflare Workers. The wrangler.toml describes how the app deploys.
