import { defineManifest } from '@mv3-forge/core';

export default defineManifest({
  name: '{{projectName}}',
  description: '{{projectDescription}}',
  version: '0.1.0',
  icons: {
    '16': 'src/icons/icon16.png',
    '32': 'src/icons/icon32.png',
    '48': 'src/icons/icon48.png',
    '128': 'src/icons/icon128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_title: '{{projectName}}',
  },
  options_page: 'index.html',
  background: {
    service_worker: 'background.js',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['content.js'],
    },
  ],
  permissions: ['storage', 'activeTab'],
  host_permissions: ['<all_urls>'],
});