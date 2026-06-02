import { describe, it, expect, beforeEach } from "vitest";
import { createStore } from "../stores/base";
import { maskBlockedTerms } from "../mock/simulators";

describe("maskBlockedTerms (chat / report blocked terms)", () => {
  it("returns text unchanged when there are no terms", () => {
    expect(maskBlockedTerms("hello world", [])).toBe("hello world");
  });

  it("masks a whole word case-insensitively and preserves length", () => {
    expect(maskBlockedTerms("That is SPAM here", ["spam"])).toBe("That is **** here");
  });

  it("does not mask substrings inside other words", () => {
    expect(maskBlockedTerms("classic glass", ["ass"])).toBe("classic glass");
  });

  it("masks multiple distinct terms", () => {
    expect(maskBlockedTerms("buy gold now", ["buy", "gold"])).toBe("*** **** now");
  });

  it("ignores empty / whitespace-only terms", () => {
    expect(maskBlockedTerms("keep this", ["", "  "])).toBe("keep this");
  });
});

describe("createStore (machinery behind reminder/clip/report stores)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("exposes the default value via getSnapshot", () => {
    const store = createStore("stream:test:default", { count: 0 });
    expect(store.getSnapshot()).toEqual({ count: 0 });
  });

  it("updates state with a plain value and persists to localStorage", () => {
    const store = createStore("stream:test:value", { count: 0 });
    store.setState({ count: 5 });
    expect(store.getSnapshot()).toEqual({ count: 5 });
    expect(JSON.parse(localStorage.getItem("stream:test:value")!)).toEqual({ count: 5 });
  });

  it("updates state with an updater function", () => {
    const store = createStore("stream:test:updater", { count: 1 });
    store.setState((prev) => ({ count: prev.count + 1 }));
    expect(store.getSnapshot()).toEqual({ count: 2 });
  });

  it("notifies subscribers on change and stops after unsubscribe", () => {
    const store = createStore("stream:test:sub", 0);
    let calls = 0;
    const unsub = store.subscribe(() => {
      calls += 1;
    });
    store.setState(1);
    store.setState(2);
    expect(calls).toBe(2);
    unsub();
    store.setState(3);
    expect(calls).toBe(2);
  });

  it("hydrate() reloads state from localStorage (cross-tab sync)", () => {
    const store = createStore("stream:test:hydrate", { v: "a" });
    localStorage.setItem("stream:test:hydrate", JSON.stringify({ v: "b" }));
    store.hydrate();
    expect(store.getSnapshot()).toEqual({ v: "b" });
  });

  it("supports the reminder toggle pattern (add + dedupe-remove by key)", () => {
    interface R {
      id: string;
      streamId?: string;
    }
    const store = createStore<R[]>("stream:test:reminders", []);
    const has = (id: string) => store.getSnapshot().some((r) => r.streamId === id);

    store.setState((prev) => [{ id: "r1", streamId: "s1" }, ...prev]);
    expect(has("s1")).toBe(true);

    // toggling the same key off removes it
    store.setState((prev) => prev.filter((r) => r.streamId !== "s1"));
    expect(has("s1")).toBe(false);
  });

  it("supports the report chat-controls reducer pattern", () => {
    interface ReportState {
      blockedTerms: string[];
      chatControls: { slowMode: boolean; followersOnly: boolean; clearedAt: string | null };
    }
    const store = createStore<ReportState>("stream:test:reports", {
      blockedTerms: [],
      chatControls: { slowMode: false, followersOnly: false, clearedAt: null },
    });

    store.setState((prev) => ({ ...prev, blockedTerms: [...prev.blockedTerms, "spam"] }));
    store.setState((prev) => ({
      ...prev,
      chatControls: { ...prev.chatControls, slowMode: !prev.chatControls.slowMode },
    }));

    expect(store.getSnapshot().blockedTerms).toContain("spam");
    expect(store.getSnapshot().chatControls.slowMode).toBe(true);
  });
});
