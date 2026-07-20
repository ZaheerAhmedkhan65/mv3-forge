import { Logger, exists, isDirectory, isEmptyDirectory, ensureDir } from '@extension-forge/shared';
import { TemplateManager } from './template-manager.js';
import { ManifestGenerator } from './manifest-generator.js';
import { PackageJsonGenerator } from './package-json-generator.js';
import type { ProjectOptions, TemplateContext } from './types.js';
import { join } from 'path';

const logger = new Logger();

export class ProjectCreator {
  private templateManager: TemplateManager;
  private manifestGenerator: ManifestGenerator;
  private packageJsonGenerator: PackageJsonGenerator;

  constructor() {
    this.templateManager = new TemplateManager();
    this.manifestGenerator = new ManifestGenerator();
    this.packageJsonGenerator = new PackageJsonGenerator();
  }

  async create(options: ProjectOptions): Promise<void> {
    const targetDir = options.targetDir || options.name;
    const context: TemplateContext = {
      projectName: options.name,
      projectDescription: options.description || 'A browser extension built with extension-forge',
      templateName: options.template,
    };

    // Check if target directory exists and is not empty
    if (await exists(targetDir) && !(await isEmptyDirectory(targetDir))) {
      throw new Error(`Directory '${targetDir}' already exists and is not empty`);
    }

    // Create target directory
    await ensureDir(targetDir);
    logger.success(`Creating project directory: ${targetDir}`);

    // Copy template
    await this.templateManager.copyTemplate(
      options.template as any,
      targetDir,
      context
    );
    logger.success(`Copied template: ${options.template}`);

    // Process template files (replace placeholders)
    await this.templateManager.processTemplateFiles(targetDir, context);
    logger.success('Processed template files');
  }
}