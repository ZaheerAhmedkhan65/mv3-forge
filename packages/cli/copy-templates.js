// Copy templates from monorepo root to CLI package during build
// This ensures templates are included in the published npm package

import { existsSync, mkdirSync, cpSync, rmSync, readdirSync, statSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Find monorepo root (where templates folder is)
function findMonorepoRoot(startDir) {
  let dir = startDir;
  while (dir !== '/' && !existsSync(join(dir, 'pnpm-workspace.yaml'))) {
    dir = dirname(dir);
  }
  return dir;
}

// Copy directory including dotfiles
function copyDirWithDotfiles(source, destination) {
  if (!existsSync(destination)) {
    mkdirSync(destination, { recursive: true });
  }
  
  const entries = readdirSync(source);
  for (const entry of entries) {
    const sourcePath = join(source, entry);
    const destPath = join(destination, entry);
    const stat = statSync(sourcePath);
    
    if (stat.isDirectory()) {
      copyDirWithDotfiles(sourcePath, destPath);
    } else {
      cpSync(sourcePath, destPath, { force: true });
    }
  }
}

const cliDir = __dirname;
const monorepoRoot = findMonorepoRoot(cliDir);
const sourceTemplatesDir = join(monorepoRoot, 'templates');
const targetTemplatesDir = join(cliDir, 'templates');

// Clean existing templates
if (existsSync(targetTemplatesDir)) {
  rmSync(targetTemplatesDir, { recursive: true, force: true });
}

// Copy templates including dotfiles
if (existsSync(sourceTemplatesDir)) {
  copyDirWithDotfiles(sourceTemplatesDir, targetTemplatesDir);
  console.log(`Templates copied from ${sourceTemplatesDir} to ${targetTemplatesDir}`);
} else {
  console.warn(`Source templates directory not found: ${sourceTemplatesDir}`);
}