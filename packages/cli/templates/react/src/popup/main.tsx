import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function Popup() {
  const [counter, setCounter] = useState(0);

  return (
    <div className="container">
      <h1>Hello from {{projectName}}!</h1>
      <p>Counter: <span id="counter">{counter}</span></p>
      <button onClick={() => setCounter(counter + 1)}>+1</button>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}