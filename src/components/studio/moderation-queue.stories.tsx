import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ModerationQueue } from "@/components/studio/moderation-queue";

const meta: Meta<typeof ModerationQueue> = {
  title: "Studio/ModerationQueue",
  component: ModerationQueue,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ModerationQueue>;

export const Default: Story = {};
