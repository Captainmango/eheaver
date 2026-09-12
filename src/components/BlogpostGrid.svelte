<script lang="ts">
  import BlogpostCard from './BlogpostCard.svelte';
  import type { MediumPost } from '../types';

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

<style lang="scss">
  @use "sass:map";
  @use "@picocss/pico/scss/settings";

  .blogpost-grid {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--pico-spacing);

    @if map.get(settings.$breakpoints, "md") {
      @media (max-width: map.get(map.get(settings.$breakpoints, "md"), "breakpoint")) {
        gap: var(--pico-spacing);
      }
    }
  }
</style>
