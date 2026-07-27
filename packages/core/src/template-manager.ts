import type { TemplateContext } from './types.js';
import { join } from 'path';
import { promises as fs } from 'fs';
import {
  TemplateType,
  copyDirRecursive,
  readdirRecursive,
  exists,
  resolveTemplatePath,
  getTemplatesDir,
} from '@mv3-forge/shared';

export { TemplateType };
export type { TemplateContext };

export class TemplateManager {
  private templatesDir: string | undefined;

  constructor(templatesDir?: string) {
    this.templatesDir = templatesDir;
  }

  async copyTemplate(templateName: TemplateType, targetDir: string, _context: TemplateContext): Promise<void> {
    const templatePath = this.templatesDir 
      ? join(this.templatesDir, templateName)
      : resolveTemplatePath(templateName);

    if (!(await exists(templatePath))) {
      throw new Error(`Template '${templateName}' not found at ${templatePath}`);
    }

    await copyDirRecursive(templatePath, targetDir);
  }

  async processTemplateFiles(targetDir: string, context: TemplateContext): Promise<void> {
    // First, rename gitignore.template to .gitignore if it exists
    const gitignoreTemplatePath = join(targetDir, 'gitignore.template');
    const gitignorePath = join(targetDir, '.gitignore');
    if (await exists(gitignoreTemplatePath)) {
      await fs.rename(gitignoreTemplatePath, gitignorePath);
    }

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
      .replace(/__PROJECT_NAME__/g, context.projectName)
      .replace(/\{\{projectName\}\}/g, context.projectName)
      .replace(/\{\{projectDescription\}\}/g, context.projectDescription || '')
      .replace(/\{\{templateName\}\}/g, context.templateName);
  }

  async getAvailableTemplates(): Promise<TemplateType[]> {
    const templatesDir = this.templatesDir || getTemplatesDir();
    
    if (!(await exists(templatesDir))) {
      return [];
    }

    const dirs = await fs.readdir(templatesDir);
    const templates: TemplateType[] = [];

    for (const dir of dirs) {
      const dirPath = join(templatesDir, dir);
      const stat = await fs.stat(dirPath);
      if (stat.isDirectory()) {
        templates.push(dir as TemplateType);
      }
    }

    return templates;
  }
}