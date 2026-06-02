import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GoLiveWizard } from "@/components/creator/go-live-wizard";

const meta: Meta<typeof GoLiveWizard> = {
  title: "Creator/GoLiveWizard",
  component: GoLiveWizard,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof GoLiveWizard>;

export const Default: Story = {};
