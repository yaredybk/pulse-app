import './mainchat.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Sync, User } from '../../context/context';
import ProfileSmall from '../../components/ProfileSmall';
import { scroll_bottom } from '../../utils/utils';

var lastVal = 0;
var observer;
/**
 * @param {Object} param0 parametres
 * @param {{uuid, name, email, uname, bio, profile, active }} param0.user
 */
export default function MainChat({ user: userin, type = 'chat' }) {
  const inputRef = useRef();
  const loadMoreRef = useRef();
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
  const [isFetching, setIsFetching] = useState(true);
  const [intersect, setIntersect] = useState('0%');
  function callback([v], observer) {
    if (v?.intersectionRatio > 0.5) getMessages(true, observer);
    setIntersect(`${v.intersectionRatio.toFixed(2) * 200}%`);
  }
  const _sw = useContext(Sync);
  const me = useContext(User);
  const { category, uuid, idchat, idroom } = useParams();
  const { state = {} } = useLocation();
  const user = idroom ? {} : userin || state?.user || {};
  const room = idroom ? state?.room || {} : {};
  const [text, setText] = useState('');

  /**
   * @param {{data, touuid, fromuuid, type, category}} param0
   */
  function getUpdates({ data, fromuuid, touuid, profile }) {
    if (idroom) {
      if (idroom != touuid) {
        return;
      }
      return setmessages_({ content: data, uuid: fromuuid, profile });
    } else if (fromuuid != uuid) return;
    setmessages_({ content: data, uuid: user.uuid, profile });
  }

  async function getMessages(loadMore, end_start) {
    setIsFetching('getting messages ...');
    let url = idroom
      ? `/api/list/room/${category}/${idroom}`
      : `/api/list/chat/${category}/${uuid}`;
    if (loadMore) {
      if (!lastVal) {
        setIsFetching('no more messages.');
        return alert('no more messages.');
      }
      url += `?cursor=idchat_text&value=${lastVal}`;
    }
    try {
      const r_ = await fetch(url);
      if (!r_) return;
      if (!r_.ok) {
        !loadMore && setmessages([]);
        if (r_.status == 401) {
          return setmessages([
            { content: 'UNAUTHORIZED\nyou are not allowed in this room!' },
          ]);
        }
      }
      const r2_ = await r_.json();
      if (r2_) {
        if (r2_.length == 0) {
          loadMore && end_start.disconnect();
          lastVal = -1;
          // tmp_last = -1;
        } else {
          lastVal = type == 'room' ? r2_[0].idroom_text : r2_[0].idchat_text;
          // tmp_last = r2_[0].idchat_text;
          if (loadMore) {
            let m = document.getElementById('main');
            let prev_h = m.scrollHeight;
            setmessages((p) => [{ content: r2_[0].created_at }, ...r2_, ...p]);
            setTimeout(() => {
              m.scrollBy(0, m.scrollHeight - prev_h);
              m = null;
            }, 0);
          } else {
            end_start();
            setmessages([{ content: r2_[0].created_at }, ...r2_]);
            scroll_bottom('main', 'smooth');
          }
        }
      } else {
        !loadMore && setmessages([]);
        console.warn('no ms', r2_);
      }
    } catch (error) {
      console.warn(error);
      !loadMore && setmessages([]);
    } finally {
      if (lastVal == -1) {
        setIsFetching('no more messages.');
      } else setIsFetching(false);
    }
  }
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    };
    if (!me.isLoading) {
      observer = new IntersectionObserver(callback, options);
      getMessages(null, () => {
        setTimeout(() => {
          loadMoreRef.current &&
            observer &&
            observer.observe(loadMoreRef.current);
        }, 1000);
      });
    }
    return () => {
      observer && observer.disconnect();
      observer = null;
    };
  }, [me.isLoading, idroom, idchat, uuid]);

  useEffect(() => {
    _sw.messageMain.update && getUpdates(_sw.messageMain);
  }, [_sw.messageMain.update]);
  function send() {
    inputRef.current.focus();
    if (!text) return;
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
  const profile_ = idroom ? null : user.profile;

  return (
    <>
      <main id="main" className="main chat">
        {idroom ? (
          <i style={{ marginTop: 'auto' }}>{room.name} chats</i>
        ) : (
          <i style={{ marginTop: 'auto' }}>your chat with {user.name}</i>
        )}
        <div id="LOADMORE" ref={loadMoreRef}>
          <div
            className={
              isFetching == 'no more messages.'
                ? 'status warning end'
                : 'status'
            }
          >
            {isFetching || 'load more'}
          </div>
          <div
            style={{
              '--t': intersect,
            }}
            className="range_slider"
          ></div>
        </div>
        {messages.map((ms, ind) => (
          <div
            className={
              me.uuid == ms.uuid
                ? 'pre me uuid_' + ms.uuid
                : 'pre you uuid_' + ms.uuid
            }
            key={ind}
          >
            {me.uuid != ms.uuid && (
              <ProfileSmall
                to={'/contacts/public/' + (user.uuid || ms.uuid)}
                uuid={ms.uuid}
                src={profile_ || ms.profile}
              />
            )}
            <pre>{ms.content}</pre>
          </div>
        ))}
      </main>
      <label className="main input">
        <textarea
          ref={inputRef}
          autoFocus
          autoCorrect="on"
          value={text}
          onKeyDown={(e) => {
            const { shiftKey, ctrlKey, key } = e;
            if ((shiftKey || ctrlKey) && key == 'Enter') {
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
      </label>
    </>
  );
}
