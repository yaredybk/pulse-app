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
  to = '/contact/public/',
  active,
}) {
  const { state } = useLocation();
  if (state?.user && !user.name) user = state.user;
  const [user3, setUser3] = useState({});
  useEffect(() => {
    if (!user.name || !user.profile)
      fetch(`/api/info/${type}/${user.uuid}`)
        .then((r) => {
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
  const user_ = user.name ? user:user3;
    return (
      <Link
        to={to + user_.uuid}
        state={{ user: user_ }}
        className={
          active == user_.uuid ? `card contact active` : `card contact`
        }
      >
        <img src={user_.profile} alt="" />
        <span>{user_.name || user_.uuid}</span>
        <span className={user_.active? 'userisonline':'userisoffline'}></span>
      </Link>
    );
}
