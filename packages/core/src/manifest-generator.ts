import { Manifest } from './types.js';
import { writeJson } from '@mv3-forge/shared';
import { join } from 'path';

export class ManifestGenerator {
    async generate(options: {
        name: string;
        description?: string;
        version?: string;
        outputDir: string;
    }): Promise<Manifest> {
        const manifest: Manifest = {
            manifest_version: 3,
            name: options.name,
            version: options.version || '1.0.0',
            description: options.description || `A browser extension built with mv3-forge`,
            icons: {
                '16': 'icons/icon16.png',
                '32': 'icons/icon32.png',
                '48': 'icons/icon48.png',
                '128': 'icons/icon128.png',
            },
            action: {
                default_popup: 'popup.html',
                default_title: options.name,
            },
            background: {
                service_worker: 'background.js',
                type: 'module',
            },
            content_scripts: [
                {
                    matches: ['<all_urls>'],
                    js: ['content.js'],
                },
            ],
            permissions: ['storage', 'activeTab'],
            host_permissions: ['<all_urls>'],
        };

        const outputPath = join(options.outputDir, 'manifest.json');
        await writeJson(outputPath, manifest);

        return manifest;
    }
}