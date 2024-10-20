import './App.css';
import './components/conponents.css';
import { Route, Routes } from 'react-router-dom';
import Nav2 from './layout/Nav2';
import MainContact from './components/MainContact';
import MainChat from './pages/chat/MainChat';
import Home from './pages/home/Home';
import { useContext } from 'react';
import { Sync, User } from './context/context';
import NothingHere from './components/NothingHere';
import Dev from '../dev/Dev';
import NewRoom from './components/new/NewRoom';
import ManageRoom from './pages/room/ManageRoom';

function App() {
  const { active, online, isLoading, refresh, setUser, ...userInfo } =
    useContext(User);
  const { isConnected } = useContext(Sync);
  return (
    <>
      
      {/* nav2 */}
      <Routes>
        <Route index element={null} />
        <Route path=":title/" element={<Nav2 depth={1} />} />
        <Route path=":title/:category/" element={<Nav2 depth={2} />} />
        <Route path=":title/:category/:uuid/:idroom" element={
          <Nav2 depth={4} />} />
        <Route path=":title/:category/:uuid/*" element={<Nav2 depth={3} />} />
        <Route path="/*" element={<NothingHere />} />
      </Routes>
      {/* main */}
      <Routes>
        <Route path="/dev" element={<Dev />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/me/*"
          element={<MainContact online={isConnected} user={userInfo} />}
        />
        <Route
          path="/profile/me/*"
          element={<MainContact online={isConnected} user={userInfo} />}
        />
        <Route path="/contacts/:category/:id" element={<MainContact />} />
        <Route path="/chat/:category/:uuid" element={<MainChat />} />
        <Route path="/chat/:category/:uuid/:idchat" element={<MainChat />} />
        <Route path="/room/:category/new" element={<NewRoom />} />
        <Route
          path="/room/info/:uuid/:idroom"
          element={<ManageRoom />}
        />
        <Route
          path="/room/:category/:idroom"
          element={<MainChat type="room" />}
        />
        <Route
          path="/room/:category/:uuid/:idroom"
          element={<MainChat type="room" />}
        />
        <Route path="/*" element={<NothingHere />} />
      </Routes>
    </>
  );
}

export default App;
