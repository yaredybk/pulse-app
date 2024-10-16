import './mainchat.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Sync, User } from '../context/context';
import ProfileSmall from './ProfileSmall';
import { scroll_bottom } from '../utils/utils';

/**
 * @param {Object} param0 parametres
 * @param {{uuid, name, email, uname, bio, profile, active }} param0.user
 */
export default function MainChat({ user: userin }) {
  const inputRef = useRef();
  const _sw = useContext(Sync);
  const me = useContext(User);
  const { category, uuid } = useParams();
  const { state = {} } = useLocation();
  const user = userin || state?.user || {};
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
  function getUpdates({ data, fromuuid }) {
    if (fromuuid != uuid) return console.warn('uuid missmatch');
    setmessages_({ content: data, uuid: user.uuid });
  }
  async function getMessages() {
    const r_ = await fetch(`/api/list/chat/${category}/${uuid}`).catch(
      console.warn
    );
    if (!r_ || !r_.ok) return console.warn(r_);
    const r2_ = await r_.json();
    if (r2_) {
      setmessages(r2_);
      scroll_bottom('main');
    } else {
      console.warn('no ms', r2_);
    }
  }
  useEffect(() => {
    if (!me.isLoading) getMessages();
  }, [me.isLoading]);
  useEffect(() => {
    _sw.messageMain.update && getUpdates(_sw.messageMain);
  }, [_sw.messageMain.update]);
  function send() {
    if (!text) {
      return inputRef.current.focus();
    }
    let data = {
      path: `/api/chat/${category}/${uuid}`,
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
        
        <i style={{marginTop:'auto'}}>your chat with {user.name}</i>
        {messages.map((ms, ind) => (
          <div
            className={me.uuid == ms.uuid ? 'pre me' : 'pre you ' + ms.uuid}
            key={ind}
          >
            {user.uuid == ms.uuid && <ProfileSmall src={user.profile} />}
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
