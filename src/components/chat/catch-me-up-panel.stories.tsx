import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CatchMeUpPanel } from "@/components/chat/catch-me-up-panel";
import { getFeaturedStream } from "@/lib/data";

const meta: Meta<typeof CatchMeUpPanel> = {
  title: "Chat/CatchMeUpPanel",
  component: CatchMeUpPanel,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof CatchMeUpPanel>;

export const Default: Story = {
  args: {
    stream: getFeaturedStream(),
    currentTime: 2800,
  },
};
