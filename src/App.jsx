import './App.css';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import ProfilePage from './pages/profile/ProfilePage';
import { useContext } from 'react';
import { User } from './context/user_context';
import Logo from './components/Logo';
import Header1 from './layout/header/Header1';
import Header2 from './layout/header/Header2';
import Nav2 from './layout/Nav2';
import Nav1 from './layout/Nav1';

function App() {
  // const user = useContext(User);
  return (
    <>
      <Logo />
      <Routes>
        <Route index element={<Header1 />} />
        <Route path=":title/*" element={<Header1 />} />
      </Routes>
      <Header2 />
      <Nav1 />
      <Routes>
        <Route index element={<Nav2 />} />
        <Route path=":title/" element={<Nav2 />} />
        <Route path=":title/:category" element={<Nav2 />} />
      </Routes>
      <Routes>
        <Route path="/me" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
