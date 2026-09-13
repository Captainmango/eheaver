<script lang="ts">
  import InlineIcon from './InlineIcon.svelte';
  import { toggleTheme } from '../lib/theme.ts';
</script>

<div class="wrapper">
  <button id="theme-toggle" type="button" aria-label="Toggle theme" onclick={toggleTheme}>
    <span class="sun-icon"><InlineIcon icon="lucide:sun" width={28} /></span>
    <span class="moon-icon"><InlineIcon icon="lucide:moon" width={28} /></span>
  </button>
  <span class="socials-border"></span>
  <ul class="socials">
    <li><a href="https://github.com/Captainmango" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><InlineIcon icon="fa6-brands:github" width={28} /></a></li>
    <li><a href="https://www.linkedin.com/in/edward-heaver-9ba556a0/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><InlineIcon icon="fa6-brands:linkedin-in" width={28} /></a></li>
    <li><a href="https://x.com/EdwardHeaver6" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"><InlineIcon icon="fa6-brands:x-twitter" width={28} /></a></li>
  </ul>
</div>

<style lang="scss">
  .wrapper {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    width: 22ch;

    & > button {
      display: block;
      align-self: center;
      width: 48px;
      height: 50px;
      padding: 10px;
      margin: 0;
      background: none;
      border: none;
      border-radius: 0;
      box-shadow: none;
      cursor: pointer;
      color: var(--pico-primary);
      line-height: 30px;
      transition: color 0.2s ease-in-out;

      &:hover {
        color: var(--pico-primary-hover);
      }
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

  .socials-border {
    z-index: 999;
    border-right: solid 2px var(--pico-color);
    margin-right: 1rem;
    margin-left: 0.25rem;
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
