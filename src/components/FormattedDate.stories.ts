import type { Meta, StoryObj } from '@storybook/svelte';
import FormattedDate from '../components/FormattedDate.svelte';

const meta: Meta<typeof FormattedDate> = {
  component: FormattedDate,
};

export default meta;

type Story = StoryObj<typeof FormattedDate>;

export const Default: Story = {
  args: {
    date: new Date('2023-11-08T18:31:04.000Z'),
  },
};
