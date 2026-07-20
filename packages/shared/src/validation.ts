import { TEMPLATES, Template } from './constants.js';

export function isValidProjectName(name: string): boolean {
  // Must be a valid npm package name
  const packageNameRegex = /^(@[a-z0-9~][a-z0-9._~/-]*\/)?[a-z0-9~][a-z0-9._~/-]*$/;
  return packageNameRegex.test(name);
}

export function isValidTemplate(template: string): template is Template {
  return TEMPLATES.includes(template as Template);
}

export function normalizeTemplate(template: string): Template {
  const normalized = template.toLowerCase() as Template;
  if (isValidTemplate(normalized)) {
    return normalized;
  }
  throw new Error(`Invalid template: ${template}. Valid templates are: ${TEMPLATES.join(', ')}`);
}

export function isValidDirectoryName(name: string): boolean {
  // Must not contain path separators or invalid characters
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
  return !invalidChars.test(name);
}