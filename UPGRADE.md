# Astro v7 Upgrade Plan

## Goal

Upgrade the site from Astro 6 to Astro 7 and bring the rest of the dependency tree up to the latest compatible versions, especially the Medium content loader.

## Current baseline

| Package | Current | Latest compatible |
| :------ | :------ | :---------------- |
| `astro` | `6.4.8` | `7.3.2` |
| `@astrojs/svelte` | `9.0.1` | `9.0.1` (already Astro 7 compatible) |
| `@ykocaman/astro-medium-loader` | `0.2.4-2` | `0.3.2` |
| `svelte` | `5.57.0` | `5.57.0` (already latest) |
| `@sveltejs/vite-plugin-svelte` | `7.3.0` | `7.3.0` (already latest) |
| `sass` | `1.89.2` | `1.104.1` |
| `@iconify-json/lucide` | `1.2.57` | `1.2.131` |
| `@iconify-json/fa6-brands` | `1.2.5` | `1.2.6` |
| `storybook` (dev) | `8.6.18` | `10.6.0` |
| `@storybook/*` (dev) | `8.6.18` | `10.6.0` |
| `typescript` | `6.0.3` | **Keep on `^6.x`** (Astro/Svelte peer deps do not allow TS 7) |
| `sharp` | `0.35.4` | `0.35.4` (already latest) |
| `@picocss/pico` | `2.1.1` | `2.1.1` (already latest) |

Environment checked: Node `v24.21.0`, pnpm `12.4.1`. Astro 7 requires Node `>=22.12.0`, so the environment is ready.

## Phase 1 — Prepare

1. Make sure the working tree is clean.
2. Create and switch to a branch:

   ```bash
   git checkout -b upgrade/astro-v7
   ```

3. Run a final build on the current stack to establish a baseline:

   ```bash
   pnpm install
   pnpm build
   ```

## Phase 2 — Upgrade Astro and runtime dependencies

Update `package.json` and install. The safest approach is to use `pnpm add` so the lockfile is updated consistently.

```bash
# Dependencies
pnpm add astro@^7.3.2 \
  @astrojs/svelte@^9.0.1 \
  @ykocaman/astro-medium-loader@^0.3.2 \
  svelte@^5.57.0 \
  sass@^1.104.1 \
  @iconify-json/lucide@^1.2.131 \
  @iconify-json/fa6-brands@^1.2.6 \
  @picocss/pico@^2.1.1 \
  sharp@^0.35.4

# Dev dependencies
pnpm add -D @sveltejs/vite-plugin-svelte@^7.3.0 \
  @iconify/svelte@^5.2.2
```

Notes:

- Do **not** bump `typescript` to `^7.0.2`. Astro 7 and `@astrojs/svelte` 9 peer-depend on `typescript ^5.3.3 || ^6.0.0`, so stay on `^6.x`.
- `@astrojs/markdown-remark` is an *optional* peer of `astro` 7. Only install it if we decide to keep using the legacy `unified()` remark/rehype pipeline. The site does not use custom remark/rehype plugins, so the new Sätteri default is fine.

## Phase 3 — Address Astro 7 breaking changes

