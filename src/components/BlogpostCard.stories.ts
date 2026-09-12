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
