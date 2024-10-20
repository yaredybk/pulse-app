import { useEffect, useRef, useState } from 'react';
import { User } from './context';

export default function UserProvider(props) {
  const loginRef = useRef();
  /**
   * @type {[user:{
   * online:boolean,
   * isLoading: boolean,
   * uuid:string,
   * name: string,
   * picture: string,
   * email: string},setUser:function]}
   */
  const [user, setUser] = useState({
    ...JSON.parse(localStorage.getItem('user_info') || '{}'),
    isLoading: true,
  });
  function setUserLocalSt(user) {
    setUser({ ...user });
    localStorage.setItem('user_info', JSON.stringify(user));
  }
  async function refresh() {
    if (!window.navigator.onLine) {
      setUserLocalSt({ ...user,online: false, isLoading: false });
      return Promise.reject('offline');
    }
    let data = {};
    try {
      const res = await fetch('/api/info/me', { redirect: 'manual' });
      if (
        res.status == 401 ||
        res.status == 302 ||
        res.type == 'opaqueredirect'
      ) {
        setUserLocalSt({ isLoading: false });
        console.log(loginRef.current);

        loginRef.current.showModal();
        // if (window.location.pathname != '/a/profile/me') {
        //   window.location.assign('/a/profile/me');
        // }
        return Promise.reject(401);
      }
      if (!res.ok) {
        setUserLocalSt({ ...user, online: false, isLoading: false });
        return Promise.reject('error');
      }
      data = await res.json();
    } catch (e) {
      console.warn(e);
      console.warn(e.status);
      setUserLocalSt({ online: false, isLoading: false });
      return Promise.reject({ online: false });
    }
    if (!data) {
      setUserLocalSt({ user, online: false, isLoading: false });
      return Promise.reject({ online: false });
    }
    if (data?.user) data = data.user;
    if (!data) {
      if (window.location.pathname != '/a/me') window.location.assign('/a/me');
      setUserLocalSt({ isLoading: false });
      return Promise.reject();
    } else {
      document.title = `Pulse | ${data?.name || data?.email}`;
      setUserLocalSt({ ...data, isLoading: false });
      return Promise.resolve();
    }
  }
  useEffect(() => {
    const offline = () => {
      console.log('offline');
      setUser((p) => {
        return { ...p, online: false, isLoading: false };
      });
    };
    window.addEventListener('offline', offline);
    const online = () => {
      console.log('online');
      refresh();
    };
    window.addEventListener('online', online);

    return () => {
      window.removeEventListener('offline', offline);
      window.removeEventListener('online', online);
    };
  }, []);

  // refresh is called on SyncProvider
  // useEffect(() => {
  //   refresh();
  // }, []);
  return (
    <User.Provider value={{ ...user, refresh, setUser }}>
      {props.children}
      <dialog ref={loginRef} id="login_dialog">
        <center>
          <h1>
            <img className="logo_inline" src="/a/favicon_bg.png" alt="logo" />
            pulse
          </h1>
          <i>Real-Time Conversations, Simplified</i>
          <h2 className="warn">Login/Signup to get access</h2>
          <br />
          <a href="/api/login" className="btn hero login">
            login
          </a>
          <br />
          <br />
          <br />
          <a href="/">back to home page</a>
        </center>
      </dialog>
    </User.Provider>
  );
}
