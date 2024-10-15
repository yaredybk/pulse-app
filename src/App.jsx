import './App.css';
import './components/conponents.css';
import { Route, Routes } from 'react-router-dom';
import ProfilePage from './pages/profile/ProfilePage';
import Logo from './components/Logo';
import Header1 from './layout/header/Header1';
import Header2 from './layout/header/Header2';
import Nav2 from './layout/Nav2';
import Nav1 from './layout/Nav1';
import MainContact from './components/MainContact';
import MainChat from './components/MainChat';
import Home from './pages/home/Home';

function App() {
  return (
    <>
      <Logo />
      {/* header1 */}
      <Routes>
        <Route index element={<Header1 />} />
        <Route path=":title/:category/*" element={<Header1 />} />
        <Route path=":title/*" element={<Header1 />} />
      </Routes>
      {/* header2 */}
      <Routes>
        <Route path=":title/:category/:uuid/*" element={<Header2 />} />
        <Route path="/" element={null} />
        <Route path="/*" element={<Header2 />} />
      </Routes>
      <Nav1 />
      {/* nav2 */}
      <Routes>
        <Route index element={<Nav2 />} />
        <Route path=":title/" element={<Nav2 />} />
        <Route path=":title/:category/" element={<Nav2 />} />
        <Route path=":title/:category/:uuid/*" element={<Nav2 />} />
        <Route path="/*" element={<b>nothing here</b>} />
      </Routes>
      {/* main */}
      <Routes>
        <Route path="/me" element={<ProfilePage />} />
        <Route path="/profile/me" element={<ProfilePage />} />
        <Route path="/" element={<Home />} />
        <Route path="/contact/:category/:id" element={<MainContact />} />
        <Route path="/chat/:category/:uuid" element={<MainChat />} />
        <Route path="/chat/:category/:uuid/:idchat" element={<MainChat />} />
        <Route
          path="/*"
          element={
            <center style={{ display: 'grid', placeItems: 'center' }}>
              <b className="warning red">Nothing here</b>
            </center>
          }
        />
      </Routes>
    </>
  );
}

export default App;
