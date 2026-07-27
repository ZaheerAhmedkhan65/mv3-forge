import { Command } from 'commander';
import picocolors from 'picocolors';
import { outro, select, text, isCancel, cancel } from '@clack/prompts';
import { promises as fs } from 'fs';
import { join } from 'path';
import {
  TEMPLATE_REGISTRY,
  TemplateType,
  getAvailableTemplates,
  resolveTemplatePath,
  copyDirRecursive,
  readdirRecursive,
  exists,
  isEmptyDirectory,
  ensureDir,
} from '@mv3-forge/shared';

interface TemplateContext {
  projectName: string;
  projectDescription: string;
  templateName: TemplateType;
}

const PACKAGE_NAME_REGEX = /^(@[a-z0-9~][a-z0-9._~/-]*\/)?[a-z0-9~][a-z0-9._~/-]*$/;

function isValidProjectName(name: string): boolean {
  return PACKAGE_NAME_REGEX.test(name);
}

function renderTemplate(content: string, context: TemplateContext): string {
  return content
    .replace(/__PROJECT_NAME__/g, context.projectName)
    .replace(/\{\{projectName\}\}/g, context.projectName)
    .replace(/\{\{projectDescription\}\}/g, context.projectDescription || '')
    .replace(/\{\{templateName\}\}/g, context.templateName);
}

class TemplateManager {
  async copyTemplate(templateName: TemplateType, targetDir: string, _context: TemplateContext): Promise<void> {
    const templatePath = resolveTemplatePath(templateName);

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
  .version('0.1.9');

program
  .command('new <project-name>')
  .description('Create a new browser extension project')
  .option('-t, --template <template>', 'Template to use (vanilla, react, vue, solid, svelte)')
  .action(async (projectName: string, options: { template?: string }) => {
    const template = options.template as TemplateType | undefined;
    const isValid = template && Object.keys(TEMPLATE_REGISTRY).includes(template);
    await createProject(projectName, isValid ? template : undefined);
  });

program
  .command('new')
  .description('Create a new browser extension project (interactive mode)')
  .option('-t, --template <template>', 'Template to use (vanilla, react, vue, solid, svelte)')
  .allowExcessArguments(true)
  .action(async (options: { template?: string }) => {
    const template = options.template as TemplateType | undefined;
    const isValid = template && Object.keys(TEMPLATE_REGISTRY).includes(template);
    await createProject(undefined, isValid ? template : undefined);
  });

async function createProject(projectName: string | undefined, templateName: TemplateType | undefined): Promise<void> {
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

  // Get available templates from the registry
  const availableTemplates = getAvailableTemplates();

  let template: TemplateType | undefined;
  if (templateName) {
    if (availableTemplates.includes(templateName)) {
      template = templateName;
    } else {
      // Template is registered but not available on disk
      console.error(picocolors.red('✗'), `Template '${templateName}' is not available yet. Coming soon!`);
      process.exit(1);
    }
  } else {
    // Filter templates to only show available ones
    const availableOptions = availableTemplates.map((t) => ({
      value: t,
      label: TEMPLATE_REGISTRY[t]?.label || t,
      hint: TEMPLATE_REGISTRY[t]?.description || '',
    }));

    const result = await select({
      message: 'Pick a template',
      options: availableOptions,
    });

    if (isCancel(result)) {
      cancel('Operation cancelled');
      process.exit(0);
    }
    template = result as TemplateType;
  }

  if (!template) {
    console.error(picocolors.red('✗'), 'Template selection is required');
    process.exit(1);
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

// dev command
program
  .command('dev')
  .description('Start development server with hot reload')
  .option('-p, --port <port>', 'Port to use for dev server')
  .action(async (_options: { port?: string }) => {
    console.log(picocolors.cyan('→ Starting development server...'));
    // Would integrate with vite dev server and HMR
  });

// build command
program
  .command('build')
  .description('Build extension for production')
  .option('--mode <mode>', 'Build mode (development, staging, production)', 'production')
  .action(async (_options: { mode?: string }) => {
    console.log(picocolors.cyan('→ Building extension...'));
    // Would orchestrate manifest generation, vite build, and plugins
  });

// zip command
program
  .command('zip')
  .description('Package extension into ZIP file')
  .option('-o, --output <output>', 'Output path for ZIP file')
  .action(async (_options: { output?: string }) => {
    console.log(picocolors.cyan('→ Creating ZIP package...'));
    // Would invoke zip plugin
  });

// release command
program
  .command('release')
  .description('Create a new release with version bump and changelog')
  .option('--pre-release <type>', 'Create pre-release (alpha, beta, rc)')
  .action(async (_options: { preRelease?: string }) => {
    console.log(picocolors.cyan('→ Creating release...'));
    // Would orchestrate version bump, changelog, zip, and git tagging
  });

// publish command
program
  .command('publish')
  .description('Publish extension to stores')
  .option('--chrome', 'Publish to Chrome Web Store')
  .option('--addons', 'Publish to Firefox Addons')
  .action(async (_options: { chrome?: boolean; addons?: boolean }) => {
    console.log(picocolors.cyan('→ Publishing extension...'));
    // Would orchestrate release and store publishing
  });

// doctor command
program
  .command('doctor')
  .description('Run diagnostics on the project')
  .action(async () => {
    console.log(picocolors.cyan('→ Running diagnostics...'));
    // Would check Node.js version, npm, browser compatibility, etc.
  });

// lint command
program
  .command('lint')
  .description('Run ESLint and TypeScript checking')
  .option('--fix', 'Auto-fix issues')
  .action(async (_options: { fix?: boolean }) => {
    console.log(picocolors.cyan('→ Running linter...'));
  });

// test command
program
  .command('test')
  .description('Run tests')
  .option('--watch', 'Watch mode')
  .option('--e2e', 'Run end-to-end tests')
  .action(async (_options: { watch?: boolean; e2e?: boolean }) => {
    console.log(picocolors.cyan('→ Running tests...'));
    // Would orchestrate Vitest and Playwright
  });

program.parse();