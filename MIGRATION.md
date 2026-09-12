# Astro → Svelte Component Migration Plan

## Goal

Replace the project's Astro UI components with Svelte components so that the component layer can be tested with Storybook. The site itself remains an Astro static site; only the component implementation language changes.

## Why Svelte inside Astro?

- Astro has first-class Svelte support via `@astrojs/svelte`.
- Pages, layouts, and content loading can stay as `.astro` files where Astro is strongest.
- Storybook has an official Svelte framework renderer (`@storybook/svelte-vite`).
- This is the smallest change that satisfies the requirement (Storybook support) without rebuilding routing, content collections, or deployment.

## Decisions

| Topic | Decision | Rationale |
|---|---|---|
| Framework | Keep Astro; add Svelte components | Smallest blast radius; keeps content collections, image remote config, and routing intact. |
| Storybook framework | `@storybook/svelte-vite` | Vite is already used by Astro, so tooling aligns. |
| Icons | Replace `astro-icon` with `@iconify/svelte` | `astro-icon` only provides Astro components. `@iconify/svelte` covers both Lucide and Font Awesome brand icons from a single API. |
| Images | Use standard `<img>` in Svelte components | `astro:assets` / `<Image>` only works inside `.astro` files. For presentational components, plain `<img>` is sufficient. |
| Styles | Keep SCSS, move into Svelte `<style lang="scss">` | Svelte has scoped styles by default, which replaces Astro's style scoping. |
| Content loading | Keep `getCollection` in `.astro` pages/layouts | Astro content APIs are only available in `.astro` files. The page will fetch posts and pass them to a Svelte grid component. |

## Phase 1: Tooling & dependencies

1. Add the Astro Svelte integration and Svelte itself:
   ```bash
   pnpm astro add svelte
   ```
   This installs `@astrojs/svelte`, `svelte`, and updates `astro.config.mjs` and `tsconfig.json`.

2. Add Storybook with the Svelte Vite framework:
   ```bash
   pnpm dlx storybook@latest init --type svelte --builder vite
   ```
   Or manually install:
   ```bash
   pnpm add -D storybook @storybook/svelte @storybook/svelte-vite @storybook/addon-essentials @storybook/addon-interactions @storybook/blocks @storybook/test
   ```

3. Add icon library:
   ```bash
   pnpm add -D @iconify/svelte
   ```
   Optionally also add `lucide-svelte` if you prefer dedicated Lucide bindings, but `@iconify/svelte` covers the existing icon sets.

4. Add Storybook scripts to `package.json`:
   ```json
   {
     "storybook": "storybook dev -p 6006",
     "build-storybook": "storybook build"
   }
   ```

5. Fix the known build blocker:
   ```bash
   pnpm add sharp
   ```

6. Configure Storybook preview (`./.storybook/preview.ts`) to import global styles:
   ```ts
   import '../src/scss/main.scss';
   import type { Preview } from '@storybook/svelte';

   const preview: Preview = {
     parameters: {
       controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
     },
   };

   export default preview;
   ```

7. Add Storybook viewport addon if responsive testing is important (recommended replacement for `ResponsiveWrapper`).

## Phase 2: Foundation components

Convert the simplest components first to establish patterns.

### 1. `FormattedDate`

Create `src/components/FormattedDate.svelte`:

```svelte
<script lang="ts">
  interface Props {
    date: Date;
  }

  let { date }: Props = $props();
</script>

<time datetime={date.toISOString()}>
  {date.toLocaleDateString('en-gb', { year: 'numeric', month: 'short', day: 'numeric' })}
</time>
```

Story: `src/components/FormattedDate.stories.svelte` or `.stories.ts`.

### 2. `Footer`

Create `src/components/Footer.svelte`:

```svelte
<footer>
  <small>&copy; {new Date().getFullYear()} Edward Heaver. Some rights reserved.</small>
</footer>

<style lang="scss">
  footer {
    width: 90%;
    border-top: solid var(--pico-color) 1px;
    display: flex;
    justify-content: center;
    padding: 2em 1em 6em 1em;
    background: linear-gradient(var(--gray-gradient)) no-repeat;
    color: rgb(var(--gray));
    text-align: center;
  }
</style>
```

