import type { Plugin } from './plugin-interface.js';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Logger } from '@mv3-forge/shared';

const logger = new Logger('[changelog-plugin]');

export const changelogPlugin = (): Plugin => ({
  name: 'changelog',
  hooks: {
    async beforeBuild() {
      logger.step('Preparing changelog generation...');
    },
    async afterBuild() {
      // Generate changelog from conventional commits
      const changelog = await generateChangelog();
      logger.success(`Changelog generated`);
      return changelog;
    },
  },
});

export interface ChangelogEntry {
  type: 'feat' | 'fix' | 'docs' | 'style' | 'refactor' | 'perf' | 'test' | 'build' | 'ci' | 'chore' | 'revert';
  scope?: string;
  message: string;
  breaking: boolean;
}

export async function generateChangelog(): Promise<string> {
  // This would integrate with conventional changelog or parse git commits
  // For now, return a basic placeholder
  return `# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
`;
}

export async function writeChangelog(projectRoot: string, content: string): Promise<void> {
  const changelogPath = join(projectRoot, 'CHANGELOG.md');
  await fs.writeFile(changelogPath, content, 'utf-8');
}