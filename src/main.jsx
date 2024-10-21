import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserProvider from './context/UserProvider.jsx';
import SyncProvider from './context/SyncProvider.jsx';
import Nav1 from './layout/Nav1.jsx';
import Logo from './components/Logo.jsx';
import Header1 from './layout/header/Header1.jsx';
import UnreadMS from './pages/unread/UnreadMS.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/a">
      <UserProvider>
        <SyncProvider>
          <Logo />
          {/* header1 */}
          <Routes>
            <Route path=":title/:category/*" element={<Header1 />} />
            <Route path=":title/*" element={<Header1 />} />
            <Route path="/*" element={null} />
          </Routes>
          {/* header2 */}
          <header className="header2"></header>

          <Nav1 />
          <App />
          <UnreadMS />
        </SyncProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
