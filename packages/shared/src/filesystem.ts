import { promises as fs } from 'fs';
import { join } from 'path';
import { Logger } from './logger.js';

const logger = new Logger();

export async function copyDir(source: string, destination: string): Promise<void> {
  logger.debug(`Copying directory from ${source} to ${destination}`);
  await fs.cp(source, destination, { recursive: true });
}

export async function copyDirRecursive(source: string, destination: string): Promise<void> {
  logger.debug(`Copying directory recursively from ${source} to ${destination}`);
  await fs.cp(source, destination, { recursive: true });
}

export async function removeDir(path: string): Promise<void> {
  logger.debug(`Removing directory: ${path}`);
  await fs.rm(path, { recursive: true, force: true });
}

export async function writeJson(path: string, data: unknown): Promise<void> {
  logger.debug(`Writing JSON to ${path}`);
  await fs.writeFile(path, JSON.stringify(data, null, 2), 'utf-8');
}

export async function readJson<T = unknown>(path: string): Promise<T> {
  logger.debug(`Reading JSON from ${path}`);
  const content = await fs.readFile(path, 'utf-8');
  return JSON.parse(content) as T;
}

export async function isDirectory(path: string): Promise<boolean> {
  const stat = await fs.stat(path);
  return stat.isDirectory();
}

export async function isEmptyDirectory(path: string): Promise<boolean> {
  if (!(await isDirectory(path))) {
    return false;
  }
  const files = await fs.readdir(path);
  return files.length === 0;
}

export async function ensureDir(path: string): Promise<void> {
  await fs.mkdir(path, { recursive: true });
}

export async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

export async function readdirRecursive(dir: string): Promise<string[]> {
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