### 3. `SocialButtons`

Create `src/components/SocialButtons.svelte`:

```svelte
<script lang="ts">
  import Icon from '@iconify/svelte';

  function toggleTheme(event: MouseEvent) {
    event.preventDefault();
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }
</script>

<div>
  <ul class="wrapper">
    <li>
      <a id="theme-toggle" href="/" on:click={toggleTheme}>
        <span class="sun-icon"><Icon icon="lucide:sun" width="28" /></span>
        <span class="moon-icon"><Icon icon="lucide:moon" width="28" /></span>
      </a>
    </li>
    <span class="socials-boarder"></span>
    <ul class="socials">
      <li><a href="https://github.com/Captainmango" target="_blank"><Icon icon="fa6-brands:github" width="28" /></a></li>
      <li><a href="https://www.linkedin.com/in/edward-heaver-9ba556a0/" target="_blank"><Icon icon="fa6-brands:linkedin-in" width="28" /></a></li>
      <li><a href="https://x.com/EdwardHeaver6" target="_blank"><Icon icon="fa6-brands:x-twitter" width="28" /></a></li>
    </ul>
  </ul>
</div>

<style lang="scss">
  /* migrate existing styles, keep :global([data-theme='dark']) rules as :global(...) */
</style>
```

> Note: theme toggling touches `document`/`localStorage`, so it only runs in the browser. In Storybook this is fine; for SSR the initial theme is set by the Astro layout script.

## Phase 3: Layout & card components

### 4. `Sidebar`

Create `src/components/Sidebar.svelte`:

```svelte
<script lang="ts">
  import Icon from '@iconify/svelte';
  import SocialButtons from './SocialButtons.svelte';

  interface Props {
    currentPage: string;
  }

  let { currentPage }: Props = $props();

  const navItems = [
    { href: '/about', label: 'About', icon: 'lucide:info' },
    { href: '/', label: 'Blog', icon: 'lucide:rss' },
  ];

  function isActive(item: typeof navItems[number]) {
    return currentPage === item.href || currentPage.startsWith(item.href + '/');
  }
</script>

<aside id="nav-container">
  <input type="checkbox" id="nav-state" style="display:none;" tabindex="-1" />
  <label id="mobile-nav-button" for="nav-state" role="button" class="outline secondary">
    <b><Icon icon="lucide:menu" width="28" /></b>
  </label>
  <label for="nav-state" id="overlay"></label>
  <nav id="sidebar" class="closed">
    <!-- migrate markup -->
  </nav>
</aside>

<style lang="scss">
  /* migrate existing scoped styles; replace :global(...) as needed */
</style>
```

- Add a `headshotSrc` prop to the Svelte Sidebar and use a standard `<img src={headshotSrc} ... />` for the headshot. The image will be optimised in the consuming Astro layout using `getImage()` (see Phase 5).
- The current-page click handler can be kept as a small inline script in the consuming Astro layout, or handled in Svelte with an `on:click` on each link.

### 5. `BlogpostCard`

Create `src/components/BlogpostCard.svelte`:

```svelte
<script lang="ts">
  import FormattedDate from './FormattedDate.svelte';
  import fallbackImage from '../assets/blogfallback.png';

  interface Props {
    mediumLink: string;
    blogImage: string | undefined;
    title: string;
    publishDate: Date;
  }

  let { mediumLink, blogImage, title, publishDate }: Props = $props();
</script>

<article class="card">
  <div class="card-image">
    {#if blogImage}
      <img src={blogImage} alt="Hero image for blogpost" width="400" height="300" />
    {:else}
      <img src={fallbackImage} alt="Fallback blog image" width="400" height="300" />
    {/if}
  </div>
  <hgroup>
    <h5 class="title">{title}</h5>
    <p class="date"><FormattedDate date={publishDate} /></p>
  </hgroup>
  <a href={mediumLink} style="width: 90%;" target="_blank">Read on Medium</a>
</article>

<style lang="scss">
  /* migrate existing scoped styles */
</style>
```

