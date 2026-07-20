import { Command } from 'commander';
import picocolors from 'picocolors';
import { intro, outro, select, text, isCancel, cancel } from '@clack/prompts';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';

const TEMPLATES = ['vanilla', 'react', 'vue', 'solid', 'svelte'] as const;
type Template = (typeof TEMPLATES)[number];

interface TemplateContext {
  projectName: string;
  projectDescription: string;
  templateName: Template;
}

interface ProjectOptions {
  name: string;
  template: Template;
  description?: string;
}

const PACKAGE_NAME_REGEX = /^(@[a-z0-9~][a-z0-9._~/-]*\/)?[a-z0-9~][a-z0-9._~/-]*$/;

function isValidProjectName(name: string): boolean {
  return PACKAGE_NAME_REGEX.test(name);
}

function getTemplatesDir(): string {
  const currentFilePath = new URL(import.meta.url).pathname;
  let templatesDir = currentFilePath;
  templatesDir = dirname(templatesDir);
  templatesDir = dirname(templatesDir);
  templatesDir = dirname(templatesDir);
  templatesDir = dirname(templatesDir);
  return join(templatesDir, 'templates');
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
  .version('0.1.0')
  .argument('[project-name]', 'Name of the extension project')
  .option('-t, --template <template>', 'Template to use (vanilla, react, vue, solid, svelte)')
  .action(async (projectName: string | undefined, options: { template?: string }) => {
    await createProject(projectName, options.template);
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

  let template: Template;
  if (templateName) {
    if (TEMPLATES.includes(templateName as Template)) {
      template = templateName as Template;
    } else {
      console.error(picocolors.red('✗'), `Invalid template: ${templateName}`);
      process.exit(1);
    }
  } else {
    const result = await select({
      message: 'Pick a template',
      options: TEMPLATES.map((t) => ({
        value: t,
        label: t.charAt(0).toUpperCase() + t.slice(1),
      })),
    });

    if (isCancel(result)) {
      cancel('Operation cancelled');
      process.exit(0);
    }
    template = result as Template;
  }

  const targetDir = name;
  const context: TemplateContext = {
    projectName: name,
    projectDescription: 'A browser extension built with mv3-forge',
    templateName: template,
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
  await templateManager.copyTemplate(template, targetDir, context);
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