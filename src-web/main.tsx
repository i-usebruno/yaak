import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { type } from '@tauri-apps/plugin-os';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import './main.css';

import('react-pdf').then(({ pdfjs }) => {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
});

// Hide decorations here because it doesn't work in Rust for some reason (bug?)
const osType = type();
if (osType !== 'macos') {
  await getCurrentWebviewWindow().setDecorations(false);
}

window.addEventListener('keydown', (e) => {
  // Hack to not go back in history on backspace. Check for document body
  // or else it will prevent backspace in input fields.
  if (e.key === 'Backspace' && e.target === document.body) e.preventDefault();
});

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
