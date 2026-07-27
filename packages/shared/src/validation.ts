import { TEMPLATE_REGISTRY, type Template } from './template-registry.js';

// Get template names for validation
const TEMPLATE_NAMES = Object.keys(TEMPLATE_REGISTRY) as Template[];

export function isValidProjectName(name: string): boolean {
  // Must be a valid npm package name
  const packageNameRegex = /^(@[a-z0-9~][a-z0-9._~/-]*\/)?[a-z0-9~][a-z0-9._~/-]*$/;
  return packageNameRegex.test(name);
}

export function isValidTemplate(template: string): template is Template {
  return Object.prototype.hasOwnProperty.call(TEMPLATE_REGISTRY, template);
}

export function normalizeTemplate(template: string): Template {
  const normalized = template.toLowerCase();
  if (isValidTemplate(normalized)) {
    return normalized;
  }
  throw new Error(`Invalid template: ${template}. Valid templates are: ${TEMPLATE_NAMES.join(', ')}`);
}

export function isValidDirectoryName(name: string): boolean {
  // Must not contain path separators or invalid characters
  // eslint-disable-next-line no-control-regex
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
  return !invalidChars.test(name);
}