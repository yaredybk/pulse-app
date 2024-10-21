import './manageroom.css';
import '../../components/maincontact.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import RenderInfoFields from '../../components/RenderInfoFields';
import { User } from '../../context/context';
import CardContact from '../../components/CardContact';
import { closeDialog } from '../../utils/utils';

export default function ManageRoom() {
  const modalRef = useRef(null);
  const membersRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const { uuid: admin_uuid_ } = useContext(User);
  const [roomInfo, setroomInfo] = useState({});
  // const [newMembers, setnewRoomMembers] = useState({});
  // const [Members, setRoomMembers] = useState({});
  const [contactsList, setcontactsList] = useState([]);
  const { idroom, uuid } = useParams();
  const { state } = useLocation();
  const [formData, setFormData] = useState({ name: '', value: '' });
  useEffect(() => {
    // fetch
    fetchRoomInfo();
  }, [idroom, uuid]);
  const room = state?.room ? { ...state.room, ...roomInfo } : roomInfo;
  const canEdit = room?.admin_uuid == admin_uuid_;
  const readOnly = ['uuid', 'email', 'active', 'online'].find(
    (n) => n == formData.name
  );
  return (
    <>
      {/* <header className="header2">
        <h2>Manage room</h2>
        <ExitBtnMain onClick={() => window.history.back()} />
      </header> */}
      <main className="main info manage room nofooter">
        <RenderInfoFields
          canEdit={canEdit}
          online={false}
          openModal={openModal}
          user={roomInfo}
        >
          <div>
            <span className="flex1">
              <Link
                className="btn hero"
                state={{ room }}
                to={`/room/private/_/${room.idroom}`}
              >
                Chat in {room.name}
              </Link>
              {canEdit && (
                <button onClick={() => openModal('add_members')} type="button">
                  <span className="material-symbols-outlined">person_add</span>
                  add members
                </button>
              )}
            </span>
          </div>
        </RenderInfoFields>
      </main>
      <dialog onClick={closeDialog} ref={modalRef} id="edit_form">
        <form onSubmit={onSubmit}>
          <header className="dialog_header">update {formData.name}</header>
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
      <dialog onClick={closeDialog} ref={membersRef} id="edit_members">
        <div>
          {contactsList.map((user, i) => (
            <CardContact
              active={user.isSelected}
              key={user.iduser}
              user={user}
              onClick={() => setSelected(user, i)}
              btn
            />
          ))}
          <div className="buttons">
            <button
              disabled={readOnly}
              onClick={updateMembers}
              className="btn "
            >
              add
            </button>
            <button
              onClick={() => {
                membersRef.current.close();
                setFormData({ value: '', name: '' });
              }}
              className="warning"
              type="button"
            >
              cancel
            </button>
          </div>
          <header>add members</header>
        </div>
      </dialog>
    </>
  );
  function setSelected(user, ind) {
    contactsList[ind].isSelected = !contactsList[ind].isSelected;
    setcontactsList([...contactsList]);
  }
  async function fetchRoomInfo() {
    const url = `/api/info/room/${idroom}`;
    try {
      const r_ = await fetch(url);
      if (!r_ || !r_.ok) {
        alert('error\n' + r_.statusText);
        // if (r_.status == 401)
      }
      const r2_ = await r_.json();
      if (r2_) {
        setroomInfo(r2_.room);
      } else {
        console.warn('no ms', r2_);
      }
    } catch (error) {
      console.warn(error);
    }
  }
  async function openModal(fieldName) {
    if (fieldName == 'add_members') {
      membersRef.current.showModal();
      const r1 = await fetch('/api/list/contacts/public');
      if (r1.status == 200) {
        setcontactsList(await r1.json());
      }
      return;
    }
    setFormData({ name: fieldName, value: room[fieldName] });
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
    const r1 = await fetch('/api/info/room/' + idroom, d);
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
    setroomInfo((p) => {
      return { ...p, ...r2.user, ...r2.room };
    });
    modalRef.current.close();
    setIsLoading(false);
  }
  async function updateMembers(e) {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    let newMembers = contactsList
      .filter((e) => e.isSelected)
      .map(({ iduser }) => iduser);
    let body = JSON.stringify({ newMembers });
    const d = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    };
    const r1 = await fetch(`/api/info/room/${idroom}/members`, d);
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
    setroomInfo((p) => {
      return { ...p, ...r2.user };
    });
    membersRef.current.close();
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
