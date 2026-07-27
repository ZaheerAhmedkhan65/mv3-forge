/// <reference types="chrome"/>

console.log('Background service worker loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
});

// Example: Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message, sender);
  
  if (message.type === 'GREETING') {
    sendResponse({ greeting: 'Hello from background!' });
  }
  
  return true;
});