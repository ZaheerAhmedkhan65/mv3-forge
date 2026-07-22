/// <reference types="chrome"/>

import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function Options() {
  const [theme, setTheme] = useState('light');

  // Load saved settings
  chrome.storage.sync.get(['theme'], (result) => {
    if (result.theme) {
      setTheme(result.theme);
    }
  });

  const saveSettings = () => {
    chrome.storage.sync.set({ theme }, () => {
      console.log('Settings saved');
    });
  };

  return (
    <div className="container">
      <h1>Extension Options</h1>
      <p>Configure your {{projectName}} extension settings.</p>
      <div className="setting">
        <label htmlFor="theme">Theme:</label>
        <select id="theme" value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <button id="save" onClick={saveSettings}>Save Settings</button>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Options />);
}