/// <reference types="chrome"/>

console.log('Content script loaded');

// Example: Modify the page
const heading = document.querySelector('h1');
if (heading) {
  heading.textContent = 'Content script was here!';
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
});

// Send a message to background
chrome.runtime.sendMessage({ type: 'GREETING' }, (response) => {
  console.log('Response from background:', response);
});