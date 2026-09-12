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
      <a id="theme-toggle" href="/" onclick={toggleTheme}>
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
  .wrapper {
    position: relative;
    list-style: none;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    width: 22ch;

    & li {
      list-style: none;
      align-self: center;
    }
  }

  .socials {
    list-style: none;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;

    & li {
      list-style: none;
      align-self: center;
    }
  }

  .socials-boarder {
    z-index: 999;
    border-right: solid 2px var(--pico-color);
    margin-right: 0.75rem;
    opacity: 60%;
    height: 1.5rem;
    align-self: center;
  }

  .sun-icon,
  .moon-icon {
    display: none;
  }

  :global([data-theme='dark']) .sun-icon {
    display: inline;
  }

  :global([data-theme='light']) .moon-icon {
    display: inline;
  }
</style>
