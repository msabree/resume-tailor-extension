import React from 'react';
import ReactDOM from 'react-dom/client';
import ActionPage from './ActionPage';

const root = document.createElement("div")
root.className = "container"
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <ActionPage />
  </React.StrictMode>
);