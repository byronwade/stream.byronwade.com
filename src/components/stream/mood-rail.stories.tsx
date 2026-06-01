import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MoodRail } from "@/components/stream/mood-rail";

const meta: Meta<typeof MoodRail> = {
  title: "Stream/MoodRail",
  component: MoodRail,
};

export default meta;
type Story = StoryObj<typeof MoodRail>;

export const Default: Story = {
  args: { selected: "chill" },
};
