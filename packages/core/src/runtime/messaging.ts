// Unified messaging layer between extension contexts
// Request-response abstraction with type safety

export type MessageTarget = 'background' | 'popup' | 'content' | 'options' | 'devtools' | 'sidepanel';

export interface MessageRequest<T = unknown> {
  type: string;
  target: MessageTarget;
  data: T;
  id?: string;
}

export interface MessageResponse<T = unknown> {
  id?: string;
  success: boolean;
  data?: T;
  error?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageHandler<T = any> = (request: T, sender: unknown) => MessageResponse | Promise<MessageResponse>;

export class MessageBroker {
  private handlers: Map<string, MessageHandler> = new Map();

  on(type: string, handler: MessageHandler): void {
    this.handlers.set(type, handler);
  }

  off(type: string): void {
    this.handlers.delete(type);
  }

  async send<T>(_type: string, _data: unknown = {}): Promise<T> {
    return new Promise((resolve) => {
      // Implementation would use chrome.runtime.sendMessage
      resolve({} as T);
    });
  }

  async sendToTab<T>(_tabId: number, _type: string, _data: unknown = {}): Promise<T> {
    return new Promise((resolve) => {
      // Implementation would use chrome.tabs.sendMessage
      resolve({} as T);
    });
  }
}

export const broker = new MessageBroker();

// Typed message helpers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createMessageHandler<T extends Record<string, MessageHandler>>(handlers: T): T {
  const broker = new MessageBroker();
  for (const [type, handler] of Object.entries(handlers)) {
    broker.on(type, handler);
  }
  return handlers;
}