import { useContext, useEffect } from 'react';
import './profile.css';
import { User } from '../../context/context';
import UserDetailes from '../../components/userDetails';

export default function ProfilePage() {
  const userInfo = useContext(User);
  useEffect(() => {
    // if(params)

    const url = new URLSearchParams(window.location.search);
    if (url.get('callback') == 'login') {
      fetch('/api/info/me?callback=login')
        .then((r) => (r.ok ? r.json() : Promise.reject('authentication error')))
        .then((r) => {
          userInfo.setUser({ ...userInfo, ...r.user });
        })
        .catch(console.warn);
    }
    return () => {};
  }, []);

  return (
    <main className="main profile">
      {userInfo.isLoading && <span>loading</span>}
      {!userInfo.isLoading && !userInfo.name && (
        <center>
          <h1
            style={{
              display: 'flex',
              marginInline: 'auto',
              gap:'1rem',
              justifyContent: 'center',
            }}
          >
            <img height={40} src="/a/favicon_bg.png" alt="logo" />
            pulse
          </h1>
          <i>Real-Time Conversations, Simplified</i>
          <h2 className="warn">Login/Signup to get access</h2>
          <br />
          <a href="/api/login" className="btn hero login">
            login
          </a>
        </center>
      )}
      {userInfo.name && <UserDetailes {...userInfo} />}
    </main>
  );
}
