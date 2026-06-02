import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { getFeaturedStream } from "@/lib/data";
import { ClipComposer } from "@/components/stream/clip-composer";

const meta: Meta<typeof ClipComposer> = {
  title: "Stream/ClipComposer",
  component: ClipComposer,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="bloom-panel max-w-lg">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ClipComposer>;

export const Default: Story = {
  args: {
    stream: getFeaturedStream(),
    currentTime: 120,
    onClose: () => {},
  },
};
