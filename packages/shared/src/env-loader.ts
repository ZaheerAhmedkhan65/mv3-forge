import { promises as fs } from 'fs';
import { join } from 'path';

const ENV_PATTERN = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/;

export interface EnvVars {
  [key: string]: string;
}

export function loadEnvFile(envPath: string): EnvVars {
  return loadEnvFromFileSync(envPath);
}

export async function loadEnvFileAsync(envPath: string): Promise<EnvVars> {
  try {
    const content = await fs.readFile(envPath, 'utf-8');
    return parseEnvContent(content);
  } catch {
    return {};
  }
}

function loadEnvFromFileSync(envPath: string): EnvVars {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const content = require('fs').readFileSync(envPath, 'utf-8');
    return parseEnvContent(content);
  } catch {
    return {};
  }
}

function parseEnvContent(content: string): EnvVars {
  const env: EnvVars = {};
  
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(ENV_PATTERN);
    if (match) {
      const key = match[1];
      let value = match[2];

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      env[key] = value;
    }
  }

  return env;
}

// Load .env files for different environments
export async function loadEnvFiles(projectRoot: string, mode: 'development' | 'staging' | 'production'): Promise<EnvVars> {
  const envVars: EnvVars = {};

  // Load base .env file
  const baseEnvPath = join(projectRoot, '.env');
  Object.assign(envVars, await loadEnvFileAsync(baseEnvPath));

  // Load mode-specific .env file
  const modeEnvPath = join(projectRoot, `.env.${mode}`);
  Object.assign(envVars, await loadEnvFileAsync(modeEnvPath));

  return envVars;
}