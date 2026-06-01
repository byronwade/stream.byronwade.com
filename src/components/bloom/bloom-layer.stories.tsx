import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BloomLayer } from "@/components/bloom/bloom-layer";

const meta: Meta<typeof BloomLayer> = {
  title: "Bloom/BloomLayer",
  component: BloomLayer,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof BloomLayer>;

export const Open: Story = {
  args: {
    open: true,
    title: "Example panel",
    onClose: () => {},
    children: <p className="text-text-secondary">Bloom panel content with glass styling.</p>,
  },
};
