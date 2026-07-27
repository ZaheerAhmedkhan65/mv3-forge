/// <reference types="chrome"/>

console.log('Popup loaded');

// DOM elements
const greetingElement = document.getElementById('greeting');
const counterElement = document.getElementById('counter');
const incrementButton = document.getElementById('increment');

let counter = 0;

// Update counter display
function updateCounter() {
  if (counterElement) {
    counterElement.textContent = counter.toString();
  }
}

// Handle button click
if (incrementButton) {
  incrementButton.addEventListener('click', () => {
    counter++;
    updateCounter();
  });
}

// Initialize
updateCounter();