import { useEffect, useState } from 'react';
import './profile.css';
import Header from '../../layout/header/Header';
import { _getMe } from '../../utils/utils';

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState({});
  async function getMe() {
    let me = await _getMe();
    if (me) return setUserInfo(me.user || me);
    setUserInfo();
  }
  useEffect(() => {
    getMe();
  }, []);

  return (
    <main className="page profile">
      <Header />
      {!userInfo && (
        <div>
          <b className="warn">USER ERROR</b>
          <a href="/logout" className="btn warn logout">
            logout
          </a>
          <br />
          <br />
          <a href="/login" className="btn hero login">
            login
          </a>
        </div>
      )}
      {userInfo &&
        (userInfo.name ? <UserDetailes {...userInfo} /> : <>Loading</>)}
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
      <a href="/logout" className="btn warn logout">
        logout
      </a>
    </div>
  );
}
