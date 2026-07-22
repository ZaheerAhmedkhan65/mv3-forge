import { Command } from 'commander';
import picocolors from 'picocolors';
import { outro, select, text, isCancel, cancel } from '@clack/prompts';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';

const TEMPLATES = ['vanilla', 'react', 'vue', 'solid', 'svelte'] as const;
type Template = (typeof TEMPLATES)[number];

interface TemplateContext {
  projectName: string;
  projectDescription: string;
  templateName: Template;
}

const PACKAGE_NAME_REGEX = /^(@[a-z0-9~][a-z0-9._~/-]*\/)?[a-z0-9~][a-z0-9._~/-]*$/;

function isValidProjectName(name: string): boolean {
  return PACKAGE_NAME_REGEX.test(name);
}

// Get the templates directory relative to this compiled JS file
// When bundled: dist/index.js -> templates (1 level up)
// During development: src/index.ts works via monorepo path
function getTemplatesDir(): string {
  try {
    // In production, this file is at packages/cli/dist/index.js
    // Templates are at packages/cli/templates
    const currentFilePath = new URL(import.meta.url).pathname;
    const cliDir = dirname(currentFilePath);
    return join(cliDir, '..', 'templates');
  } catch {
    // Fallback to current working directory (for development)
    return join(process.cwd(), 'templates');
  }
}

async function getAvailableTemplates(dir: string): Promise<Template[]> {
  const templates: Template[] = [];
  try {
    const entries = await fs.readdir(dir);
    for (const entry of entries) {
      const stat = await fs.stat(join(dir, entry));
      if (stat.isDirectory()) {
        templates.push(entry as Template);
      }
    }
  } catch {
    // Templates directory doesn't exist
  }
  return templates;
}

async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function isEmptyDirectory(path: string): Promise<boolean> {
  if (!(await exists(path))) return false;
  const stat = await fs.stat(path);
  if (!stat.isDirectory()) return false;
  const files = await fs.readdir(path);
  return files.length === 0;
}

async function ensureDir(path: string): Promise<void> {
  await fs.mkdir(path, { recursive: true });
}

async function copyDirRecursive(source: string, destination: string): Promise<void> {
  await fs.cp(source, destination, { recursive: true });
}

async function readdirRecursive(dir: string): Promise<string[]> {
  const files: string[] = [];
  const items = await fs.readdir(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      const nestedFiles = await readdirRecursive(fullPath);
      files.push(...nestedFiles.map((f) => join(item, f)));
    } else {
      files.push(item);
    }
  }
  return files;
}

function renderTemplate(content: string, context: TemplateContext): string {
  return content
    .replace(/\{\{projectName\}\}/g, context.projectName)
    .replace(/\{\{projectDescription\}\}/g, context.projectDescription || '')
    .replace(/\{\{templateName\}\}/g, context.templateName);
}

class TemplateManager {
  private templatesDir: string;

  constructor(templatesDir?: string) {
    this.templatesDir = templatesDir || getTemplatesDir();
  }

  async copyTemplate(templateName: Template, targetDir: string, _context: TemplateContext): Promise<void> {
    const templatePath = join(this.templatesDir, templateName);
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
      if (!file.endsWith('.json') && !file.endsWith('.ts') && !file.endsWith('.js') && !file.endsWith('.html') && !file.endsWith('.css')) {
        continue;
      }
      const filePath = join(targetDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const processed = renderTemplate(content, context);
      if (file.endsWith('.json')) {
        const parsed = JSON.parse(processed);
        await fs.writeFile(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
      } else {
        await fs.writeFile(filePath, processed, 'utf-8');
      }
    }
  }
}

const program = new Command();

program
  .name('mv3-forge')
  .description('A CLI tool for creating browser extensions')
  .version('0.1.6');

program
  .command('new <project-name>')
  .description('Create a new browser extension project')
  .option('-t, --template <template>', 'Template to use (vanilla, react, vue, solid, svelte)')
  .action(async (projectName: string, options: { template?: string }) => {
    await createProject(projectName, options.template);
  });

program
  .command('new')
  .description('Create a new browser extension project (interactive mode)')
  .option('-t, --template <template>', 'Template to use (vanilla, react, vue, solid, svelte)')
  .allowExcessArguments(true)
  .action(async (options: { template?: string }) => {
    await createProject(undefined, options.template);
  });

async function createProject(projectName: string | undefined, templateName: string | undefined): Promise<void> {
  console.log(picocolors.inverse(picocolors.bold(' mv3-forge ')));
  console.log();

  let name: string;
  if (projectName) {
    name = projectName;
  } else {
    const result = await text({
      message: 'What is the name of your extension?',
      placeholder: 'my-extension',
      validate: (value: string | undefined) => {
        if (!value) return 'Project name is required';
        if (typeof value === 'string' && !isValidProjectName(value)) return 'Please enter a valid project name';
      },
    });

    if (isCancel(result)) {
      cancel('Operation cancelled');
      process.exit(0);
    }
    name = result as string;
  }

  // Get available templates from disk
  const templatesDir = getTemplatesDir();
  const availableTemplates = await getAvailableTemplates(templatesDir);

  let template: Template | undefined;
  if (templateName) {
    if (availableTemplates.includes(templateName as Template)) {
      template = templateName as Template;
    } else if (TEMPLATES.includes(templateName as Template)) {
      console.error(picocolors.red('✗'), `Template '${templateName}' is not available yet. Coming soon!`);
      process.exit(1);
    } else {
      console.error(picocolors.red('✗'), `Invalid template: ${templateName}`);
      process.exit(1);
    }
  } else {
    // Filter templates to only show available ones
    const availableOptions = TEMPLATES.filter(t => availableTemplates.includes(t)).map((t) => ({
      value: t,
      label: t.charAt(0).toUpperCase() + t.slice(1),
    }));

    const result = await select({
      message: 'Pick a template',
      options: availableOptions,
    });

    if (isCancel(result)) {
      cancel('Operation cancelled');
      process.exit(0);
    }
    template = result as Template;
  }

  if (!template) {
    console.error(picocolors.red('✗'), 'Template selection is required');
    process.exit(1);
  }

  const targetDir = name;
  const context: TemplateContext = {
    projectName: name,
    projectDescription: 'A browser extension built with mv3-forge',
    templateName: template!,
  };

  // Check if target directory exists and is not empty
  if (await exists(targetDir) && !(await isEmptyDirectory(targetDir))) {
    console.error(picocolors.red('✗'), `Directory '${targetDir}' already exists and is not empty`);
    process.exit(1);
  }

  // Create target directory
  await ensureDir(targetDir);
  console.log(picocolors.green('✔'), `Creating project directory: ${targetDir}`);

  // Copy and process template
  const templateManager = new TemplateManager();
  await templateManager.copyTemplate(template!, targetDir, context);
  console.log(picocolors.green('✔'), `Copied template: ${template}`);

  await templateManager.processTemplateFiles(targetDir, context);
  console.log(picocolors.green('✔'), 'Processed template files');

  outro(
    `${picocolors.green('✔')} Project created successfully!

Next steps:
  ${picocolors.dim('cd')} ${name}
  ${picocolors.dim('pnpm')} install
  ${picocolors.dim('pnpm')} dev
`
  );
}

program.parse();