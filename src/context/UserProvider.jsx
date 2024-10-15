import { useState } from 'react';
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
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user_info') || '{}')
  );
  function setUserLocalSt(user) {
    setUser({ ...user });
    localStorage.setItem('user_info', JSON.stringify(user));
  }
  async function refresh() {
    return new Promise((resolve, reject) => {
      _getMe()
        .then((user_) => {
          if (!user_ && window.location.pathname != '/a/profile/me') {
            setUserLocalSt({ isLoading: false });
            window.location.assign('/a/profile/me');
          } else {
            document.title = `Pulse | ${user_?.name || user_?.email}`;
            setUserLocalSt({ ...user, ...user_, isLoading: false });
          }
          resolve();
        })
        .catch((e) => {
          console.warn(e);
          reject();
        });
    });
  }
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
