import './App.css';
import './components/conponents.css';
import { Route, Routes } from 'react-router-dom';
import Logo from './components/Logo';
import Header1 from './layout/header/Header1';
import Header2 from './layout/header/Header2';
import Nav2 from './layout/Nav2';
import Nav1 from './layout/Nav1';
import MainContact from './components/MainContact';
import MainChat from './components/MainChat';
import Home from './pages/home/Home';
import { useContext } from 'react';
import { Sync, User } from './context/context';
import NothingHere from './components/NothingHere';
import Dev from '../dev/Dev';

function App() {
  const { active, online, isLoading, refresh, setUser, ...userInfo } =
    useContext(User);
  const { isConnected } = useContext(Sync);
  return (
    <>
      <Logo />
      {/* header1 */}
      <Routes>
        <Route path=":title/:category/*" element={<Header1 />} />
        <Route path=":title/*" element={<Header1 />} />
        <Route path="/*" element={null} />
      </Routes>
      {/* header2 */}
      <Routes>
        <Route
          path="/"
          element={
            <header>
              <p>HOME</p>
            </header>
          }
        />
        <Route index element={<Header2 user={userInfo} index />} />
        <Route path="/:title" element={<Header2 />} />
        <Route path="/:title/:category" element={<Header2 />} />
        <Route path=":title/:category/:uuid/*" element={<Header2 />} />
        <Route path="/*" element={<Header2 />} />
      </Routes>
      <Nav1 />
      {/* nav2 */}
      <Routes>
        <Route index element={null} />
        <Route path=":title/" element={<Nav2 />} />
        <Route path=":title/:category/" element={<Nav2 />} />
        <Route path=":title/:category/:uuid/*" element={<Nav2 />} />
        <Route path="/*" element={<NothingHere />} />
      </Routes>
      {/* main */}
      <Routes>
        <Route path="/dev" element={<Dev/>}/>
        <Route path="/" element={<Home />} />
        <Route
          path="/me"
          element={<MainContact online={isConnected} user={userInfo} />}
        />
        <Route
          path="/profile/me"
          element={<MainContact online={isConnected} user={userInfo} />}
        />
        <Route path="/contact/:category/:id" element={<MainContact />} />
        <Route path="/chat/:category/:uuid" element={<MainChat />} />
        <Route path="/chat/:category/:uuid/:idchat" element={<MainChat />} />
        <Route path="/*" element={<NothingHere />} />
      </Routes>
    </>
  );
}

export default App;
