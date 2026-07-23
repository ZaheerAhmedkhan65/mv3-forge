import type { Plugin } from 'vite';
import type { ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

export interface HMRPluginOptions {
  entrypoints: string[];
  websocketPort?: number;
}

export function createHMRPlugin(options: HMRPluginOptions = { entrypoints: [] }): Plugin {
  // HMR requires WebSocket server for extension hot reload
  // For now, this plugin provides the infrastructure for future WebSocket integration
  const { entrypoints = [] } = options;
  
  return {
    name: 'mv3-hmr',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      // Add middleware to inject HMR client into extension pages
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = req.url || '';
        
        // Check if this is an extension page request
        const isExtensionPage = entrypoints.some(entry => 
          url.includes(entry) || url === '/' || url === '/index.html'
        );

        if (isExtensionPage && url.endsWith('.html')) {
          // HMR injection handled automatically by Vite
        }

        next();
      });
    },

    handleHotUpdate({ file, server, modules }) {
      // Notify connected extension pages about updates
      const affectedEntrypoint = entrypoints.find(entry => 
        file.includes(entry)
      );

      if (affectedEntrypoint) {
        // Broadcast to WebSocket clients
        server.ws.send({
          type: 'full-reload',
          path: '*',
        });
      }

      return modules;
    },
  };
}