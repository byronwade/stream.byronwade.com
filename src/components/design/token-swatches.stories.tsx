import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const swatches = [
  { name: "bg-canvas", class: "bg-bg-canvas" },
  { name: "bg-stage", class: "bg-bg-stage" },
  { name: "accent-primary", class: "bg-accent-primary" },
  { name: "accent-secondary", class: "bg-accent-secondary" },
  { name: "live", class: "bg-live" },
  { name: "success", class: "bg-success" },
];

function TokenSwatches() {
  return (
    <div className="app-canvas p-8">
      <h2 className="mb-6 text-xl font-bold">Design Tokens</h2>
      <div className="grid grid-cols-3 gap-4">
        {swatches.map((s) => (
          <div key={s.name} className="text-center">
            <div className={`${s.class} mb-2 h-16 rounded-xl border border-border-subtle`} />
            <span className="text-sm text-text-secondary">{s.name}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <span className="pill-nav">pill-nav</span>
        <span className="pill-nav-active">pill-nav-active</span>
        <span className="live-badge">Live</span>
        <button type="button" className="btn-primary">btn-primary</button>
        <button type="button" className="btn-secondary">btn-secondary</button>
      </div>
    </div>
  );
}

const meta: Meta = { title: "Design/Tokens", component: TokenSwatches };
export default meta;
type Story = StoryObj;
export const Default: Story = { render: () => <TokenSwatches /> };
