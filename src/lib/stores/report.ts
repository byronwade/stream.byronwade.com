"use client";

import { useSyncExternalStore } from "react";
import type { Report } from "@/lib/types";
import { createStore } from "./base";

interface ReportState {
  reports: Report[];
  modActions: Array<{
    id: string;
    type: "timeout" | "ban" | "delete" | "blocked-term";
    target: string;
    createdAt: string;
  }>;
  blockedTerms: string[];
}

const defaultReports: ReportState = { reports: [], modActions: [], blockedTerms: [] };
const reportStore = createStore<ReportState>("stream:v1:reports", defaultReports);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:reports") reportStore.hydrate();
  });
}

export function useReports() {
  const state = useSyncExternalStore(reportStore.subscribe, reportStore.getSnapshot, () => defaultReports);

  return {
    ...state,
    submitReport: (report: Omit<Report, "id" | "createdAt">) => {
      const newReport: Report = {
        ...report,
        id: `report_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      reportStore.setState((prev) => ({ ...prev, reports: [newReport, ...prev.reports] }));
      return newReport;
    },
    resolveReport: (id: string) => {
      reportStore.setState((prev) => ({
        ...prev,
        reports: prev.reports.map((r) =>
          r.id === id ? { ...r, resolvedAt: new Date().toISOString() } : r,
        ),
      }));
    },
    addModAction: (action: Omit<ReportState["modActions"][0], "id" | "createdAt">) => {
      reportStore.setState((prev) => ({
        ...prev,
        modActions: [
          { ...action, id: `mod_${Date.now()}`, createdAt: new Date().toISOString() },
          ...prev.modActions,
        ],
      }));
    },
    addBlockedTerm: (term: string) => {
      reportStore.setState((prev) => ({
        ...prev,
        blockedTerms: [...new Set([...prev.blockedTerms, term.toLowerCase()])],
      }));
    },
    removeBlockedTerm: (term: string) => {
      reportStore.setState((prev) => ({
        ...prev,
        blockedTerms: prev.blockedTerms.filter((t) => t !== term.toLowerCase()),
      }));
    },
  };
}
