import { Command } from 'commander';
import picocolors from 'picocolors';
import { intro, outro, select, text, isCancel, cancel } from '@clack/prompts';
import { ProjectCreator } from '@extension-forge/core';
import { TEMPLATES } from '@extension-forge/shared';
import { isValidProjectName } from '@extension-forge/shared';

const program = new Command();

program
  .name('extension-forge')
  .description('A CLI tool for creating browser extensions')
  .version('0.1.0')
  .argument('[project-name]', 'Name of the extension project')
  .option('-t, --template <template>', 'Template to use (vanilla, react, vue, solid, svelte)')
  .action(async (projectName: string | undefined, options: { template?: string }) => {
    await createProject(projectName, options.template);
  });

async function createProject(projectName: string | undefined, templateName: string | undefined): Promise<void> {
  console.log(picocolors.inverse(picocolors.bold(' extension-forge ')));
  console.log();

  // Ask for project name if not provided
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

  // Ask for template if not provided
  let template: string;
  if (templateName) {
    template = templateName;
  } else {
    const result = await select({
      message: 'Pick a template',
      options: TEMPLATES.map((t: string) => ({
        value: t,
        label: t.charAt(0).toUpperCase() + t.slice(1),
      })),
    });

    if (isCancel(result)) {
      cancel('Operation cancelled');
      process.exit(0);
    }
    template = result as string;
  }

  intro(`Creating a new extension-forge project in ${picocolors.cyan(`./${name}`)}`);

  const creator = new ProjectCreator();

  try {
    await creator.create({
      name,
      template,
    });

    outro(
      `${picocolors.green('✔')} Project created successfully!

Next steps:
  ${picocolors.dim('cd')} ${name}
  ${picocolors.dim('pnpm')} install
  ${picocolors.dim('pnpm')} dev
`
    );
  } catch (error) {
    console.error(picocolors.red('✗'), error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

program.parse();