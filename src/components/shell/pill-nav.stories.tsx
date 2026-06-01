import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PillNav } from "@/components/shell/pill-nav";

const meta: Meta<typeof PillNav> = {
  title: "Shell/PillNav",
  component: PillNav,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof PillNav>;

export const Default: Story = {
  args: {
    items: [
      { key: "a", label: "Browse", href: "#" },
      { key: "b", label: "Following", href: "#" },
      { key: "c", label: "Clips", href: "#" },
    ],
    activeKey: "a",
  },
};
