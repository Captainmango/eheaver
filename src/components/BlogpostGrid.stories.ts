import type { Meta, StoryObj } from '@storybook/svelte';
import BlogpostGrid from '../components/BlogpostGrid.svelte';

const meta: Meta<typeof BlogpostGrid> = {
  component: BlogpostGrid,
};

export default meta;

type Story = StoryObj<typeof BlogpostGrid>;

export const Default: Story = {
  args: {
    posts: [
      {
        link: 'https://medium.com/@edward-heaver/protocols',
        title: 'Protocols: Structural vs Dynamic types in Python',
        pubDate: new Date('2023-11-08T18:31:04.000Z'),
        heroImage: 'https://cdn-images-1.medium.com/v2/resize:fit:768/1*9ViRQy8dtpOQ3GZ-bLgmPw.png',
      },
      {
        link: 'https://medium.com/@edward-heaver/no-image',
        title: 'A post with no hero image',
        pubDate: new Date('2023-10-01T12:00:00.000Z'),
      },
      {
        link: 'https://medium.com/@edward-heaver/another',
        title: 'Another interesting blogpost',
        pubDate: new Date('2023-09-15T09:30:00.000Z'),
        heroImage: 'https://cdn-images-1.medium.com/v2/resize:fit:768/1*9ViRQy8dtpOQ3GZ-bLgmPw.png',
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    posts: [],
  },
};
