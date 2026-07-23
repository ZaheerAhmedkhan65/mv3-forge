// Centralized mock implementation of Chrome APIs for testing
// Compatible with Vitest and Jest

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MockFn = (...args: any[]) => any;

export interface MockStorageArea {
  get: MockFn;
  set: MockFn;
  remove: MockFn;
  clear: MockFn;
}

export interface MockChromeAPI {
  storage: {
    local: MockStorageArea;
    sync: MockStorageArea;
    managed: MockStorageArea;
    session: MockStorageArea;
    onChanged: {
      addListener: MockFn;
      removeListener: MockFn;
    };
  };
  runtime: {
    sendMessage: MockFn;
    onMessage: {
      addListener: MockFn;
    };
    getURL: MockFn;
    openOptionsPage: MockFn;
  };
  tabs: {
    query: MockFn;
    sendMessage: MockFn;
    create: MockFn;
  };
}

// Simple mock function factory
function createMock(): MockFn {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return (() => {}) as MockFn;
}

export function createMockChrome(): MockChromeAPI {
  return {
    storage: {
      local: {
        get: createMock(),
        set: createMock(),
        remove: createMock(),
        clear: createMock(),
      },
      sync: {
        get: createMock(),
        set: createMock(),
        remove: createMock(),
        clear: createMock(),
      },
      managed: {
        get: createMock(),
        set: createMock(),
        remove: createMock(),
        clear: createMock(),
      },
      session: {
        get: createMock(),
        set: createMock(),
        remove: createMock(),
        clear: createMock(),
      },
      onChanged: {
        addListener: createMock(),
        removeListener: createMock(),
      },
    },
    runtime: {
      sendMessage: createMock(),
      onMessage: {
        addListener: createMock(),
      },
      getURL: createMock() as MockFn,
      openOptionsPage: createMock(),
    },
    tabs: {
      query: createMock(),
      sendMessage: createMock(),
      create: createMock(),
    },
  };
}

export const mockChrome = createMockChrome();