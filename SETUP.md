# Cloudflare Pages setup guide

This guide covers the Cloudflare-side steps needed to deploy this Astro site from GitHub. It assumes you already have a Cloudflare account and that your domain (`eheaver.cloud`) is managed by Cloudflare.

## 1. Create the Pages project

This setup uses **GitHub Actions** to build and deploy the site, so Cloudflare Pages does not need direct access to the GitHub repository.

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/).
2. Go to **Workers & Pages** in the left sidebar.
3. Click **Create application**, then choose the **Pages** tab.
4. Choose **Upload assets**.
5. Enter the **Project name** `eheaver` and create the project.
6. Skip the initial upload step — the GitHub Action will deploy the assets.
7. Go to the project **Settings** → **Builds & deployments** and disable automatic builds so Cloudflare does not try to build the project itself.

## 2. Create a Cloudflare API token

1. Go to **My Profile** → **API Tokens** → **Create Token**.
2. Use the **Custom token** template.
3. Grant the following permission:
   - **Zone:Read** (if you want the token scoped to a zone) or **Account:Read**
   - **Cloudflare Pages:Edit**
4. Under **Account Resources**, include your account.
5. Under **Zone Resources**, include `eheaver.cloud` (optional but recommended).
6. Create the token and copy the value.

## 3. Add GitHub secrets

1. Open the GitHub repository → **Settings** → **Secrets and variables** → **Actions**.
2. Add the following repository secrets:

   | Secret | Value |
   | :----- | :---- |
   | `CLOUDFLARE_API_TOKEN` | The token created in step 2. |
   | `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID (shown on the right side of the dashboard overview). |

## 4. GitHub Actions workflow

The repository includes `.github/workflows/deploy.yml`. It runs only on pushes to `main`:

- Installs pnpm and Node 22.
- Runs `pnpm install --frozen-lockfile`.
- Runs `pnpm build`.
- Uses `cloudflare/pages-action@v1` to upload `./dist` to the Pages project.

No preview deployments are created.

### Changing Node or pnpm versions

Edit the workflow file directly:

- `node-version` in the `actions/setup-node` step.
- `version` in the `pnpm/action-setup` step.

## 5. Add a custom domain

Because `eheaver.cloud` is already managed by Cloudflare, the DNS record can be created automatically.

1. Once the first GitHub Actions deployment succeeds, open the Pages project and go to **Custom domains**.
2. Click **Set up a custom domain**.
3. Enter `eheaver.cloud` and click **Continue**.
4. Cloudflare will validate the domain and offer to create the required CNAME/DNS record automatically. Accept it.
5. Ensure the resulting DNS record is **proxied** (orange cloud) so Cloudflare can issue the SSL certificate.
6. Wait for the domain status to change to **Active**. This can take a few minutes.
7. Once active, visits to `https://eheaver.cloud` will serve the Pages deployment.

## 6. Build troubleshooting

### `packages field missing or empty`

If the GitHub Actions build fails during `pnpm install --frozen-lockfile` with:

```
ERROR packages field missing or empty
```

it means pnpm is treating the repo as a workspace but `pnpm-workspace.yaml` does not declare any workspace packages. The fix is to add the project root as a workspace package:

```yaml
packages:
  - '.'
```

This repository already includes that entry; if you see the error, verify `pnpm-workspace.yaml` still contains it.

### pnpm / lockfile version mismatch

If the workflow installs a pnpm version that cannot read `pnpm-lock.yaml`, update the `version` value in the `pnpm/action-setup` step to match the version that generated the lockfile.

## 7. DNS troubleshooting

If the custom domain does not become active:

1. Go to the Cloudflare dashboard → your domain → **DNS** → **Records**.
2. Look for a CNAME record for `eheaver.cloud` pointing to your Pages project domain (it looks like `<project>.pages.dev`).
3. If it is missing or incorrect, delete it and re-add the custom domain in the Pages project.
4. Ensure the DNS record is **proxied** (orange cloud) so Cloudflare can issue the SSL certificate.

## 8. Useful Cloudflare Pages URLs

- [Cloudflare Pages docs](https://developers.cloudflare.com/pages/)
- [Astro on Cloudflare Pages guide](https://developers.cloudflare.com/pages/framework-guides/astro/)
- [Cloudflare Pages environment variables](https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables)

## Next steps

After Cloudflare shows the deployment as active, follow the verification and cleanup steps in `PLAN.md`.
