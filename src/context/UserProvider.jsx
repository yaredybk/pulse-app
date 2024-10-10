import { useEffect, useState } from 'react';
import { _getMe } from '../utils/utils';
import { User } from './user_context';

export default function UserProvider(props) {
  /**
   * @type {[user:{
   * name: string,
   * picture: string,
   * sid: string,
   * email: string},setUser:function]}
   */
  const [user, setUser] = useState();
  useEffect(() => {
    _getMe().then((user_) => {
      if (!user_ && window.location.pathname != '/a/profile/me') {
        setUser({ isLoading:false});
        window.location.assign('/a/profile/me');
      } else {
        setUser({ ...user, ...user_ ,isLoading:false});
      }
    });
  }, []);
  return (
    <User.Provider value={{ ...user, setUser }}>{props.children}</User.Provider>
  );
}
