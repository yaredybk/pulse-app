import './App.css';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import ProfilePage from './pages/profile/ProfilePage';
import { useContext } from 'react';
import { User } from './context/user_context';

function App() {
  const routesList = [{ path: '/profile/*', element: ProfilePage }];
  const { pathname } = useLocation();
  const user = useContext(User);

  return (
    <>
      <Routes>
        <Route index element={<HomePage />}></Route>
        {routesList.map((r) => (
          <Route key={r.path} path={r.path} element={<r.element />}></Route>
        ))}
      </Routes>
      <br />
      {user.name && !pathname.match(/^\/$/) && (
        <Link className="btn hero" to="/">
          Chat
        </Link>
      )}
    </>
  );
}

export default App;
