<script lang="ts">
  import { getIcon } from '../lib/icons';

  interface Props {
    icon: string;
    width?: number | string;
  }

  let { icon, width = 24 }: Props = $props();

  const size = $derived(typeof width === 'number' ? width : Number.parseInt(width, 10));
  const iconData = $derived(getIcon(icon));
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  role="img"
  width={size}
  height={size}
  viewBox="0 0 {iconData.width} {iconData.height}"
>
  {@html iconData.body}
</svg>
