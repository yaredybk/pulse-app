import './mainchat.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Sync, User } from '../../context/context';
import ProfileSmall from '../../components/ProfileSmall';
import { scroll_bottom } from '../../utils/utils';

/**
 * @param {Object} param0 parametres
 * @param {{uuid, name, email, uname, bio, profile, active }} param0.user
 */
export default function MainChat({ user: userin, type = 'chat' }) {
  const inputRef = useRef();
  const _sw = useContext(Sync);
  const me = useContext(User);
  const { category, uuid, idchat, idroom } = useParams();
  const { state = {} } = useLocation();
  const user = idroom ? {} : userin || state?.user || {};
  const room = idroom ? state?.room || {} : {};
  const [text, setText] = useState('');

  /**
  @typedef  {Object} ChatText
  @property {number} idchat_text - Primary key.
  @property {string} content - Chat content.
  @property {number} uuid - Sender’s user ID.
  @property {string} created_at - Timestamp of creation.
  @property {string} updated_at - Timestamp of last update. */
  /**
   * @type {[Array<ChatText>,function]}  */
  const [messages, setmessages] = useState([]);
  function setmessages_(message) {
    setmessages((p) => [...p, message]);
    scroll_bottom('main');
  }
  /**
   * @param {{data, touuid, fromuuid, type, category}} param0
   */
  function getUpdates({ data, fromuuid, touuid }) {
    // if there idroom touuid is idroom
    if (idroom) {
      if (idroom != touuid) return;
      return setmessages_({ content: data, uuid: fromuuid });
    } else if (fromuuid != uuid) return;
    // console.warn('uuid missmatch');
    setmessages_({ content: data, uuid: user.uuid });
  }
  async function getMessages() {
    const url = idroom
      ? `/api/list/room/${category}/${idroom}`
      : `/api/list/chat/${category}/${uuid}`;
    try {
      const r_ = await fetch(url);
      if (!r_ || !r_.ok) {
        setmessages([]);
        if (r_.status == 401) {
          return setmessages([
            { content: 'UNAUTHORIZED\nyou are not allowed in this room!' },
          ]);
        }
      }
      const r2_ = await r_.json();
      if (r2_) {
        setmessages(r2_);
        scroll_bottom('main');
      } else {
        setmessages([]);
        console.warn('no ms', r2_);
      }
    } catch (error) {
      console.warn(error);
      setmessages([]);
    }
  }
  useEffect(() => {
    if (!me.isLoading) getMessages();
  }, [me.isLoading, idroom, idchat, uuid]);
  useEffect(() => {
    _sw.messageMain.update && getUpdates(_sw.messageMain);
  }, [_sw.messageMain.update]);
  function send() {
    if (!text) {
      return inputRef.current.focus();
    }
    let data = {
      path: `/api/${type}/${category}/${idroom || uuid}`,
      data: text,
    };
    if (_sw.isConnected && _sw.send) {
      _sw.send(JSON.stringify(data));
      setmessages_({
        content: text,
        uuid: me.uuid,
      });
      setText('');
    } else {
      console.warn('_sw.syncSend failed');
    }
  }
  return (
    <>
      <main className="main chat">
        {idroom ? (
          <i style={{ marginTop: 'auto' }}>{room.name} chats</i>
        ) : (
          <i style={{ marginTop: 'auto' }}>your chat with {user.name}</i>
        )}
        {messages.map((ms, ind) => (
          <div
            className={
              me.uuid == ms.uuid
                ? 'pre me uuid_' + ms.uuid
                : 'pre you uuid_' + ms.uuid
            }
            key={ind}
          >
            {me.uuid != ms.uuid && <ProfileSmall src={ms.profile} />}
            <pre>{ms.content}</pre>
          </div>
        ))}
      </main>
      <div className="main input">
        <textarea
          ref={inputRef}
          autoFocus
          autoCorrect="on"
          value={text}
          onKeyDown={(e) => {
            const { shiftKey, ctrlKey, code } = e;
            if ((shiftKey || ctrlKey) && code == 'Enter') {
              e.preventDefault();
              send();
            }
          }}
          onChange={({ target: { value } }) => setText(value)}
          name="message"
          id="message"
          rows="2"
        ></textarea>
        <button
          type="button"
          onClick={send}
          title="Shift + Enter  /  Ctrl + Enter"
          className="material-symbols-outlined"
        >
          send
        </button>
      </div>
    </>
  );
}
