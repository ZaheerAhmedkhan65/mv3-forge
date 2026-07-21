/// <reference types="chrome"/>

console.log('Options page loaded');

// DOM elements
const themeSelect = document.getElementById('theme') as HTMLSelectElement;
const saveButton = document.getElementById('save');

// Load saved settings
chrome.storage.sync.get(['theme'], (result) => {
  if (result.theme) {
    themeSelect.value = result.theme;
  }
});

// Save settings
if (saveButton) {
  saveButton.addEventListener('click', () => {
    chrome.storage.sync.set({ theme: themeSelect.value }, () => {
      console.log('Settings saved');
    });
  });
}