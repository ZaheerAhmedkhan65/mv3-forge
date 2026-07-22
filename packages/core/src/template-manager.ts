import { copyDirRecursive, exists, readdirRecursive } from '@mv3-forge/shared';
import { TemplateContext } from './types.js';
import { Template } from '@mv3-forge/shared';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';

export class TemplateManager {
  private templatesDir: string;

  constructor(templatesDir?: string) {
    this.templatesDir = templatesDir || this.getDefaultTemplatesDir();
  }

  private getDefaultTemplatesDir(): string {
    // Navigate up from /packages/core/dist to /templates
    // import.meta.url is: file:///path/to/packages/core/dist/index.mjs
    const currentFilePath = new URL(import.meta.url).pathname;
    // Go up 3 levels: /packages/core/dist/index.mjs -> /packages/core -> packages -> monorepo root -> templates
    let templatesDir = currentFilePath;
    // Remove the filename (index.mjs)
    templatesDir = dirname(templatesDir);
    // Remove /dist
    templatesDir = dirname(templatesDir);
    // Remove /core (packages/core)
    templatesDir = dirname(templatesDir);
    // Remove /packages
    templatesDir = dirname(templatesDir);
    // Now we're at the monorepo root, add templates
    return join(templatesDir, 'templates');
  }

  async copyTemplate(templateName: Template, targetDir: string, _context: TemplateContext): Promise<void> {
    const templatePath = join(this.templatesDir, templateName);

    if (!(await exists(templatePath))) {
      throw new Error(`Template '${templateName}' not found at ${templatePath}`);
    }

    await copyDirRecursive(templatePath, targetDir);
  }

  async processTemplateFiles(targetDir: string, context: TemplateContext): Promise<void> {
    const files = await readdirRecursive(targetDir);

    for (const file of files) {
      if (!file.endsWith('.json') && !file.endsWith('.ts') && !file.endsWith('.tsx') && !file.endsWith('.js') && !file.endsWith('.html') && !file.endsWith('.css')) {
        continue;
      }
      const filePath = join(targetDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const processed = this.renderTemplate(content, context);

      // Determine if we should write as JSON or as plain text
      if (file.endsWith('.json')) {
        const parsed = JSON.parse(processed);
        await fs.writeFile(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
      } else {
        await fs.writeFile(filePath, processed, 'utf-8');
      }
    }
  }

  private renderTemplate(content: string, context: TemplateContext): string {
    return content
      .replace(/\{\{projectName\}\}/g, context.projectName)
      .replace(/\{\{projectDescription\}\}/g, context.projectDescription || '')
      .replace(/\{\{templateName\}\}/g, context.templateName);
  }

  async getAvailableTemplates(): Promise<Template[]> {
    const templates: Template[] = [];

    if (!(await exists(this.templatesDir))) {
      return templates;
    }

    const dirs = await fs.readdir(this.templatesDir);

    for (const dir of dirs) {
      const dirPath = join(this.templatesDir, dir);
      const stat = await fs.stat(dirPath);
      if (stat.isDirectory()) {
        templates.push(dir as Template);
      }
    }

    return templates;
  }
}