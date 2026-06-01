type Listener = () => void;

function createStore<T>(key: string, defaultValue: T) {
  let state = defaultValue;
  const listeners = new Set<Listener>();

  function load(): T {
    if (typeof window === "undefined") return defaultValue;
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
    } catch {
      /* ignore */
    }
    return defaultValue;
  }

  if (typeof window !== "undefined") {
    state = load();
  }

  return {
    getSnapshot: () => state,
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setState: (updater: T | ((prev: T) => T)) => {
      state = typeof updater === "function" ? (updater as (prev: T) => T)(state) : updater;
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(state));
      }
      listeners.forEach((l) => l());
    },
    hydrate: () => {
      state = load();
      listeners.forEach((l) => l());
    },
  };
}

export { createStore };
