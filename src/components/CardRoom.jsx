import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * @param {Object} param0 parametres
 * @param {{uuid, name, email, uname, bio, profile, active }} param0.room
 * @param {string} param0.to base url to go
 * @param {string} param0.type contact type room | room
 * @param {string} param0.active uuid of the active room/room ...
 */
export default function CardRoom({
  room = {},
  to = '/public/',
  active,
  onClick = () => null,
}) {
  const { state } = useLocation();
  // if (!room.name & state?.room)
  room = room || state?.room || {};
  const [room1, setRoom3] = useState({});
  useEffect(() => {
    // || !room.profile  // removed
    if (!room.name)
      fetch(`/api/info/room/${room.idroom}`)
        .then((r) => {
          if (!r?.ok) console.warn('no data');
          else
            r.json().then((d) => {
              setRoom3(d);
            });
        })
        .catch(console.warn);
    return () => {};
  }, [room.uuid]);
  const room_ = room.name ? room : room1;
  return (
    <Link
      to={to + room_.idroom}
      state={{ room: room_ }}
      onClick={() => onClick(room_)}
      className={
        active == room_.uuid ? `card contact room active` : `card contact room`
      }
    >
      <img src={room_.profile} alt="" />
      <span>{room_.name || room_.uuid}</span>
      <span className={room_.active ? 'userisonline' : 'userisoffline'}></span>
    </Link>
  );
}
