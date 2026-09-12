import type { Meta, StoryObj } from '@storybook/svelte';
import Sidebar from '../components/Sidebar.svelte';
import headshotSrc from '../assets/profile.jpeg';

const meta: Meta<typeof Sidebar> = {
  component: Sidebar,
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {
    currentPage: '/',
    headshotSrc,
  },
};

export const AboutPage: Story = {
  args: {
    currentPage: '/about',
    headshotSrc,
  },
};
