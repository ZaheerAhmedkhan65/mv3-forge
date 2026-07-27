/// <reference types="chrome"/>

console.log('Content script loaded');

// Example: Send a message to the background script
chrome.runtime.sendMessage({ type: 'GREETING', data: 'Hello from content script!' }, (response) => {
  console.log('Response from background:', response);
});