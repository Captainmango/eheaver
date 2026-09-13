<script lang="ts">
  import InlineIcon from './InlineIcon.svelte';
  import SocialButtons from './SocialButtons.svelte';

  interface Props {
    currentPage: string;
    headshotSrc: string;
  }

  let { currentPage, headshotSrc }: Props = $props();

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
  <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
  <label id="mobile-nav-button" for="nav-state" role="button" class="outline secondary" aria-label="Toggle navigation">
    <b><InlineIcon icon="lucide:menu" width={28} /></b>
  </label>
  <label for="nav-state" id="overlay"></label>
  <nav id="sidebar" class="closed">
    <div>
      <div class="header">
        <img class="headshot" src={headshotSrc} alt="Edward Heaver headshot" width="250" height="250" loading="eager" decoding="async" />
      </div>
      <hgroup>
        <h3>Edward Heaver</h3>
        <p class="job-title">Senior Backend Engineer</p>
      </hgroup>
    </div>
    <ul class="nav-list">
      {#each navItems as item}
        <li class={isActive(item) ? 'active' : ''}>
          <a href={item.href} data-nav-link>
            <InlineIcon icon={item.icon} width={28} />
            <span>{item.label}</span>
          </a>
        </li>
      {/each}
    </ul>
    <div class="socials">
      <SocialButtons />
    </div>
  </nav>
</aside>

<style lang="scss">
  @use "sass:map";
  @use "@picocss/pico/scss/settings";

  #nav-container {
    position: relative;
    grid-area: sidebar;
    padding-left: var(--pico-spacing);
  }

  #mobile-nav-button {
    position: fixed;
    top: var(--pico-spacing);
    right: 0;
    margin-right: var(--pico-spacing);
    display: none;
    padding: calc(var(--pico-form-element-spacing-vertical) - 4px) calc(var(--pico-form-element-spacing-horizontal) - 4px);
    z-index: 1000;

    @media (max-width: map.get(map.get(settings.$breakpoints, "lg"), "breakpoint")) {
      display: block;
    }
  }

  :global([data-theme='dark']) #sidebar {
    background-color: #181C25;
  }

  :global([data-theme='dark']) .header {
    background-color: #2a2f3a;
  }

  #sidebar {
    padding-top: var(--pico-spacing);
    box-sizing: border-box;
    height: 100vh;
    width: clamp(280px, 17%, 300px);
    position: fixed;
    inset: 0 auto 0 0;
    align-self: start;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 999;
    background-color: #EFF1F4;
    transition: transform 0.5s ease-out;

    & ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: nowrap;
      width: 22ch;

      & a {
        color: var(--pico-dark);
        text-decoration: none;
      }

      & li {
        display: flex;
        align-items: center;
        width: 100px;

        & a {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        & :global(svg) {
          padding-right: 8px;
        }

        & :hover {
          color: var(--pico-primary);
        }
      }

      & li.active a {
        background-color: rgba($color: var(--pico-primary), $alpha: 5.0);
        color: var(--pico-color);
        font-weight: bold;
      }
    }

    & div:last-child {
      margin-top: auto;
    }
  }

  .closed {
    @media (max-width: map.get(map.get(settings.$breakpoints, "lg"), "breakpoint")) {
      transform: translateX(-200%);
    }
  }

  #nav-state:checked ~ #sidebar {
    transform: translateX(0);
  }

  #overlay {
    transition: all 0.5s ease;
  }

  #nav-state:checked ~ #overlay {
    position: fixed;
    backdrop-filter: blur(4px);
    height: 100%;
    width: 100%;
    inset: 0 0 auto auto;
    z-index: 998;
  }

  .header {
    width: clamp(180px, 18vw, 250px);
    height: clamp(180px, 18vw, 250px);
    flex-shrink: 0;
    background-color: #e0e0e0;
    border-radius: 5%;
    overflow: hidden;
  }

  .headshot {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    display: block !important;
  }

  hgroup {
    padding-top: var(--pico-spacing);
  }

  .job-title {
    width: 20ch;
  }

  .socials {
    padding-bottom: 1rem;

    @media (max-width: map.get(map.get(settings.$breakpoints, "lg"), "breakpoint")) {
      padding-bottom: 2rem;
    }
  }
</style>
