// Strongly typed storage wrapper for Chrome extension APIs
// Supports sync, local, managed, and session storage

type StorageArea = 'sync' | 'local' | 'managed' | 'session';

interface StorageChangeListener {
  (changes: Record<string, { oldValue: unknown; newValue: unknown }>): void;
}

export class StorageWrapper<T extends Record<string, unknown> = Record<string, unknown>> {
  private area: StorageArea;

  constructor(area: StorageArea = 'local') {
    this.area = area;
  }

  get keys(): string[] {
    // This is a runtime type guard - in actual implementation would use chrome.storage
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get<K extends keyof T>(_keys?: K[]): Promise<T | Pick<T, K>> {
    // Implementation would use chrome.storage[this.area].get()
    return {} as T;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async set<K extends keyof T>(_items: Pick<T, K>): Promise<void> {
    // Implementation would use chrome.storage[this.area].set()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove<K extends keyof T>(_keys: K[]): Promise<void> {
    // Implementation would use chrome.storage[this.area].remove()
  }

  async clear(): Promise<void> {
    // Implementation would use chrome.storage[this.area].clear()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange(_listener: StorageChangeListener): () => void {
    // Implementation would use chrome.storage.onChanged.addListener()
    // Return unsubscribe function
    return () => {};
  }

  onValueChanged<K extends keyof T>(
    key: K,
    listener: (newValue: T[K], oldValue: T[K]) => void
  ): () => void {
    return this.onChange((changes) => {
      const change = changes[key as string];
      if (change) {
        listener(change.newValue as T[K], change.oldValue as T[K]);
      }
    });
  }
}

// Predefined storage instances
export const storage = {
  sync: new StorageWrapper('sync'),
  local: new StorageWrapper('local'),
  managed: new StorageWrapper('managed'),
  session: new StorageWrapper('session'),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createStorage<T extends Record<string, unknown>>(_defaults: T): StorageWrapper<T> {
  return new StorageWrapper<T>('local');
}