import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { getFeaturedStream } from "@/lib/data";
import { StreamCard } from "@/components/stream/stream-card";

const meta: Meta<typeof StreamCard> = {
  title: "Stream/StreamCard",
  component: StreamCard,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof StreamCard>;

export const Default: Story = {
  args: { stream: getFeaturedStream(), showReason: true },
};

export const Hero: Story = {
  args: { stream: getFeaturedStream(), density: "hero" },
};
