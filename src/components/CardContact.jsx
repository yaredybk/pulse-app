import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * @param {Object} param0 parametres
 * @param {{uuid, name, email, uname, bio, profile, active }} param0.user
 * @param {string} param0.to base url to go
 * @param {string} param0.active uuid of the active user/room ...
 */
export default function CardContact({
  user,
  type = 'user',
  to = '/contact/global/',
  active,
}) {
  const { state } = useLocation();
  if (state?.user && !user.name) user = state.user;
  const [user3, setUser3] = useState({});
  useEffect(() => {
    if (!user.name)
      fetch(`/api/info/${type}/${user.uuid}`)
        .then((r) => {
          console.log(r);
          if (!r?.ok) console.warn('no data');
          else
            r.json().then((d) => {
              console.log(d);
              setUser3(d);
            });
        })
        .catch(console.warn);

    return () => {};
  }, [user.uuid]);
  if (!user.name)
    return (
      <Link
        to={to + user3.uuid}
        state={{ user: user3 }}
        className={
          active == user3.uuid ? `card contact active` : `card contact`
        }
      >
        <img src={user3.profile} alt="" />
        <span>{user3.name}</span>
      </Link>
    );
  return (
    <Link
      to={to + user.uuid}
      state={{ user }}
      className={active == user.uuid ? `card contact active` : `card contact`}
    >
      <img src={user.profile} alt="" />
      <span>{user.name}</span>
    </Link>
  );
}
