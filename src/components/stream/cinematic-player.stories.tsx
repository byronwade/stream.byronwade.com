import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { getFeaturedStream, getAllStreams } from "@/lib/data";
import { CinematicPlayer } from "@/components/stream/cinematic-player";

const meta: Meta<typeof CinematicPlayer> = {
  title: "Stream/CinematicPlayer",
  component: CinematicPlayer,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CinematicPlayer>;

export const Live: Story = {
  args: { stream: getFeaturedStream() },
};

export const Scheduled: Story = {
  args: { stream: getAllStreams().find((s) => s.state === "scheduled") ?? getFeaturedStream() },
};

export const EndedVod: Story = {
  args: { stream: getAllStreams().find((s) => s.state === "ended") ?? getFeaturedStream() },
};
