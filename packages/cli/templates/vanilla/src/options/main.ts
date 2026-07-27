/// <reference types="chrome"/>

console.log('Options page loaded');

// Load saved settings
chrome.storage.sync.get(['theme'], (result) => {
  const themeSelect = document.getElementById('theme') as HTMLSelectElement;
  if (themeSelect && result.theme) {
    themeSelect.value = result.theme;
  }
});

// Save settings
const saveButton = document.getElementById('save');
if (saveButton) {
  saveButton.addEventListener('click', () => {
    const themeSelect = document.getElementById('theme') as HTMLSelectElement;
    if (themeSelect) {
      chrome.storage.sync.set({ theme: themeSelect.value }, () => {
        console.log('Settings saved');
      });
    }
  });
}