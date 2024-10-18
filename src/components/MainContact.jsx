import './maincontact.css';
import { useContext, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../context/context';

/**
 * @param {Object} param0 parametres
 * @param {{uuid, name, email, uname, bio, profile, active }} param0.user
 */
export default function MainContact({ user: userin, online }) {
  const { uuid, setUser, ...moreUserInfo } = useContext(User);
  const { state } = useLocation();
  const user = userin || state?.user || {};
  const modalRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', value: '' });
  const readOnly = ['uuid', 'email', 'active', 'online'].find(
    (n) => n == formData.name
  );
  const canEdit = uuid == user.uuid;
  return (
    <main className="main contact nofooter bg_logo">
      <div
        className={'online _' + (online || user.active)}
        title={online || user.active ? 'online' : 'offline'}
      ></div>
      {user.uuid ? (
        <>
          <div className="relative profile_image">
            <img role='button' className="profile" src={user.profile} alt="" />
            {canEdit && (
              <button
                onClick={() => openModal('profile')}
                className="material-symbols-outlined bottom_left"
              >
                edit
              </button>
            )}
          </div>
          <ul>
            {!canEdit && (
              <Link
                className="btn hero"
                state={{ user }}
                to={`/chat/public/${user.uuid}`}
              >
                Chat with {user.name}
              </Link>
            )}
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
      ): moreUserInfo.isLoading ? (
        <span>Loading user ... </span>
      ) : (
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
        </center>
      )}
      <dialog ref={modalRef} id="edit_form">
        <form onSubmit={onSubmit}>
          <header>update {formData.name}</header>
          <label>
            {formData.name == 'profile' ? (
              <input
                onChange={({ target }) => {
                  setFormData({ name: formData.name, value: target.files[0] });
                }}
                type="file"
                name="image"
              />
            ) : (
              <Input
                inputType={formData.name}
                placeholder={formData.name}
                readOnly={readOnly}
                value={formData.value || ''}
                onChange={({ target }) => {
                  setFormData({ name: formData.name, value: target.value });
                }}
                type="text"
                name={formData.name}
              />
            )}
          </label>
          {readOnly && <div className="warning">This field is readOnly.</div>}
          <button disabled={readOnly} className="btn hero">
            save
          </button>
          <i>&nbsp; &nbsp;</i>
          <button
            onClick={() => {
              modalRef.current.close();
              setFormData({ value: '', name: '' });
            }}
            className="warning"
            type="button"
          >
            cancel
          </button>
        </form>
      </dialog>
    </main>
  );
  function openModal(fieldName) {
    setFormData({ name: fieldName, value: user[fieldName] });
    modalRef.current.showModal();
  }
  async function onSubmit(e) {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    let data;
    if (formData.name == 'profile') {
      data = new FormData();
      data.append('image', formData.value);
    } else data = JSON.stringify({ [formData.name]: formData.value });
    console.log(formData.value);
    console.log(data);
    const d =
      formData.name == 'profile'
        ? {
            method: 'POST',
            body: data,
          }
        : {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data,
          };
    const r1 = await fetch('/api/info/me', d);
    if (!r1 || !r1.ok || r1.status == 401) {
      setIsLoading(false);
      return alert('failed\n' + (r1.statusText || r1.status));
    }
    let r2 = await r1.json().catch((e) => {
      setIsLoading(false);
      console.warn(e);
      return null;
    });
    if (!r2) {
      setIsLoading(false);
      return alert('no data from server');
    }
    console.log(r2.user);
    
    setUser((p) => {
      console.log({ ...p, ...r2.user });
      
      return { ...p, ...r2.user };
    });
    modalRef.current.close();
    setIsLoading(false);
  }
}

function Input({ value, inputType, ...props }) {
  if (inputType == 'bio')
    return <textarea value={value} rows="3" cols="35" {...props}></textarea>;
  if (inputType == 'profile')
    return <input {...props} accept="image" type="file" name="image" />;

  return <input value={value} {...props}></input>;
}
