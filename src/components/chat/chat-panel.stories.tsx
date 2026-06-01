import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChatPanel } from "@/components/chat/chat-panel";
import type { ChatMessage } from "@/lib/types";

const sampleMessages: ChatMessage[] = [
  {
    id: "m1",
    streamId: "s1",
    authorId: "p1",
    authorName: "PixelPioneer",
    authorRole: "viewer",
    text: "This build looks incredible!",
    sentAt: new Date().toISOString(),
    sentiment: "positive",
    flags: { pinned: false, question: false, deleted: false, reported: false },
  },
  {
    id: "m2",
    streamId: "s1",
    authorId: "p2",
    authorName: "ModMaven",
    authorRole: "moderator",
    text: "Poll is open — vote for roof style!",
    sentAt: new Date().toISOString(),
    sentiment: "neutral",
    flags: { pinned: true, question: false, deleted: false, reported: false },
  },
];

const meta: Meta<typeof ChatPanel> = {
  title: "Chat/ChatPanel",
  component: ChatPanel,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="h-[32rem] max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatPanel>;

export const Default: Story = {
  args: {
    messages: sampleMessages,
    healthScore: 94,
  },
};
