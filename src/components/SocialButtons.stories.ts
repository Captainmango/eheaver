import type { Meta, StoryObj } from '@storybook/svelte';
import SocialButtons from '../components/SocialButtons.svelte';

const meta: Meta<typeof SocialButtons> = {
  component: SocialButtons,
};

export default meta;

type Story = StoryObj<typeof SocialButtons>;

export const Default: Story = {};
