"use client";

import { useReports } from "@/lib/stores/report";
import { useUIStore } from "@/lib/stores/ui";

export function ModerationQueue() {
  const { reports, modActions, blockedTerms, resolveReport, addModAction, addBlockedTerm, removeBlockedTerm } =
    useReports();
  const { addToast } = useUIStore();

  const pending = reports.filter((r) => !r.resolvedAt);

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-3 font-semibold">Report queue ({pending.length})</h3>
        {pending.length === 0 ? (
          <p className="text-sm text-text-tertiary">No pending reports.</p>
        ) : (
          <ul className="space-y-2">
            {pending.map((r) => (
              <li key={r.id} className="solid-surface flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs uppercase text-text-tertiary">{r.subjectType}</span>
                  <p className="text-sm font-medium">{r.reason}</p>
                  <p className="text-xs text-text-secondary">{r.subjectId}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      addModAction({ type: "timeout", target: r.subjectId });
                      resolveReport(r.id);
                      addToast("Timeout applied");
                    }}
                    className="btn-secondary text-xs"
                  >
                    Timeout
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addModAction({ type: "ban", target: r.subjectId });
                      resolveReport(r.id);
                      addToast("Ban applied");
                    }}
                    className="btn-secondary text-xs"
                  >
                    Ban
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resolveReport(r.id);
                      addToast("Report dismissed");
                    }}
                    className="btn-secondary text-xs"
                  >
                    Dismiss
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="mb-3 font-semibold">Actions log</h3>
        <ul className="max-h-40 space-y-1 overflow-y-auto text-sm">
          {modActions.slice(0, 10).map((a) => (
            <li key={a.id} className="text-text-secondary">
              <span className="text-warning">{a.type}</span> → {a.target}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-3 font-semibold">Blocked terms</h3>
        <form
          className="mb-2 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const term = String(fd.get("term") ?? "").trim();
            if (term) {
              addBlockedTerm(term);
              e.currentTarget.reset();
            }
          }}
        >
          <input name="term" placeholder="Add blocked term" className="input-field flex-1" />
          <button type="submit" className="btn-primary">
            Add
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {blockedTerms.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => removeBlockedTerm(t)}
              className="pill-nav text-xs"
            >
              {t} ×
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
