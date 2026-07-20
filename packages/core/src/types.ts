export interface ProjectOptions {
  name: string;
  template: string;
  targetDir?: string;
  install?: boolean;
  description?: string;
}

export interface Manifest {
  manifest_version: number;
  name: string;
  version: string;
  description?: string;
  icons?: Record<string, string>;
  action?: {
    default_popup?: string;
    default_title?: string;
  };
  background?: {
    service_worker?: string;
    type?: string;
  };
  content_scripts?: Array<{
    matches: string[];
    js: string[];
    css?: string[];
  }>;
  permissions?: string[];
  host_permissions?: string[];
}

export interface TemplateContext {
  projectName: string;
  projectDescription: string;
  templateName: string;
}