import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReportDialog } from "@/components/stream/report-dialog";

const meta: Meta<typeof ReportDialog> = {
  title: "Stream/ReportDialog",
  component: ReportDialog,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ReportDialog>;

export const ReportStream: Story = {
  args: {
    subjectType: "stream",
    subjectId: "stream_001",
    onClose: () => {},
  },
};

export const ReportMessage: Story = {
  args: {
    subjectType: "message",
    subjectId: "msg_123",
    onClose: () => {},
  },
};
