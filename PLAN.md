# Migration plan: Surge → Cloudflare Pages

## Goal

Move deployment of this Astro static site from Surge to Cloudflare Pages so that:

- Every push to `main` deploys to production automatically.
- The custom domain `eheaver.cloud` is served through Cloudflare.
- No preview deployments are created.
- The manual `surge ./dist eheaver.cloud` step is no longer required.

## Current state

- Static Astro site (`output: "static"` by default).
- Build output is written to `./dist/`.
- Build command: `pnpm build`.
- Currently deployed to `eheaver.cloud` via Surge (`pnpm build && surge ./dist eheaver.cloud`).

## Target state

- Cloudflare Pages project connected to this GitHub repository.
- Production deploys on every push to `main`.
- Custom domain `eheaver.cloud` configured in Cloudflare Pages and DNS.
- No preview deployments.
- Local build/preview workflow unchanged (`pnpm build` / `pnpm preview`).

## Migration steps

### 1. Prepare the repository

- [ ] Ensure `main` is the default branch and is up to date.
- [ ] Confirm `./dist` is in `.gitignore` (Cloudflare Pages builds from source, not from a committed dist folder).
- [ ] Confirm `pnpm-lock.yaml` is committed so Cloudflare Pages installs the exact dependency tree.
- [ ] Confirm `pnpm-workspace.yaml` declares the project root as a workspace package (`packages: ['.']`) so Cloudflare Pages does not fail with `packages field missing or empty`.

### 2. Create the Cloudflare Pages project

- [ ] Open the Cloudflare dashboard and navigate to **Workers & Pages** → **Create application** → **Pages**.
- [ ] Choose **Upload assets** (not **Connect to Git**).
- [ ] Set the **Project name** to `eheaver`.
- [ ] Create the project. You can skip the first upload because GitHub Actions will handle deployments.
- [ ] Go to the project **Settings** → **Builds & deployments** and disable Cloudflare's automatic builds so only the GitHub Action deploys.

### 3. Set up GitHub Actions deployment

- [ ] Add the workflow file `.github/workflows/deploy.yml` from this repository.
- [ ] In GitHub, go to **Settings** → **Secrets and variables** → **Actions** and add:
  - `CLOUDFLARE_API_TOKEN` — a Cloudflare API token with `Cloudflare Pages:Edit` permission.
  - `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID (found on the right side of the dashboard overview).
- [ ] Push the workflow to `main` to trigger the first deployment.

### 4. Configure the custom domain

- [ ] In the Pages project, go to **Custom domains** and add `eheaver.cloud`.
- [ ] Follow Cloudflare’s DNS instructions. Because the domain is already in Cloudflare, Pages will usually add the required CNAME record automatically.
- [ ] Wait for the SSL/TLS certificate to be issued and the domain status to show **Active**.

### 5. Verify the deployment

- [ ] Confirm the production URL from Pages returns the site correctly.
- [ ] Confirm `https://eheaver.cloud` loads the Cloudflare Pages deployment.
- [ ] Check that images, styles, and the Medium feed are loading correctly.

### 6. Update project documentation

- [ ] Update `README.md`:
  - Replace the Surge deployment section with Cloudflare Pages instructions.
  - Document the production URL.
- [ ] Remove any Surge-specific scripts, configuration, or ignored files if present.

### 7. Clean up Surge

- [ ] Once `eheaver.cloud` is confirmed pointing to Cloudflare Pages:
  - Remove the Surge deployment if desired (`surge teardown eheaver.cloud`).
  - Uninstall Surge globally if it is no longer needed (`pnpm uninstall --global surge`).
- [ ] Verify the old Surge URL no longer serves the site.

### 8. Post-migration checks

- [ ] Confirm builds still pass locally: `pnpm build && pnpm preview`.
- [ ] Confirm the Medium loader cache behaves as expected in production vs. local builds.
- [ ] Add a Cloudflare Pages status badge to `README.md` (optional).

## Rollback plan

If something goes wrong during the migration:

1. Re-run `pnpm build && surge ./dist eheaver.cloud` from a local machine to restore the Surge deployment.
2. In Cloudflare DNS, point the `eheaver.cloud` CNAME back to the Surge endpoint (`na-west1.surge.sh`) temporarily.
3. Investigate the Pages build or DNS issue before trying again.

## Notes

- This is a static site, so no server-side code or Functions changes are needed.
- Cloudflare Pages supports redirects and headers via a `_redirects` or `_headers` file in `dist/` if required later.
- The site is built and deployed from GitHub Actions using a Cloudflare API token stored as a GitHub secret.