## Phase 4: Grid & page data flow

`BlogpostGrid.astro` currently fetches the Medium collection at build time. Astro content APIs are not available inside `.svelte` files, so the data fetch must stay in Astro.

Recommended approach:

1. Convert `BlogpostGrid` to a Svelte component that accepts a `posts` prop:

   ```svelte
   <!-- src/components/BlogpostGrid.svelte -->
   <script lang="ts">
     import BlogpostCard from './BlogpostCard.svelte';
     import type { MediumPost } from '../types'; // define a shared type

     interface Props {
       posts: MediumPost[];
     }

     let { posts }: Props = $props();
   </script>

   <section class="container">
     <div class="blogpost-grid">
       {#each posts as post (post.link)}
         <BlogpostCard
           mediumLink={post.link}
           blogImage={post.heroImage}
           title={post.title}
           publishDate={post.pubDate}
         />
       {/each}
     </div>
   </section>
   ```

2. Update `src/pages/index.astro` to fetch posts and pass them in:

   ```astro
   ---
   import BlogpostGrid from "../components/BlogpostGrid.svelte";
   import Layout from "../layouts/Layout.astro";
   import { getCollection } from 'astro:content';

   const posts = (await getCollection("medium"))
     .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
     .map(post => {
       if (post.data.heroImage?.startsWith("https://medium.com/_")) {
         post.data.heroImage = undefined;
       }
       return post.data;
     });
   ---

   <Layout title="Blogposts">
     <div class="container">
       <hgroup>
         <h2>Blogposts</h2>
         <p>Read about topics I find interesting on Medium</p>
       </hgroup>
       <BlogpostGrid posts={posts} />
     </div>
   </Layout>
   ```

3. Define a shared `MediumPost` TypeScript type in `src/types.ts` or `src/types/medium.ts` so both Astro and Svelte compile cleanly.

## Phase 5: Layouts

`Layout.astro` can stay as an Astro layout. Update it to import the Svelte versions of `Sidebar` and `Footer`:

```astro
---
import Footer from "../components/Footer.svelte";
import Sidebar from "../components/Sidebar.svelte";
import "../scss/main.scss";
import Head from "./Head.astro";
import { getImage } from "astro:assets";
import headshotSrc from "../assets/profile.jpeg"; // move /public/static/profile.jpeg here if desired

const { title } = Astro.props;

const optimisedHeadshot = await getImage({
  src: headshotSrc,
  width: 250,
  height: 250,
  format: "webp",
});
---
```

Keep the inline theme script in the layout (it runs before Svelte hydrates). Pass `currentPage={Astro.url.pathname}` and the optimised headshot URL to `<Sidebar />`:

```astro
<Sidebar currentPage={Astro.url.pathname} headshotSrc={optimisedHeadshot.src} />
```

> If you prefer to keep `profile.jpeg` in `public/`, import it via `import headshotSrc from "/static/profile.jpeg";` or reference it as a public URL. `getImage()` works best with assets under `src/`, so consider moving the headshot to `src/assets/profile.jpeg` during this migration.

`Astrobook.astro` should be deleted once Storybook is operational.

## Phase 6: Remove Astrobook

1. Uninstall `astrobook`:
   ```bash
   pnpm remove astrobook
   ```

2. Remove from `astro.config.mjs`:
   - Remove the `astrobook` integration and its conditional dev-only logic.
   - Remove the `excludeUiPages` custom integration and the `/pages/ui/` UI preview pages.

3. Delete the following files/directories:
   - `src/components/stories/`
   - `src/components/helpers/ResponsiveWrapper.astro`
   - `src/layouts/Astrobook.astro`
   - `src/pages/ui/`

4. In Storybook, use the **Viewport addon** to replace the responsive iframe behavior that `ResponsiveWrapper` provided.

