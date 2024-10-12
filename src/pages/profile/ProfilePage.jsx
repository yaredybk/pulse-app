import { useContext, useEffect, useState } from 'react';
import './profile.css';
import Header from '../../layout/header/Header';
import { User } from '../../context/user_context';
import { useParams, useSearchParams } from 'react-router-dom';

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
    <main className="page profile">
      <Header />
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
    </main>
  );
}

function UserDetailes(params) {
  return (
    <div className="user">
      {params.picture && <img src={params.picture} alt="profile" />}
      <div className="name">{params.name}</div>
      <div>
        <div className="material-symbols-outlined">mail</div>
        {params.email}
      </div>
      <div>{params.sub}</div>
      <br />
      <a href="/api/logout" className="btn warn logout">
        logout
      </a>
    </div>
  );
}
