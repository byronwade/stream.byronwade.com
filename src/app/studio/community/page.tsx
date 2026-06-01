import { getAllCreators } from "@/lib/data";

export const metadata = { title: "Community" };

export default function StudioCommunityPage() {
  const followers = getAllCreators().slice(0, 5);

  return (
    <div className="section-shell py-8">
      <h2 className="mb-6 text-xl font-bold">Community</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="solid-surface">
          <h3 className="font-semibold">Recent followers</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {followers.map((c) => (
              <li key={c.id} className="flex justify-between">
                <span>{c.displayName}</span>
                <span className="text-text-tertiary">@{c.handle}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="solid-surface">
          <h3 className="font-semibold">Feedback</h3>
          <div className="mt-4 space-y-3 text-sm text-text-secondary">
            <p>&quot;Love the chat vote mechanic!&quot; — viewer</p>
            <p>&quot;Can you do more beginner tutorials?&quot; — new viewer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
