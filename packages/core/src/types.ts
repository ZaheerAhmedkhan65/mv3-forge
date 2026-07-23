export interface ProjectOptions {
  name: string;
  template: string;
  targetDir?: string;
  install?: boolean;
  description?: string;
}

// Full Chrome Manifest V3 types
export interface ManifestIcons {
  '16'?: string;
  '32'?: string;
  '48'?: string;
  '128'?: string;
}

export interface ManifestAction {
  default_popup?: string;
  default_title?: string;
  default_icon?: string | Record<string, string>;
}

export interface ManifestBackground {
  service_worker?: string;
  type?: 'module' | 'classic';
  scripts?: string[];
  persistent?: boolean;
}

export interface ManifestContentScript {
  matches: string[];
  js?: string[];
  css?: string[];
  run_at?: 'document_start' | 'document_end' | 'document_idle';
  exclude_matches?: string[];
  include_glob?: string;
  exclude_glob?: string;
  world?: 'main' | 'isolated';
}

export interface ManifestWebAccessibleResource {
  resources: string[];
  matches: string[];
}

export interface ManifestCommand {
  suggested_key?: {
    default?: string;
    mac?: string;
    linux?: string;
    chromeos?: string;
    shift?: string[];
    ctrl?: string[];
    alt?: string[];
    command?: string[];
  };
  description?: string;
}

export interface ManifestSidePanel {
  default_path?: string;
}

export interface ManifestDevTools {
  page: string;
}

export interface ManifestNewTab {
  url: string;
}

export interface ManifestOptionsUI {
  page: string;
  open_in_tab?: boolean;
}

export interface Manifest {
  manifest_version: 3;
  name: string;
  version: string;
  description?: string;
  icons?: ManifestIcons;
  action?: ManifestAction;
  options_page?: string;
  options_ui?: ManifestOptionsUI;
  background?: ManifestBackground;
  content_scripts?: ManifestContentScript[];
  web_accessible_resources?: ManifestWebAccessibleResource[];
  permissions?: string[];
  optional_permissions?: string[];
  host_permissions?: string[];
  commands?: Record<string, ManifestCommand>;
  side_panel?: ManifestSidePanel;
  devtools_page?: string;
  newtab?: ManifestNewTab;
}

export interface TemplateContext {
  projectName: string;
  projectDescription: string;
  templateName: string;
}