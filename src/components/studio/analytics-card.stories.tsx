import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnalyticsCard } from "@/components/studio/analytics-card";

const meta: Meta<typeof AnalyticsCard> = {
  title: "Studio/AnalyticsCard",
  component: AnalyticsCard,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof AnalyticsCard>;

export const Default: Story = {
  args: {
    label: "Live viewers",
    value: 842,
    delta: "+12%",
    chartData: [100, 95, 88, 82, 78, 75, 72, 70],
  },
};
