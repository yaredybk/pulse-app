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
        <div>
          <h2 className="warn">Login/Signup to get access</h2>
          <br />
          <a href="/api/login" className="btn hero login">
            login
          </a>
        </div>
      )}
      {userInfo.name && <UserDetailes {...userInfo} />}
      <br />
      {process.env.NODE_ENV == 'development' && (
        <>
          <a href="/api/login" className="btn hero login">
            login
          </a>
          <button
            onClick={() => fetch('/api/protected')}
            className="btn hero login"
          >
            refetch
          </button>
        </>
      )}
    </main>
  );
}
