import { Link, useLocation } from 'react-router-dom';

/**
 * @param {Object} param0 parametres
 * @param {{uuid, name, email, uname, bio, profile, active }} param0.user
 */
export default function MainContact({ user: userin }) {
  const { state: { user: userstate } = {} } = useLocation();
  const user = userin || userstate || {};
  return (
    <main className="main contact">
      <img src={user.profile} alt="" />
      <Link
        className="btn hero"
        state={{ user }}
        to={`/chat/public/${user.uuid}`}
      >
        Chat with {user.name}
      </Link>
      {Object.keys(user)
        .filter((k) => k != 'profile')
        .map((k, i) => (
          <span key={k}>
            <i>{k}: </i>
            <b>{user[k]}</b>
          </span>
        ))}
    </main>
  );
}
