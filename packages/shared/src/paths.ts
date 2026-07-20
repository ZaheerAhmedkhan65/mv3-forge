import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

export const getDirname = (metaUrl: string): string => {
  return dirname(fileURLToPath(metaUrl));
};

export const resolveFromRoot = (segments: string[]): string => {
  return resolve(process.cwd(), ...segments);
};

export const joinPaths = (...paths: string[]): string => {
  return join(...paths);
};

export const getTemplatePath = (templateName: string): string => {
  // Resolve to templates directory
  const rootDir = process.cwd();
  // Go up to find the package root
  let templatesDir = resolve(rootDir);
  
  while (!templatesDir.endsWith('extension-forge') && templatesDir !== '/') {
    templatesDir = dirname(templatesDir);
  }
  
  return join(templatesDir, 'templates', templateName);
};