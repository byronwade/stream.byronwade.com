"use client";

import { useState } from "react";
import { useReports } from "@/lib/stores/report";
import { useUIStore } from "@/lib/stores/ui";

const REASONS = [
  "Spam or misleading",
  "Harassment or hate speech",
  "Violence or dangerous acts",
  "Sexual content",
  "Copyright violation",
  "Other",
];

interface ReportDialogProps {
  subjectType: "stream" | "user" | "message";
  subjectId: string;
  onClose: () => void;
}

export function ReportDialog({ subjectType, subjectId, onClose }: ReportDialogProps) {
  const [reason, setReason] = useState(REASONS[0]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { submitReport } = useReports();
  const { addToast } = useUIStore();

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    submitReport({ subjectType, subjectId, reason, notes });
    addToast("Report submitted. Our moderation team will review it.");
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="solid-surface space-y-4">
      <p className="text-sm text-text-secondary">
        Reports are stored locally for this demo and appear in Studio moderation.
      </p>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Reason</legend>
        <div className="space-y-2">
          {REASONS.map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="reason"
                value={r}
                checked={reason === r}
                onChange={() => setReason(r)}
                className="focus-ring"
              />
              {r}
            </label>
          ))}
        </div>
      </fieldset>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Additional notes (optional)"
        className="input-field min-h-[80px] resize-y"
        aria-label="Additional notes"
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="btn-primary w-full"
      >
        {submitting ? "Submitting..." : "Submit report"}
      </button>
    </div>
  );
}
