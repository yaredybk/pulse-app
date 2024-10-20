import './maincontact.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../context/context';
import ExitBtnMain from './ExitBtnMain';
import RenderInfoFields from './RenderInfoFields';
import { closeDialog } from '../utils/utils';

/**
 * @param {Object} param0 parametres
 * @param {{uuid, name, email, uname, bio, profile, active }} param0.user
 */
export default function MainContact({ user: userin, online }) {
  const { uuid, setUser, ...moreUserInfo } = useContext(User);
  const { state } = useLocation();
  const [usr_, setUsr_] = useState();
  const user = usr_|| userin || state?.user || {};
  const modalRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', value: '' });
  const readOnly = ['uuid', 'email', 'active', 'online'].find(
    (n) => n == formData.name
  );
  const canEdit = uuid == user.uuid;
  useEffect(() => {
    if (!user.name)
      fetch(`/api/info/user/${user.uuid}`)
        .then((r) => {
          if (!r?.ok) console.warn('no data');
          else
            r.json().then((d) => {
              setUsr_(d);
            });
        })
        .catch(console.warn);
  }, [user.uuid])
  
  if (moreUserInfo.isLoading ) return <main>Loading user ... </main>;
  return (
    <>
      <header className="header2 wide">
        <ExitBtnMain  />
      </header>
      <main className="main info contact nofooter bg_logo">
        {user.uuid ? (
          <RenderInfoFields
            canEdit={canEdit}
            online={online}
            user={user}
            openModal={openModal}
          >
            {!canEdit && (
              <Link
                className="btn hero"
                state={{ user }}
                to={`/chat/public/${user.uuid}`}
              >
                Chat with {user.name}
              </Link>
            )}
          </RenderInfoFields>
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
        <dialog onClick={closeDialog} ref={modalRef} id="edit_form">
          <form onSubmit={onSubmit}>
            <header className='dialog_header' >update {formData.name}</header>
            <label>
              {formData.name == 'profile' ? (
                <input
                  onChange={({ target }) => {
                    setFormData({
                      name: formData.name,
                      value: target.files[0],
                    });
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
            {readOnly ? (
              <div className="warning">This field is readOnly.</div>
            ) : (
              <button disabled={readOnly} className="btn hero">
                save
              </button>
            )}
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
    </>
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
    setUser((p) => {
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
