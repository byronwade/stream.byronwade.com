import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DashboardGrid } from "@/components/studio/dashboard-grid";

const widgets = [
  { id: "preview", title: "Stream preview", content: <p className="text-sm text-text-secondary">Live preview widget.</p> },
  { id: "chat", title: "Live chat", content: <p className="text-sm text-text-secondary">Chat widget.</p> },
  { id: "queue", title: "Report queue", content: <p className="text-sm text-text-secondary">Pending reports.</p> },
  { id: "actions", title: "Quick actions", content: <p className="text-sm text-text-secondary">Slow mode, clear chat, etc.</p> },
  { id: "blocked-terms", title: "Blocked terms", content: <p className="text-sm text-text-secondary">Masked words in chat.</p> },
];

const meta: Meta<typeof DashboardGrid> = {
  title: "Studio/DashboardGrid",
  component: DashboardGrid,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="section-shell py-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DashboardGrid>;

export const Default: Story = {
  args: { widgets },
};
