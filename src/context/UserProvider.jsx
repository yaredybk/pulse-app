import { useEffect, useState } from 'react';
import { _getMe } from '../utils/utils';
import { User } from './context';

export default function UserProvider(props) {
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
      setUserLocalSt({ online: false, isLoading: false });
      return Promise.reject('offline');
    }
    let data = {};
    try {
      const res = await fetch('/api/info/me', { redirect: 'error' });
      if (res.status == 401) {
        if (window.location.pathname != '/a/profile/me') {
          setUserLocalSt({ isLoading: false });
          window.location.assign('/a/profile/me');
          return Promise.reject(401);
        }
      }
      if (!res.ok) {
        setUserLocalSt({ ...user, online: false, isLoading: false });
        return Promise.reject('error');
      }
      data = await res.json();
    } catch (e) {
      console.warn(e);
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
    </User.Provider>
  );
}
