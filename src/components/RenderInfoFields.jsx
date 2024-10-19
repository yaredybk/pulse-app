import { Link } from 'react-router-dom';

export default function RenderInfoFields({
  canEdit,
  online,
  user = {},
  openModal,
  children
}) {
  return (
    <>
      <div
        className={'online _' + (online || user.active)}
        title={online || user.active ? 'online' : 'offline'}
      ></div>
      <div className="relative profile_image">
        <img role="button" className="profile" src={user.profile} alt="" />
        <span className="bottom_left user_name">{user.name}</span>
        {canEdit && (
          <button
            onClick={() => openModal('profile')}
            className="material-symbols-outlined bottom_right"
          >
            edit
          </button>
        )}
      </div>
      <ul>
        {children}
        {Object.keys(user)
          .filter((k) => k != 'profile')
          .map((k) => (
            <li className={k} key={k}>
              <i>{k}: </i>
              <b>{user[k]}</b>
              {canEdit && (
                <button
                  onClick={() => openModal(k)}
                  className="material-symbols-outlined"
                >
                  edit
                </button>
              )}
            </li>
          ))}
        {canEdit && (
          <>
            <a
              href="/a/"
              style={{
                backgroundColor: 'greenyellow',
                borderRadius: '1rem',
                padding: '0.5rem 3rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                fontSize: '1.3rem',
              }}
              className=" hero"
            >
              <span className="material-symbols-outlined hero">home</span>
              <span>Go to Home</span>
            </a>
            <br />
            <a href="/api/logout" className="btn warn logout">
              logout
            </a>
          </>
        )}
      </ul>
    </>
  );
}
