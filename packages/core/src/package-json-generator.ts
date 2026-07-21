import { writeJson } from '@mv3-forge/shared';
import { join } from 'path';

export class PackageJsonGenerator {
    async generate(options: {
        name: string;
        description?: string;
        outputDir: string;
        template: string;
    }): Promise<void> {
        // Base package.json common to all templates
        const packageJson = {
            name: options.name,
            version: '0.1.2',
            description: options.description || 'A browser extension built with mv3-forge',
            type: 'module',
            scripts: this.getTemplateScripts(options.template),
            devDependencies: this.getTemplateDevDependencies(options.template),
        };

        const outputPath = join(options.outputDir, 'package.json');
        await writeJson(outputPath, packageJson);
    }

    private getTemplateScripts(template: string): Record<string, string> {
        const baseScripts: Record<string, string> = {
            build: 'vite build',
            dev: 'vite',
            lint: 'eslint src --fix',
        };

        if (template === 'react') {
            baseScripts.dev = 'vite';
            baseScripts.build = 'vite build';
        } else if (template === 'vue') {
            baseScripts.dev = 'vite';
            baseScripts.build = 'vite build';
        }

        return baseScripts;
    }

    private getTemplateDevDependencies(template: string): Record<string, string> {
        const base: Record<string, string> = {
            vite: '^5.0.0',
            typescript: '^5.0.0',
            '@types/node': '^20.0.0',
        };

        if (template === 'react') {
            Object.assign(base, {
                '@vitejs/plugin-react': '^4.0.0',
                react: '^18.0.0',
                'react-dom': '^18.0.0',
                '@types/react': '^18.0.0',
                '@types/react-dom': '^18.0.0',
            });
        } else if (template === 'vue') {
            Object.assign(base, {
                '@vitejs/plugin-vue': '^5.0.0',
                vue: '^3.0.0',
            });
        }

        return base;
    }
}