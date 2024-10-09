import './App.css';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import ProfilePage from './pages/profile/ProfilePage';
import { _getMe } from './utils/utils';
import { useEffect } from 'react';

function App() {
  const routesList = [{ path: '/profile*', element: ProfilePage }];
  const { pathname } = useLocation();
  useEffect(() => {
    _getMe().then((u) => {
      if (!u && window.location.pathname != '/a/profile/me')
        window.location.assign('/a/profile/me');
    });
  }, []);

  return (
    <>
      <Routes>
        <Route index element={<HomePage />}></Route>
        {routesList.map((r) => (
          <Route key={r.path} path={r.path} element={<r.element />}></Route>
        ))}
      </Routes>
      <br />
      {!pathname.match(/^\/$/) && (
        <Link className="btn hero" to="/">
          Chat
        </Link>
      )}
    </>
  );
}

export default App;