## Phase 7: Storybook stories

Replace Astrobook stories with Storybook stories. Examples:

### `BlogpostCard.stories.ts`

```ts
import type { Meta, StoryObj } from '@storybook/svelte';
import BlogpostCard from '../components/BlogpostCard.svelte';

const meta: Meta<typeof BlogpostCard> = {
  component: BlogpostCard,
};

export default meta;

type Story = StoryObj<typeof BlogpostCard>;

export const WithImage: Story = {
  args: {
    mediumLink: 'https://medium.com/@edward-heaver/test',
    title: 'Protocols: Structural vs Dynamic types in Python',
    publishDate: new Date('2023-11-08T18:31:04.000Z'),
    blogImage: 'https://cdn-images-1.medium.com/v2/resize:fit:768/1*9ViRQy8dtpOQ3GZ-bLgmPw.png',
  },
};

export const FallbackImage: Story = {
  args: {
    mediumLink: 'https://medium.com/@edward-heaver/test',
    title: 'A post with no hero image',
    publishDate: new Date('2023-11-08T18:31:04.000Z'),
    blogImage: undefined,
  },
};
```

### `Sidebar.stories.ts`

```ts
import type { Meta, StoryObj } from '@storybook/svelte';
import Sidebar from '../components/Sidebar.svelte';

const meta: Meta<typeof Sidebar> = {
  component: Sidebar,
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {
    currentPage: '/',
  },
};
```

Create equivalent stories for `SocialButtons`, `Footer`, and `BlogpostGrid`.

## Phase 8: Cleanup & verification

1. Remove the old `.astro` component files after confirming the `.svelte` replacements are used everywhere.
2. Run the dev server:
   ```bash
   pnpm dev
   ```
3. Run Storybook:
   ```bash
   pnpm storybook
   ```
4. Run a production build to catch Svelte/Astro integration issues and the Sharp image step:
   ```bash
   pnpm build
   ```
5. Update `AGENTS.md`:
   - Remove Astrobook references.
   - Add Storybook notes (commands, story locations).
   - Update component file-extension guidance to `.svelte`.
   - Mention the icon library change.
6. Update `README.md` if it documents component previewing.

## Migration order (recommended)

1. Install Svelte, Storybook, `@iconify/svelte`, and `sharp`.
2. Configure Astro and Storybook preview styles.
3. Convert `FormattedDate` → add story → verify in Storybook.
4. Convert `Footer` → add story.
5. Convert `SocialButtons` → add story.
6. Convert `BlogpostCard` → add story.
7. Convert `Sidebar` → add story.
8. Convert `BlogpostGrid` to Svelte with `posts` prop; move `getCollection` to `index.astro`.
9. Update `Layout.astro` to consume Svelte components.
10. Remove Astrobook, UI pages, ResponsiveWrapper, and old Astro components.
11. Update documentation and run full build.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Svelte component does not hydrate correctly because it relies on `document` at import time. | Only access browser globals inside `onMount` or event handlers. Keep the initial theme script in the Astro layout. |
| Astro `<Image>` optimization is lost in Svelte components. | Acceptable for presentational cards; use standard `<img>`. Continue using `<Image>` in Astro layouts/pages where optimization matters. |
| `astro-icon` SVGs render differently from `@iconify/svelte`. | Verify icon sizing in Storybook and the live site; adjust `width`/`height` props. |
| Pico CSS global styles are missing in Storybook. | Import `src/scss/main.scss` in `.storybook/preview.ts`. |
| Build fails due to missing Sharp. | Install `sharp` as part of Phase 1. |

## Outcome

After completing this plan:

- All reusable UI components are `.svelte` files with Storybook stories.
- Astrobook, `astrobook`, and the dev-only `/pages/ui/` preview pages are removed.
- The site continues to be a static Astro site using Astro content collections and routing.
- Component development and review happens in Storybook (`pnpm storybook`).
- Production builds remain `pnpm build` and deploy as before.
