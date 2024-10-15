import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import UserProvider from './context/UserProvider.jsx';
import SyncProvider from './context/SyncProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/a">
      <UserProvider>
        <SyncProvider>
          <App />
        </SyncProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
