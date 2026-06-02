type Serialized = string;

interface CacheConfig {
  prefix: string;
  ttl: number;
  storage: "memory" | "localStorage" | "sessionStorage";
}

const memoryStore = new Map<string, { data: Serialized; expiry: number }>();

export function createCache(config: Partial<CacheConfig> = {}) {
  const { prefix = "faas:", ttl = 300_000, storage: storageType = "memory" } = config;

  function getStorage(): Map<string, { data: Serialized; expiry: number }> | Storage | null {
    if (storageType === "memory") return memoryStore;
    if (typeof window === "undefined") return null;
    return storageType === "localStorage" ? localStorage : sessionStorage;
  }

  function storageKey(key: string): string {
    return `${prefix}${key}`;
  }

  function isExpired(item: { data: Serialized; expiry: number }): boolean {
    return Date.now() > item.expiry;
  }

  return {
    get<T>(key: string): T | null {
      const store = getStorage();
      if (!store) return null;
      const skey = storageKey(key);

      if (store instanceof Map) {
        const item = store.get(skey);
        if (!item) return null;
        if (isExpired(item)) {
          store.delete(skey);
          return null;
        }
        return JSON.parse(item.data) as T;
      }

      const raw = store.getItem(skey);
      if (!raw) return null;
      try {
        const item = JSON.parse(raw) as { data: Serialized; expiry: number };
        if (isExpired(item)) {
          store.removeItem(skey);
          return null;
        }
        return JSON.parse(item.data) as T;
      } catch {
        store.removeItem(skey);
        return null;
      }
    },

    set<T>(key: string, data: T, customTtl?: number) {
      const store = getStorage();
      if (!store) return;
      const skey = storageKey(key);
      const expiry = Date.now() + (customTtl ?? ttl);
      const item = JSON.stringify({ data: JSON.stringify(data), expiry });

      if (store instanceof Map) {
        store.set(skey, JSON.parse(item));
      } else {
        store.setItem(skey, item);
      }
    },

    remove(key: string) {
      const store = getStorage();
      if (!store) return;
      const skey = storageKey(key);
      if (store instanceof Map) {
        store.delete(skey);
      } else {
        store.removeItem(skey);
      }
    },

    clear() {
      const store = getStorage();
      if (!store) return;
      if (store instanceof Map) {
        for (const key of store.keys()) {
          if (key.startsWith(prefix)) store.delete(key);
        }
      } else {
        for (let i = store.length - 1; i >= 0; i--) {
          const key = store.key(i);
          if (key && key.startsWith(prefix)) store.removeItem(key);
        }
      }
    },

    invalidateByPattern(pattern: string) {
      const store = getStorage();
      if (!store) return;
      const regex = new RegExp(pattern);

      if (store instanceof Map) {
        for (const key of store.keys()) {
          if (key.startsWith(prefix) && regex.test(key)) store.delete(key);
        }
      } else {
        for (let i = store.length - 1; i >= 0; i--) {
          const key = store.key(i);
          if (key && key.startsWith(prefix) && regex.test(key)) {
            store.removeItem(key);
          }
        }
      }
    },
  };
}

export const appCache = createCache({ prefix: "faas:", storage: "memory" });