Review the official [Astro v7 migration guide](https://docs.astro.build/en/guides/upgrade-to/v7/) and apply the following checks to this project.

### 1. Vite 8

Astro 7 ships Vite 8. The custom Vite config in `astro.config.mjs` only sets `optimizeDeps.exclude`, which is unchanged. If any Vite plugin errors appear during `pnpm dev`, fix them per the [Vite 8 migration guide](https://vite.dev/guide/migration).

### 2. Rust compiler (stricter HTML)

The new Rust-based compiler errors on unclosed tags and does not auto-correct invalid HTML. Known issue:

- `src/layouts/Layout.astro` places the `<footer>` element **after** the closing `</body>`. Move it inside `<body>` before the closing tag.

Also audit all `.astro` and `.svelte` files for:

- Unclosed non-void tags
- Invalid nesting such as `<div>` inside `<p>`
- Dangling tags in conditionals/loops

### 3. Reserved file name `src/fetch.ts`

Astro 7 uses `src/fetch.ts` for advanced routing. This project does not have one, so no action is required.

### 4. Markdown processor

The default Markdown pipeline is now Sätteri. Since the project has no custom `remarkPlugins` or `rehypePlugins`, no config change is needed. Only install `@astrojs/markdown-remark` if we later want to opt back into the `unified()` pipeline.

### 5. Whitespace handling (`compressHTML: 'jsx'`)

The default changed from `compressHTML: true` to `compressHTML: 'jsx'`. Inline siblings may lose their separating space. After upgrading, visually inspect the site (especially text + icon combinations). If spacing breaks, either:

- Add explicit spaces with `{" "}` in templates, or
- Revert to the v6 behavior in `astro.config.mjs`:

  ```js
  export default defineConfig({
    compressHTML: true,
    // ...
  });
  ```

### 6. Removed/deprecated APIs

The project does not use any of the following, but confirm with a quick search:

- `getContainerRenderer()` from package roots (use `/container-renderer` import paths if needed)
- Removed `astro:transitions` internals such as `TRANSITION_BEFORE_PREPARATION`, `createAnimationScope()`
- `@astrojs/db`

## Phase 4 — Regenerate types and caches

1. Delete generated Astro types and caches so v7 can recreate them:

   ```bash
   rm -rf .astro
   ```

2. Regenerate content types:

   ```bash
   pnpm astro sync
   ```

3. If you want to verify live Medium fetching in dev, also remove the cached feed:

   ```bash
   rm -rf .astro/storage/medium
   ```

## Phase 5 — Verify

Run the full verification sequence:

```bash
pnpm install
pnpm astro sync
pnpm dev        # smoke test dev server at http://localhost:4321
pnpm build      # must pass without compiler errors
pnpm preview    # inspect production build
```

Checklist:

- [ ] `pnpm build` completes with no compiler errors.
- [ ] Dev server starts and home page renders.
- [ ] Medium posts load (live fetch in prod, cached in non-prod).
- [ ] Hero image filtering for `https://medium.com/_*` still works.
- [ ] Theme toggle works.
- [ ] Mobile nav toggle works.
- [ ] No broken whitespace around inline icons/text.
- [ ] Layout/footer placement is correct after moving `<footer>` inside `<body>`.
- [ ] Pico Sass deprecation warnings are still present and non-fatal (expected).
- [ ] The `@ykocaman/astro-medium-loader` schema-function deprecation warning, if it appears, is non-fatal (expected).

## Phase 6 — Storybook upgrade (separate step)

Storybook is currently `8.6.18`. The latest is `10.6.0`, which is a major jump. Storybook 10 supports Vite 5/6/7/8 and Svelte 5, so it is compatible with Astro 7, but it should be upgraded and tested on its own to avoid mixing two large migrations.

Two options:

1. **Same branch, after Astro 7 is green:**

   ```bash
   pnpm dlx storybook@latest upgrade
   pnpm install
   pnpm storybook
   pnpm build-storybook
   ```

2. **Separate branch/PR** — recommended if Storybook 10 needs config changes.

If we upgrade Storybook manually, bump every Storybook package together to the same version:

- `storybook`
- `@storybook/svelte`
- `@storybook/svelte-vite`
- `@storybook/addon-essentials`
- `@storybook/addon-interactions`
- `@storybook/blocks`
- `@storybook/test`

Then check `.storybook/main.ts` for API changes. The current `viteFinal` custom setup may need tweaks for Storybook 10.

## Phase 7 — Deploy

Once everything is green:

```bash
pnpm build
surge ./dist eheaver.cloud
```

Confirm the live site matches the preview.

## Rollback

If anything goes wrong:

```bash
git checkout main
git branch -D upgrade/astro-v7
rm -rf node_modules .astro
pnpm install
```

This restores the previous `package.json` and `pnpm-lock.yaml`.

## Summary of expected `package.json` changes

Only the version ranges below should change. Everything else stays the same.

```json
{
  "dependencies": {
    "astro": "^7.3.2",
    "@astrojs/svelte": "^9.0.1",
    "@ykocaman/astro-medium-loader": "^0.3.2",
    "sass": "^1.104.1",
    "@iconify-json/lucide": "^1.2.131",
    "@iconify-json/fa6-brands": "^1.2.6"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^7.3.0"
  }
}
```

Storybook packages are intentionally left unchanged in this phase; update them in Phase 6 if desired.
