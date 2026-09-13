<script lang="ts">
  import { getIconData, iconToSVG } from '@iconify/utils';
  import { icons as lucideIcons } from '@iconify-json/lucide';
  import { icons as fa6BrandsIcons } from '@iconify-json/fa6-brands';

  interface Props {
    icon: string;
    width?: number | string;
  }

  type IconCollection = typeof lucideIcons;

  const collections: Record<string, IconCollection> = {
    lucide: lucideIcons,
    'fa6-brands': fa6BrandsIcons,
  };

  let { icon, width = 24 }: Props = $props();

  const size = $derived(typeof width === 'number' ? width : Number.parseInt(width, 10));
  const svg = $derived.by(() => {
    const [prefix, name] = icon.split(':');

    if (!prefix || !name) {
      throw new Error(`Invalid icon name: ${icon}`);
    }

    const collection = collections[prefix];

    if (!collection) {
      throw new Error(`Unknown icon prefix: ${prefix}`);
    }

    const data = getIconData(collection, name);

    if (!data) {
      throw new Error(`Unknown icon: ${icon}`);
    }

    return iconToSVG(data);
  });
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  role="img"
  width={size}
  height={size}
  viewBox={svg.attributes.viewBox}
>
  {@html svg.body}
</svg>
