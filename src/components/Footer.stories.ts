import type { Meta, StoryObj } from '@storybook/svelte';
import Footer from '../components/Footer.svelte';

const meta: Meta<typeof Footer> = {
  component: Footer,
};

export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
