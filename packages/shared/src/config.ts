import { join } from 'path';
import { readJson } from './filesystem.js';
import { Logger } from './logger.js';
import { MANIFEST_VERSION } from './constants.js';

const logger = new Logger('[config]');

export interface ProjectMetadata {
  name: string;
  description: string;
  version: string;
}

export interface BrowserTargets {
  chrome: boolean;
  firefox: boolean;
  edge: boolean;
  safari: boolean;
}

export interface BuildConfig {
  outDir: string;
  sourceDir: string;
  publicDir: string;
  assetsDir: string;
  sourceMaps: boolean;
  minify: boolean;
}

export interface ExtensionConfig {
  manifestVersion: number;
  browserTargets: BrowserTargets;
  build: BuildConfig;
}

export interface EnvironmentConfig {
  mode: 'development' | 'staging' | 'production';
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
  browserSafeVars: Record<string, string>;
  serverOnlyVars: Record<string, string>;
}

export interface SharedConfig {
  projectRoot: string;
  projectMetadata: ProjectMetadata;
  extension: ExtensionConfig;
  environment: EnvironmentConfig;
  paths: {
    source: string;
    dist: string;
    public: string;
    assets: string;
    manifest: string;
    env: string;
  };
}

export class ConfigLoader {
  private static instance: SharedConfig | null = null;
  private static projectRoot: string;

  static setProjectRoot(root: string): void {
    this.projectRoot = root;
    this.instance = null;
  }

  static getProjectRoot(): string {
    return this.projectRoot || process.cwd();
  }

  static async load(): Promise<SharedConfig> {
    if (this.instance) {
      return this.instance;
    }

    const projectRoot = this.getProjectRoot();
    this.instance = await this.loadConfig(projectRoot);
    return this.instance;
  }

  private static async loadConfig(projectRoot: string): Promise<SharedConfig> {
    const packageJsonPath = join(projectRoot, 'package.json');
    const packageJson = await this.loadPackageJson(packageJsonPath);

    const envConfig = this.loadEnvironment();

    return {
      projectRoot,
      projectMetadata: {
        name: packageJson.name || 'mv3-extension',
        description: packageJson.description || '',
        version: packageJson.version || '1.0.0',
      },
      extension: {
        manifestVersion: MANIFEST_VERSION,
        browserTargets: {
          chrome: true,
          firefox: false,
          edge: false,
          safari: false,
        },
        build: {
          outDir: 'dist',
          sourceDir: 'src',
          publicDir: 'public',
          assetsDir: 'assets',
          sourceMaps: true,
          minify: true,
        },
      },
      environment: envConfig,
      paths: {
        source: join(projectRoot, 'src'),
        dist: join(projectRoot, 'dist'),
        public: join(projectRoot, 'public'),
        assets: join(projectRoot, 'assets'),
        manifest: join(projectRoot, 'manifest.json'),
        env: join(projectRoot, '.env'),
      },
    };
  }

  private static async loadPackageJson(path: string): Promise<Record<string, unknown>> {
    try {
      return await readJson(path);
    } catch {
      logger.warn('package.json not found, using defaults');
      return {};
    }
  }

  private static loadEnvironment(): EnvironmentConfig {
    const mode = (process.env.MV3_FORGE_ENV || 'development') as 'development' | 'staging' | 'production';

    const browserSafeVars: Record<string, string> = {};
    const serverOnlyVars: Record<string, string> = {};

    // Load browser-safe environment variables (MV3_FORGE_ prefix)
    for (const [key, value] of Object.entries(process.env)) {
      if (key.startsWith('MV3_FORGE_')) {
        const cleanKey = key.replace(/^MV3_FORGE_/, '');
        browserSafeVars[cleanKey] = value!;
      } else if (key.startsWith('MV3_SERVER_')) {
        // Server-only variables won't be exposed to the extension
        serverOnlyVars[key] = value!;
      }
    }

    return {
      mode,
      isDevelopment: mode === 'development',
      isStaging: mode === 'staging',
      isProduction: mode === 'production',
      browserSafeVars,
      serverOnlyVars,
    };
  }

  static reset(): void {
    this.instance = null;
  }
}

// Convenience function to get config
export async function getConfig(): Promise<SharedConfig> {
  return ConfigLoader.load();
}